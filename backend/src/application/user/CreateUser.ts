import { User } from "../../domain/entities/user/User";
import { UserRepositorySqlServer } from "../../infrastructure/repository/UserRepositorySqlServer";

export class CreateUser {
  /**
   *
   */
  constructor(userRepository: UserRepositorySqlServer) {}

  execute = (input: User) => {};
}
