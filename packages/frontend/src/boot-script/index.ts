import { EventBus } from "./utils/event-bus"
import { ChartBtn } from "./chat-btn"
import getChartContainer from "./getChartContainer"
import chatConfig from "./getConfig"
import { MainContent } from "./main-content"

const chatContainer = getChartContainer(chatConfig)
const eventBus = new EventBus()
if (!chatContainer) throw new Error("chat container not found")
const btn = new ChartBtn(eventBus, chatContainer)
const mainContent = new MainContent(eventBus, chatContainer)
console.log(btn, mainContent)
