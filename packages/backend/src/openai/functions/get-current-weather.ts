import { weatherApi } from "../../weather/api";

const getCurrentWeather = {
  type: {
    name: "getCurrentWeather",
    description: "Get the current weather in a given location",
    parameters: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description: "The city and state, e.g. San Francisco, CA",
        },
      },
      required: ["location"],
    },
  },
  func: async ({location}: { location: string}) => {
    let result = await weatherApi.GET('/data/2.5/weather', {
      q: location
    })
    return `json data:  ${JSON.stringify(result)} `
  }
}

export default getCurrentWeather