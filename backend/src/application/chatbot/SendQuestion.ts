import { OpenAIAnswerResponse } from "../../domain/models/chatbot/OpenAIAnswerResponse";
import { QuestionInputDto } from "../../domain/models/chatbot/QuestionInputDto";

export class SendQuestion {
  public async execute(
    question: QuestionInputDto
  ): Promise<OpenAIAnswerResponse | null> {
    return null;
  }
}
