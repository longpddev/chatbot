import { render } from "preact";
import AbstractDestroy from "./utils/abstract-destroy";
import createShadowRoot from "./utils/create-shadow-root";
import { EventBus } from "./utils/event-bus";
import { EventEmitter } from "./utils/event-emitter";

export class ChartBtn extends AbstractDestroy {
  private readonly emitter: EventEmitter

  private readonly container = document.createElement('div');
  private readonly shadowRoot = createShadowRoot(this.container);
  constructor (
    private readonly eventBus: EventBus,
    private readonly chatContainer: HTMLElement
  ) {
    super()
    this.emitter = this.wrapDestroy(
      this.eventBus.createEmitter()
    );
    this.chatContainer.appendChild(this.container);
    this.render();

    this.taskDestroy(() => this.container.remove())
  }

  render () {
    render(<button className="fixed bottom-10 right-10 w-10 h-10 rounded-full bg-sky-400"> </button>, this.shadowRoot)
  }
}