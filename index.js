import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { corsOptions } from "./utils/cors.js";
import mysql from "mysql2";
import authRouter from "./routes/auth.js";
import doctorRouter from "./routes/doctors.js";
import appointmentRouter from "./routes/appointment.js";
import serviceRouter from "./routes/services.js";
import newsRouter from "./routes/news.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors(corsOptions));

export const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "ilkin3719", 
    database: "hospital",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});


app.use("/", authRouter);
app.use("/", doctorRouter);
app.use("/", appointmentRouter);
app.use("/", serviceRouter);
app.use("/", newsRouter);

const PORT = 8000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
