import { User } from "../../domain/entities/user/User";
import { connection } from "../database/database";
import { Request, TYPES } from "tedious";

export class UserRepositorySqlServer {
  // ...

  public async findById(id: string): Promise<User | null> {
    return new Promise((resolve, reject) => {
      const request = new Request(
        "SELECT * FROM Users WHERE Id = @id",
        (err, rowCount, rows) => {
          if (err) {
            reject(err);
          } else if (rowCount === 0) {
            resolve(null);
          } else {
            const user = rows[0];
            resolve({
              id: user.Id.value,
              name: user.Name.value,
              email: user.Email.value,
            });
          }
        }
      );

      request.addParameter("id", TYPES.VarChar, id);
      connection.execSql(request);
    });
  }

  // ...
}
