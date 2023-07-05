import AbstractDestroy from "./utils/abstract-destroy";
import createShadowRoot from "./utils/create-shadow-root";
import { EventBus } from "./utils/event-bus";
import { EventEmitter } from "./utils/event-emitter";
import { render } from 'preact'
export class MainContent extends AbstractDestroy {
  private readonly emitter: EventEmitter;

  private readonly container = document.createElement('div');
  private readonly shadowRoot = createShadowRoot(this.container)
  constructor (
    private readonly eventBus: EventBus,
    private readonly chatContainer: HTMLElement
  ) {
    super()
    this.emitter = this.wrapDestroy(
      this.eventBus.createEmitter()
    );
    this.chatContainer.appendChild(this.container);
    this.render()
    this.taskDestroy(() => this.container.remove())
    console.log(this.emitter)
  }

  render () {
    render(<iframe src={'http://localhost:5173/'} className={'border border-red-400'}></iframe>, this.shadowRoot)
  }
}