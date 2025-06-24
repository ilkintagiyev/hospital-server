import { db } from './../index.js';
import jwt from "jsonwebtoken";

export const verifyToken = async (req, res) => {
    try {
        const token = req?.headers?.authorization?.split(" ")[1];
        const profile = jwt.decode(token);

        if (!profile) {
            return res.status(401).json("Unauthorized");
        }

        const q = "SELECT * FROM users WHERE id = ?";
        const [data] = await db.promise().query(q, profile?.id);
        return data[0];
    } catch (error) {
        console.log(error);
    }
};