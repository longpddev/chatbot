import { Connection, Request, TYPES } from "tedious";

const config = {
  server: process.env.DB_HOST,
  authentication: {
    type: "default",
    options: {
      userName: process.env.DB_USERNAME,
      password: process.env.DB_SECRET,
    },
  },
  options: {
    encrypt: true,
    database: process.env.DB_NAME,
  },
};

const connection = new Connection(config);

connection.on("connect", (err) => {
  if (err) {
    console.error("Error connecting to database:", err.message);
  } else {
    console.log("Connected to database");
  }
});

connection.on("error", (err) => {
  console.error("Database error:", err.message);
});

export { connection };
