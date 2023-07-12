import { type Destroyable } from "../../interface"
import { ListenerCollection } from "./listener-collection"

const VERSION = "1.0.0"
const PROTOCOL = "frame-rpc"

interface RequestMessage {
  arguments: unknown[]
  method: string
  protocol: typeof PROTOCOL
  sequence: number
  version: typeof VERSION
}

interface ResponseMessage {
  arguments: unknown[]
  protocol: typeof PROTOCOL
  response: number
  version: typeof VERSION
}

type Message = RequestMessage | ResponseMessage

type Callback = (...args: unknown[]) => void

function sendCall (
  port: MessagePort,
  method: string,
  args: unknown[] = [],
  sequence = -1
) {
  port.postMessage(
    /** @type {RequestMessage} */ {
      protocol: PROTOCOL,
      version: VERSION,
      arguments: args,
      method,
      sequence
    }
  )
}

/**
 * Install a message listener that ensures proper delivery of "close" notifications
 * from {@link PortRPC}s in Safari <= 15.
 *
 * This must be called in the _parent_ frame of the frame that owns the port.
 * In Hypothesis this means for example that the workaround would be installed
 * in the host frame to ensure delivery of "close" notifications from "guest"
 * frames.
 *
 * @param {string} [userAgent] - Test seam
 * @return {() => void} - Callback that removes the listener
 */
export function installPortCloseWorkaroundForSafari (
  /* istanbul ignore next */
  userAgent: string = navigator.userAgent
) {
  if (!shouldUseSafariWorkaround(userAgent)) {
    return () => {}
  }

  /** @param {MessageEvent} event */
  const handler = (event: MessageEvent) => {
    if (event.data?.type === "hypothesisPortClosed" && event.ports[0]) {
      const port = event.ports[0]
      sendCall(port, "close")
      port.close()
    }
  }

  window.addEventListener("message", handler)
  return () => window.removeEventListener("message", handler)
}

/**
 * Test whether this browser needs the workaround for https://bugs.webkit.org/show_bug.cgi?id=231167.
 *
 * @param {string} userAgent
 */
function shouldUseSafariWorkaround (userAgent: string) {
  const webkitVersionMatch = userAgent.match(/\bAppleWebKit\/([0-9]+)\b/)
  if (!webkitVersionMatch) {
    return false
  }
  const version = parseInt(webkitVersionMatch[1])

  // Chrome's user agent contains the token "AppleWebKit/537.36", where the
  // version number is frozen. This corresponds to a version of Safari from 2013,
  // which is older than all supported Safari versions.
  if (version <= 537) {
    return false
  }

  return true
}

/**
 * Callback type used for RPC method handlers and result callbacks.
 *
 * @typedef {(...args: unknown[]) => void} Callback
 */

/**
 * @param {any} value
 * @return {value is Callback}
 */
function isCallback (value: any) {
  return typeof value === "function"
}

/**
 * PortRPC provides remote procedure calls between frames or workers. It uses
 * the Channel Messaging API [1] as a transport.
 *
 * To communicate between two frames with this class, construct a PortRPC
 * instance in each and register method handlers with {@link on}. Create a
 * {@link MessageChannel} and send one of its two ports to each frame. Then call
 * {@link connect} to make the PortRPC instance in each frame use the corresponding
 * port.
 *
 * In addition to the custom methods that a PortRPC handles, there are several
 * built-in events which are sent automatically:
 *
 * - "connect" is sent when a PortRPC connects to a port. This event can
 *   be used to confirm that the sending frame has received the port and will
 *   send a "close" event when it goes away.
 * - "close" is sent when a PortRPC is destroyed or the owning frame is
 *   unloaded. This event may not be dispatched if the guest frame terminates
 *   abnormally (eg. due to an OS process crash).
 *
 * [1] https://developer.mozilla.org/en-US/docs/Web/API/Channel_Messaging_API
 *
 * @template {string} OnMethod - Names of RPC methods this client responds to
 * @template {string} CallMethod - Names of RPC methods this client invokes
 * @implements {Destroyable}
 */
