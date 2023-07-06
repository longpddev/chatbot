import type { Destroyable } from "../../interface"
import type { TinyEmitter } from "tiny-emitter"
export type AnyFunc = (...args: any[]) => any;
type ArgsFun<A extends unknown[]> = (...args: A) => void
export class EventEmitter <IEvents extends Record<string, unknown[]>> implements Destroyable {
  private readonly subscriptions = new Map<keyof IEvents, AnyFunc[]>()
  constructor (private readonly emitter: TinyEmitter) {}

  publish <E extends keyof IEvents> (event: E, ...args: IEvents[E]) {
    this.emitter.emit(event as string, ...args)
  }

  subscribe <E extends keyof IEvents> (event: E, handle: ArgsFun<IEvents[E]>) {
    const eventsCallback = this.subscriptions.get(event) ?? []
    eventsCallback.push(handle)
    this.subscriptions.set(event as string, eventsCallback)
    this.emitter.on(event as string, handle)
  }

  unsubscribe <E extends keyof IEvents> (event: E, handle?: ArgsFun<IEvents[E]>) {
    const eventsCallback = (this.subscriptions.get(event) ?? []).filter(
      (callback) => {
        let result = callback === handle
        if (!handle) result = false

        if (!result) {
          this.emitter.off(event as string, handle)
        }

        return result
      }
    )

    if (eventsCallback.length === 0) {
      this.subscriptions.delete(event)
    } else {
      this.subscriptions.set(event, eventsCallback)
    }
  }

  destroy () {
    for (const eventName of this.subscriptions.keys()) {
      this.unsubscribe(eventName)
    }
  }
}
