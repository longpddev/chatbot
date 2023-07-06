import { render } from "preact";
import AbstractDestroy from "./utils/abstract-destroy";
import createShadowRoot from "./utils/create-shadow-root";
import { EventBus } from "./utils/event-bus";
import ChartBtnComponent from './components/ChatBtnComponent'
import SpaceManager from "./space-manager";

export class ChartBtn extends AbstractDestroy {
  private readonly emitter;
  private _open = false;
  private readonly container = document.createElement("div");
  private readonly shadowRoot = createShadowRoot(this.container);
  constructor (
    private readonly eventBus: EventBus,
    private readonly space: SpaceManager,
    private readonly chatContainer: HTMLElement
  ) {
    super();
    this.emitter = this.wrapDestroy(this.eventBus.createEmitter());
    this.chatContainer.appendChild(this.container);
    this.render();
    this.taskDestroy(() => this.container.remove());
    this.emitter.subscribe('setOpenChat', (state) => this.open = state)
  }

  get open () {
    return this._open
  }

  set open (value: boolean) {
    if (this._open === value) return;
    this._open = value;
    this.render();
    this.emitter.publish('setOpenChat', value)
  }

  render () {
    render(
      <ChartBtnComponent open={this.open} openSet={state => this.open = state} space={this.space} />,
      this.shadowRoot
    );
  }
}
