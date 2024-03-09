import React, { useState } from 'react';
import { Button, Paper, TextField, Typography } from "@mui/material";
import axios from 'axios';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const router = useRouter();

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://127.0.0.1:8080/login', formData);
            const token = response.data.token;

            // Сохраняем токен в localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('username', formData.username);

            // Переход на домашнюю страницу
            router.push('/');
        } catch (error: any) {
            console.error('Login failed:', error.response.data.message);
            // Обработка ошибок в случае неудачной авторизации
        }
    };

    return (
        <Paper style={{ padding: '20px', margin: '20px' }}>
            <Typography variant="h5" align="center">Login</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Username"
                    name="username"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    value={formData.username}
                    onChange={handleChange}
                />
                <TextField
                    label="Password"
                    name="password"
                    type="password"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    value={formData.password}
                    onChange={handleChange}
                />
                <Button type="submit" variant="contained" color="primary">
                    Login
                </Button>
            </form>
        </Paper>
    );
};

export default LoginPage;
