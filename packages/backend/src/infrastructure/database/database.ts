import { Connection, Request, TYPES } from 'tedious';

// Cấu hình kết nối
const config = {
  server: process.env.DB_HOST, // Thay đổi tùy theo địa chỉ máy chủ SQL Server
  authentication: {
    type: 'default',
    options: {
      userName: process.env.DB_USERNAME, // Thay đổi tùy theo tên người dùng SQL Server
      password: process.env.DB_SECRET // Thay đổi tùy theo mật khẩu người dùng SQL Server
    }
  },
  options: {
    encrypt: true, // Sử dụng kết nối được mã hóa
    database: process.env.DB_NAME // Thay đổi tùy theo tên cơ sở dữ liệu bạn muốn kết nối
  }
};

// Tạo kết nối đến cơ sở dữ liệu
const connection = new Connection(config);

// Xử lý sự kiện kết nối thành công
connection.on('connect', (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to database');
    // Tiếp tục xử lý hoặc truy vấn cơ sở dữ liệu ở đây
  }
});

// Xử lý sự kiện lỗi kết nối
connection.on('error', (err) => {
  console.error('Database error:', err.message);
});

export { connection };
