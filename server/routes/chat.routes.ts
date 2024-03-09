import express from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import db from '../models';

const router = express.Router();

// Получение списка чатов
router.get('/chats', async (req, res) => {
    try {
        const chats = await db.chat.find();
        res.json(chats);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Создание чата
router.post('/chats', authenticateToken, async (req, res) => {
    const { name, description, type } = req.body;
    // @ts-ignore
    const userId = req.user.userId; // Извлекаем userId из токена

    try {
        const chat = new db.chat({
            name,
            description,
            type,
            participants: [userId], // Пользователь, создавший чат, автоматически добавляется в список участников
            admins: [userId], // Тот же пользователь также становится администратором
        });

        await chat.save();
        res.status(201).json({ message: 'Chat created successfully', chat });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Получение чата по id
router.get('/chats/:id', authenticateToken, async (req, res) => {
    const chatId = req.params.id;

    try {
        const chat = await db.chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }
        res.json(chat);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Вступление в чат / выход из чата
router.post('/chats/:id/join', authenticateToken, async (req, res) => {
    const chatId = req.params.id;
    // @ts-ignore
    const userId = req.user.userId;

    try {
        const chat = await db.chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        // Если пользователь уже участвует в чате, то выходим из него
        if (chat.participants.includes(userId)) {
            chat.participants = chat.participants.filter((participant) => participant.toString() !== userId);
        } else {
            chat.participants.push(userId);
        }

        await chat.save();
        res.json({ message: 'User joined/left the chat', chat });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Удаление чата
router.delete('/chats/:id', authenticateToken, async (req, res) => {
    const chatId = req.params.id;

    try {
        const chat = await db.chat.findByIdAndDelete(chatId);
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }
        res.json({ message: 'Chat deleted successfully', chat });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default router;
