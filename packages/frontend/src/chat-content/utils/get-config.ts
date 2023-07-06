import { ChatConfig } from "../../interface"

const chatConfig = Object.freeze(JSON.parse(decodeURIComponent(location.hash.slice(1))) as ChatConfig);

export default chatConfig