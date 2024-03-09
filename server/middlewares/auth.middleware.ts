import jwt from "jsonwebtoken";
import db from "../models";


export const authenticateToken = (req: any, res: any, next: any) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    jwt.verify(token, 'your-secret-key', (err: any, user: any) => {
        if (err) return res.status(403).json({ message: 'Forbidden' });
        req.user = user;
        next();
    });
};

export const checkUserExistence = async (req: any, res: any, next: any) => {
    const { username } = req.body;

    try {
        const existingUser = await db.user.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        next();
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};