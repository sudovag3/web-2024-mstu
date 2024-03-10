import { Server } from 'socket.io';
import db from './models/index';

const Chat = db.chat;

export const startWebsocketServer = (server: any) => {
    const io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    });

    io.on('connection', (socket) => {
        console.log("WebSocketConnection!")
        socket.on('new_chat_message', async (payload) => {
            console.log("Handle Message!")
            const { id, newMessage, author } = payload;
            console.log(id, newMessage, author)
            try {
                const chat = await Chat.findById(id);
                if (!chat) {
                    console.log("Chat not found")
                    return socket.emit('error', { message: 'Chat not found' });
                }

                const authorDB = await db.user.findOne({
                    username: author.username
                })

                if (authorDB){
                    console.log("Creating new message")
                    // Создание нового сообщения
                    const message = new db.message({
                        text: newMessage.text,
                        chatId: id,
                        authorId: authorDB.id,
                    });

                    // Сохранение нового сообщения в базе данных
                    await message.save();

                    // Отправка нового сообщения всем участникам чата по веб-сокету
                    console.log(`Sending message ${message.text}`)
                    io.emit('new_message', {
                        chatId: id,
                        _id: message._id,
                        text: message.text,
                        authorId: {
                            _id: authorDB.id,
                            username: authorDB.username
                        }
                    });
                    console.log(`Sent message`)
                }
                else {
                    console.log("Author not found")
                }

            } catch (error) {
                socket.emit('error', { message: 'Internal Server Error' });
            }
        });
    });
};
