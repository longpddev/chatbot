import { SqlServerDatabase } from '../database/SqlServerDatabase';
import { User } from '../../domain/user/User';
import { UserRepository } from '../../domain/user/UserRepository';

export class UserRepositorySqlServer implements UserRepository {
  private db: SqlServerDatabase;

  constructor() {
    this.db = new SqlServerDatabase();
  }

  public async save(user: User): Promise<void> {
    // Triển khai logic lưu trữ người dùng vào cơ sở dữ liệu SQL Server ở đây
  }

  public async findById(id: string): Promise<User | null> {
    // Triển khai logic truy vấn người dùng từ cơ sở dữ liệu SQL Server ở đây
    return new User();
  }
}
