import { ChatConfig, ChatConfigKeys } from "../interface";
import { firstUppercase } from "./utils";

const configDefault: ChatConfig = {
  container: 'body',
  position: 'left',
  positionBottom: 20,
  positionLeft: 20,
  positionRight: 20
};
const elementConfig = document.querySelector('[data-euroland-chatbot]') as HTMLElement | undefined;

export function getConfigByElement (element: HTMLElement) {
  const options = Object.keys(configDefault) as ChatConfigKeys
  const result = {} as any;
  options.forEach(item => {
    const data = element.dataset['euroland' + firstUppercase(item)]
    if (data) {
      result[item] = (data as ChatConfig[typeof item])
    }
  })

  return result as Partial<ChatConfig>
}

export function getConfig () {
  if (!elementConfig) return configDefault;
  return Object.assign(getConfigByElement(elementConfig), configDefault);
}

const chatConfig = getConfig();

export default chatConfig
