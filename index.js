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

export const db = mysql.createConnection({
    host: "taghiyr7.beget.tech",
    user: "taghiyr7_hospita",
    password: "Ilkin3719",
    database: "taghiyr7_hospita",
    insecureAuth: true,
});

db.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL:", err);
    } else {
        console.log("Connected to MySQL");
    }
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
