import { TinyEmitter } from "tiny-emitter"
import { EventEmitter } from "./event-emitter"
export class EventBus {
  private readonly emitter = new TinyEmitter()

  createEmitter () {
    return new EventEmitter(this.emitter)
  }
}
