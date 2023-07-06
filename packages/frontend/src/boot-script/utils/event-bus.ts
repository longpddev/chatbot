import { TinyEmitter } from "tiny-emitter"
import { EventEmitter } from "./event-emitter"
import { EventBusEvents } from "../../interface"
export class EventBus {
  private readonly emitter = new TinyEmitter()

  createEmitter () {
    return new EventEmitter<EventBusEvents>(this.emitter)
  }
}
