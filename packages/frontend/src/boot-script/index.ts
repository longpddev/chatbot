import { EventBus } from "./utils/event-bus"
import getChartContainer from "./getChartContainer"
import chatConfig from "./getConfig"
import { MainContent } from "./main-content"
import { ChartBtn } from "./chat-btn"
import SpaceManager from "./space-manager"

const chatContainer = getChartContainer(chatConfig)
const eventBus = new EventBus()
const space = new SpaceManager(eventBus)
if (!chatContainer) throw new Error("chat container not found")
const btn = new ChartBtn(eventBus, space, chatContainer)
const mainContent = new MainContent(eventBus, space, chatContainer)
