import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Button, Paper, TextField, Typography } from "@mui/material";
import { io, Socket } from 'socket.io-client';

const ChatPage = ({ chatId }: { chatId: string }) => {
    const [chat, setChat] = useState<{ name: string; _id: string }>({ name: '', _id: '123' });
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<{
        _id: string;
        text: string,
        chatId: string,
        authorId: {
            "_id": string,
            "username": string
        }
    }[]>([]);
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (chatId) {
            axios.get(`http://localhost:8080/chats/${chatId}`, {
                headers: {
                    Authorization: token,
                },
            })
                .then(response => {
                    setChat(response.data)
                })
                .catch(error => console.error('Error fetching chat:', error));

            axios.get(`http://localhost:8080/messages/${chatId}`, {
                headers: {
                    Authorization: token,
                },
            })
                .then(response => {
                    setMessages(response.data)
                })
                .catch(error => console.error('Error fetching messages:', error));
        }

        // Установка соединения с веб-сокетом при монтировании компонента
        socketRef.current = io('http://localhost:8080');

        // Обработка новых сообщений от сервера
        socketRef.current.on('new_message', (newMessage: { _id: string; text: string, chatId: string, authorId: {_id: string, username: string} }) => {
            if (newMessage.chatId === chatId){
                console.log(`Handle new message - ${newMessage}`)
                setMessages(prevMessages => [...prevMessages, newMessage]);
                console.log(messages)
            }
        });

        return () => {
            // Закрытие соединения с веб-сокетом при размонтировании компонента
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [chatId]);

    const handleSendMessage = () => {
        if (message.trim() !== '') {
            if (socketRef.current) {
                console.log("Sending Message")
                const emiting = socketRef.current.emit('new_chat_message', {
                    newMessage: {text: message},
                    id: chatId,
                    author: {
                        username: localStorage.getItem('username')}
                });
                console.log(emiting.active)
            }

            setMessage('')
        }
    };

    return (
        <Paper style={{ padding: '20px', margin: '20px' }}>
            {chat ? (
                <>
                    <Typography variant="h5" align="center">{chat.name}</Typography>
                    <div style={{ padding: '10px', height: '300px', overflowY: 'auto' }}>
                        {messages.map(msg => (
                            <div key={msg._id}>From {msg.authorId.username} - {msg.text}</div>
                        ))}
                    </div>
                    <TextField
                        label="Type your message"
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <Button variant="contained" color="primary" onClick={handleSendMessage}>
                        Send
                    </Button>
                </>
            ) : (
                <Typography variant="h5" align="center">Loading...</Typography>
            )}
        </Paper>
    );
};

export default ChatPage;
