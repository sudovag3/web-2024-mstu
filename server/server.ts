import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from './models';

const app = express();
const PORT = 3000;

// Подключение к базе данных
mongoose.connect('mongodb://localhost:27017/mstu-test');

app.use(cors());
app.use(bodyParser.json());

// Middleware для проверки JWT
const authenticateToken = (req: any, res: any, next: any) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    jwt.verify(token, 'your-secret-key', (err: any, user: any) => {
        if (err) return res.status(403).json({ message: 'Forbidden' });
        req.user = user;
        next();
    });
};

// Middleware для проверки существования пользователя
const checkUserExistence = async (req: any, res: any, next: any) => {
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

// Пример защищенного маршрута, требующего JWT
app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'Access granted to protected route', user: req.body });
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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
