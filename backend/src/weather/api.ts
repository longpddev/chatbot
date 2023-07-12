import * as fetch from 'node-fetch'


const apiCode = '6010d85221f453519a92784d9bb3561d'
const baseUrl = 'https://api.openweathermap.org'

export const EXCLUDE = {
    current: 'current',
    minutely: 'minutely',
    hourly: 'hourly',
    daily: 'daily',
    alerts: "alerts"
}

export const UNITS = {
    standard: "standard",
    metric : "metric",
    imperial: "imperial"
}

export const buildParams = (params: Record<string, string>) => {
  const url = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
      url.set(key, value)
  }
  let result = url.toString()

  if (result) result = '?' + result
  return result
}


export const weatherApi = {
    async GET(point: string, params = {}) {
        let result = await fetch.default(baseUrl + point + buildParams({
            ...params,
            appid: apiCode
        }))

        return await result.json()
    },

}