import { Connection, Request } from 'tedious';

export class SqlServerDatabase {
  //private connection: Connection;

  constructor() {
    // Triển khai logic kết nối cơ sở dữ liệu SQL Server ở đây
  }

  public executeQuery(query: string, callback: (error: Error | null, results: any[] | null) => void): void {
    // Triển khai logic thực thi truy vấn SQL ở đây
  }
}
