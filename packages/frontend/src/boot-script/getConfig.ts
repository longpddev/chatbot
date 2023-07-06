import { ChatConfig, ChatConfigKeys } from "../interface";
import { capitalize } from "./utils";

const configDefault: ChatConfig = {
  container: 'body',
  position: 'right',
  positionBottom: 20,
  positionLeft: 20,
  positionRight: 20
};
const elementConfig = document.querySelector('[data-euroland-chatbot]') as HTMLElement | undefined;

export function getConfigByElement (element: HTMLElement) {
  const options = Object.keys(configDefault) as ChatConfigKeys
  const result = {} as any;
  options.forEach(item => {
    let data: number | string | undefined = element.dataset['euroland' + capitalize(item)]
    if (!data) return;

    switch (typeof configDefault[item]) {
      case 'number': {
        data = Number(data);
        break;
      }
    }

    result[item] = (data)
  })

  return result as Partial<ChatConfig>
}

export function getConfig () {
  if (!elementConfig) return configDefault;
  return Object.freeze(Object.assign(configDefault, getConfigByElement(elementConfig)));
}

const chatConfig = getConfig();

export default chatConfig
