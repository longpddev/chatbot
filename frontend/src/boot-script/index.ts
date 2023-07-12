import { EventBus } from "./utils/event-bus"
import getChartContainer from "./get-chart-container"
import chatConfig from "./get-config"
import { MainContent } from "./main-content"
import { ChartBtn } from "./chat-btn"
import SpaceManager from "./space-manager"

const chatContainer = getChartContainer(chatConfig)
const eventBus = new EventBus()
const space = new SpaceManager()
if (!chatContainer) {
  throw new Error("chat container not found")
}
new ChartBtn(eventBus, space, chatContainer)
new MainContent(eventBus, space, chatContainer)
