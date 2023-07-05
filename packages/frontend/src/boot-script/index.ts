import { EventBus } from "./utils/event-bus"
import getChartContainer from "./getChartContainer"
import chatConfig from "./getConfig"
import { MainContent } from "./main-content"

const chatContainer = getChartContainer(chatConfig)
const eventBus = new EventBus()
if (!chatContainer) throw new Error("chat container not found")
const mainContent = new MainContent(eventBus, chatContainer)
