import type { AnyFunc, Destroyable } from "../../interface"
import type { TinyEmitter } from "tiny-emitter"

export class EventEmitter implements Destroyable {
  private readonly subscriptions = new Map<string, AnyFunc[]>()
  constructor (private readonly emitter: TinyEmitter) {}

  publish (event: string, ...args: unknown[]) {
    this.emitter.emit(event, ...args)
  }

  subscribe (event: string, handle: AnyFunc) {
    const eventsCallback = this.subscriptions.get(event) ?? []
    eventsCallback.push(handle)
    this.subscriptions.set(event, eventsCallback)
    this.emitter.on(event, handle)
  }

  unsubscribe (event: string, handle?: AnyFunc) {
    const eventsCallback = (this.subscriptions.get(event) ?? []).filter(
      (callback) => {
        let result = callback === handle
        if (!handle) result = false

        if (!result) {
          this.emitter.off(event, handle)
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
