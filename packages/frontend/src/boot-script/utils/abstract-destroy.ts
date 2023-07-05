import { Destroyable } from "../../interface";

export default class AbstractDestroy implements Destroyable {
  private readonly _destroy: Array<() => void> = []

  taskDestroy (cb: () => void) {
    this._destroy.push(cb)
  }

  wrapDestroy<T extends Destroyable>(item: T): T {
    this.taskDestroy(() => item.destroy())
    return item;
  }

  destroy () {
    this._destroy.forEach(cb => cb())
  }
}