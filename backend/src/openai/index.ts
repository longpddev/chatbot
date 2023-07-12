import { OpenAIApi, Configuration, ChatCompletionRequestMessage } from "openai";
import functions from "./functions";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
console.log(process.env.OPENAI_API_KEY)
const openai = new OpenAIApi(configuration);

export const createChat = async (messages: ChatCompletionRequestMessage[]): Promise<ChatCompletionRequestMessage[]> => {
  const result = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: messages,
    functions: Object.entries(functions).map(([funcName, value]) => ({...value.type, name: funcName})),
    function_call: 'auto',
    temperature: 1,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  const answer = result.data.choices[0]
  const message = answer.message;
  if(message) messages.push(message)
  if(answer.finish_reason === "function_call" && message) {
    const functionName = message?.function_call?.name
    const functionArgs = message?.function_call?.arguments
    if(functionName && (functionName in functions) && functionArgs) {
      const functionResponse = await functions[functionName as keyof typeof functions].func(JSON.parse(functionArgs))
      
      messages.push({
        role: 'function',
        content: functionResponse,
        name: functionName
      })

      return await createChat(messages)
    }
  }

  console.log(messages)

  return messages;
}