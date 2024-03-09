import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from './models';
import {checkUserExistence, authenticateToken} from './middlewares/auth.middleware'
import {HOST, PORT, DB} from './config/index'
import chatRoutes from "./routes/chat.routes";
import messageRoutes from "./routes/message.routes";
import {startWebsocketServer} from "./ws-server";
const app = express();
const expressPORT = 8080;

// Подключение к базе данных
mongoose.connect(`mongodb://${HOST}:${PORT}/${DB}`);

app.use(cors());
app.use(bodyParser.json());
app.use((req,res,next) =>{
    const req_time = new Date(Date.now()).toString();
    console.log(req.method,req.hostname, req.path, req_time);
    next();
});

// Middleware для проверки существования пользователя

// Регистрация пользователя
app.post('/register', checkUserExistence, async (req, res) => {
    const { firstName, lastName, username, password } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new db.user({
            firstName,
            lastName,
            username,
            passwordHash: hashedPassword,
            salt: salt
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Аутентификация пользователя и выдача JWT
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await db.user.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const hashedPassword = await bcrypt.hash(password, user.salt);

        if (!(hashedPassword === user.passwordHash)) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Добавление супер админа, если в базе данных нет пользователей
async function addSuperAdmin() {
    const userCount = await db.user.countDocuments();
    if (userCount === 0) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('superadminpassword', salt);

        const superAdmin = new db.user({
            firstName: 'Super',
            lastName: 'Admin',
            username: 'superadmin',
            passwordHash: hashedPassword,
            salt: salt
        });

        await superAdmin.save();
        console.log('Super admin added successfully');
    }
}

// Инициализация супер админа
addSuperAdmin();

app.use(chatRoutes);
app.use(messageRoutes);

const server = app.listen(expressPORT, () => {

    console.log(`Server is running on port ${expressPORT}`);
});

startWebsocketServer(server)