export class PortRPC<OnMethod extends string, CallMethod extends string>
implements Destroyable {
  private _port: MessagePort | null = null
  private readonly _methods = new Map<string, Callback>()
  private readonly _callbacks = new Map<number, Callback>()
  private _sequence = 1
  private readonly _listeners = new ListenerCollection()
  private _pendingCalls: Array<[CallMethod, unknown[]]> = []
  private _receivedCloseEvent = false
  private _destroyed = false
  constructor (
    {
      userAgent = navigator.userAgent,
      currentWindow = window
    }: { userAgent: string, currentWindow: Window } = {
      userAgent: navigator.userAgent,
      currentWindow: window
    }
  ) {
    this._listeners.add(currentWindow, "unload", () => {
      if (this._port) {
        // Send "close" notification directly. This works in Chrome, Firefox and
        // Safari >= 16.
        sendCall(this._port, "close")

        // To work around a bug in Safari <= 15 which prevents sending messages
        // while a window is unloading, try transferring the port to the parent frame
        // and re-sending the "close" event from there.
        if (
          currentWindow !== currentWindow.parent &&
          shouldUseSafariWorkaround(userAgent)
        ) {
          currentWindow.parent.postMessage(
            { type: "euroland-port-closed" },
            "*",
            [this._port]
          )
        }
      }
    })
  }

  get initialized () {
    return !!this._port
  }

  /**
   * Register a method handler for incoming RPC requests.
   *
   * This can also be used to register a handler for the built-in "connect"
   * and "close" events.
   *
   * All handlers must be registered before {@link connect} is invoked.
   *
   */
  on (method: OnMethod | "close" | "connect", handler: Callback) {
    if (this._port) {
      throw new Error("Cannot add a method handler after a port is connected")
    }
    this._methods.set(method, /** @type {any} */ handler)
  }

  /**
   * Connect to a MessagePort and process any queued RPC requests.
   *
   * @param {MessagePort} port
   */
  connect (port: MessagePort) {
    this._port = port
    this._listeners.add(port, "message", (event) => this._handle(event))
    port.start()
    sendCall(port, "connect")

    for (const [method, args] of this._pendingCalls) {
      this.call(method, ...args)
    }
    this._pendingCalls = []
  }

  /**
   * Disconnect the RPC channel and close the MessagePort.
   */
  destroy () {
    if (this._port) {
      sendCall(this._port, "close")
      this._port.close()
    }
    this._destroyed = true
    this._listeners.removeAll()
  }

  /**
   * Send an RPC request via the connected port.
   *
   * If this client is not yet connected to a port, the call will be queued and
   * sent when {@link connect} is called.
   *
   * If the final argument in `args` is a function, it is treated as a callback
   * which is invoked with the response in the form of (error, result) arguments.
   *
   * @param {CallMethod} method
   * @param {unknown[]} args
   */
  call (method: CallMethod, ...args: unknown[]) {
    if (!this._port) {
      this._pendingCalls.push([method, args])
    }

    if (!this._port || this._destroyed) {
      return
    }

    const seq = this._sequence++
    const finalArg = args[args.length - 1]
    if (isCallback(finalArg)) {
      this._callbacks.set(seq, finalArg as Callback)
      args = args.slice(0, -1)
    }

    sendCall(this._port, method, args, seq)
  }

  /**
   * Validate message
   */
  _parseMessage ({ data }: MessageEvent): null | Message {
    if (!data || typeof data !== "object") {
      return null
    }
    if (data.protocol !== PROTOCOL) {
      return null
    }
    if (data.version !== VERSION) {
      return null
    }
    if (!Array.isArray(data.arguments)) {
      return null
    }

    return data
  }

  _handle (event: MessageEvent) {
    const msg = this._parseMessage(event)
    const port = this._port

    if (!msg || !port) {
      return
    }

    if ("method" in msg) {
      // Only allow close event to fire once.
      if (msg.method === "close") {
        if (this._receivedCloseEvent) {
          return
        } else {
          this._receivedCloseEvent = true
        }
      }

      const handler = this._methods.get(msg.method)
      if (!handler) {
        return
      }

      const callback = (...args: unknown[]) => {
        /** @type {ResponseMessage} */
        const message = {
          arguments: args,
          protocol: PROTOCOL,
          response: msg.sequence,
          version: VERSION
        }

        port.postMessage(message)
      }
      handler(...msg.arguments, callback)
    } else if ("response" in msg) {
      const _cb = this._callbacks.get(msg.response)
      this._callbacks.delete(msg.response)
      if (_cb) {
        _cb(...msg.arguments)
      }
    }
  }
}
