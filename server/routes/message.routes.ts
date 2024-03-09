import express from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import db from '../models';

const router = express.Router();

// Отправка сообщения в чат
router.post('/messages/:chatId', authenticateToken, async (req, res) => {
    const { text } = req.body;
    // @ts-ignore
    const userId = req.user.userId;
    const chatId = req.params.chatId;

    try {
        const chat = await db.chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        // Проверяем, что пользователь является участником чата
        if (!chat.participants.includes(userId)) {
            return res.status(403).json({ message: 'Unauthorized to send messages in this chat' });
        }

        const message = new db.message({
            text,
            chatId,
            authorId: userId,
        });

        await message.save();
        res.status(201).json({ message: 'Message sent successfully', data: message });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Получение списка сообщений в чате по id
router.get('/messages/:chatId', authenticateToken, async (req, res) => {
    const chatId = req.params.chatId;

    try {
        const chat = await db.chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        const messages = await db.message
            .find({ chatId })
            .populate('authorId', 'username'); // Добавили populate для автора сообщения

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default router;
