import MainContentComponent from "./components/MainContentComponent";
import SpaceManager from "./space-manager";
import AbstractDestroy from "./utils/abstract-destroy";
import createShadowRoot from "./utils/create-shadow-root";
import { EventBus } from "./utils/event-bus";
import { EventEmitter } from "./utils/event-emitter";
import { render } from 'preact'
export class MainContent extends AbstractDestroy {
  private readonly emitter;
  private _open = false;
  private readonly container = document.createElement('div');
  private readonly shadowRoot = createShadowRoot(this.container)
  constructor (
    private readonly eventBus: EventBus,
    private readonly space: SpaceManager,
    private readonly chatContainer: HTMLElement
  ) {
    super()
    this.emitter = this.wrapDestroy(
      this.eventBus.createEmitter()
    );
    this.chatContainer.appendChild(this.container);
    this.render()
    this.taskDestroy(() => this.container.remove())
    this.emitter.subscribe('setOpenChat', state => this.open = state)
  }

  get open () {
    return this._open
  }

  set open (state: boolean) {
    if(this._open === state) return;
    this._open = state;
    this.render()
  }

  render () {
    render(
      <MainContentComponent open={this.open} space={this.space} />
      , this.shadowRoot
    )
  }
}