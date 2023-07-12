import { Request, Response } from "express";
import { SendQuestion } from "../../../application/chatbot/SendQuestion";
import { OpenAIAnswerResponse } from "../../../domain/models/chatbot/OpenAIAnswerResponse";
import { CreateChat } from "../../../application/chatbot/CreateChat";
export class ChatController {
  /**
   *
   */
  constructor() {}
  public static async sendQuestion(
    request: Request,
    res: Response
  ): Promise<OpenAIAnswerResponse | null> {
    var sendQuestion = new SendQuestion();
    try {
      var result = await sendQuestion.execute(request);
      res.status(201).json({ message: "User created successfully" });
      return result;
    } catch (error) {
      res
        .status(500)
        .json({ error: "An error occurred while creating the user" });
      return null;
    }
  }

  public static async createChat(request: Request, res: Response) {
    const message = request.query.message;
    var createChat = new CreateChat();
    const result = await createChat.execute([
      { role: "user", content: message },
    ]);

    res.json(result);
  }
}
