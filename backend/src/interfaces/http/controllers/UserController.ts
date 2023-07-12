import { Request, Response } from "express";
import { CreateUser } from "../../../application/user/CreateUser";
import { GetUser } from "../../../application/user/GetUser";
import { UserRepositorySqlServer } from "../../../infrastructure/repository/UserRepositorySqlServer";

const userRepository = new UserRepositorySqlServer();

export class UserController {
  public static async createUser(req: Request, res: Response): Promise<void> {
    const { name, email, password } = req.body;
    const createUser = new CreateUser(userRepository);

    try {
      await createUser.execute({ name, email, password });
      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "An error occurred while creating the user" });
    }
  }

  public static async getUser(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;
    const getUser = new GetUser(userRepository);

    try {
      const user = await getUser.execute(Number.parseInt(userId));
      res.status(200).json(user);
    } catch (error) {
      res
        .status(500)
        .json({ error: "An error occurred while retrieving the user" });
    }
  }
}

export default UserController;
