"use client";

import React, { useEffect, useState } from 'react';
import { Button, Link, Paper, Typography } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const enum UserStatus {
    LoggedIn = "Logged In",
    Unauthorized = "Unauthorized",
}
const HomePage = () => {
    const [chats, setChats] = useState<{_id: number, name: string}[]>([]);
    const [userStatus, setUserStatus] = useState(UserStatus.Unauthorized);

    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            // Устанавливаем статус пользователя, если токен есть
            setUserStatus(UserStatus.LoggedIn);
        }

        axios.get('http://127.0.0.1:8080/chats')
            .then(response => setChats(response.data))
            .catch(error => console.error('Error fetching chats:', error));
    }, []);

    const handleJoinChat = (chatId: number) => {
        // Переход в чат по его id
        router.push(`/chat/${chatId}`);
    };

    const handleCreateChat = () => {
        // Переход на страницу создания чата
        router.push('/create-chat');
    };

    const handleLogin = () => {
        // Переход на страницу создания чата
        router.push('/login');
    };

    const handleRegister = () => {
        // Переход на страницу создания чата
        router.push('/register');
    };

    return (
        <div>
            <Typography variant="h4" align="center">Home Page</Typography>
            <Typography variant="h6" align="center">{userStatus}</Typography>

            <Paper style={{ padding: '20px', margin: '20px' }}>
                <Typography variant="h5" align="center">Chats</Typography>
                {chats.map(chat => (
                    <div key={chat._id}>
                        <Typography variant="h6">{chat.name}</Typography>
                        {userStatus === UserStatus.LoggedIn &&(
                            <Button onClick={() => handleJoinChat(chat._id)} variant="contained" color="primary">Join</Button>
                        )}
                    </div>
                ))}
                {userStatus === UserStatus.LoggedIn && (
                    <>
                        <Button onClick={handleCreateChat} variant="contained" color="primary">Create Chat</Button>
                    </>
                )}
            </Paper>

            {userStatus === UserStatus.Unauthorized && (
                <>
                    <Button onClick={handleRegister} variant="contained" color="primary">Register</Button>
                    <Button onClick={handleLogin} variant="contained" color="primary">Login</Button>
                </>
            )}
        </div>
    );
};

export default HomePage;
