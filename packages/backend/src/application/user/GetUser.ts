import { UserRepositorySqlServer } from "../../infrastructure/repository/UserRepositorySqlServer";

export class GetUser {
  /**
   *
   */
  constructor(userRepository: UserRepositorySqlServer) {}

  execute = (userId: Number) => {};
}
