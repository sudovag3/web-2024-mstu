import React, { useState } from 'react';
import { Button, Paper, TextField, Typography } from "@mui/material";
import axios from 'axios';
import { useRouter } from 'next/navigation';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
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
            await axios.post('http://127.0.0.1:8080/register', formData);
            // Редирект на страницу логина после успешной регистрации
            router.push('/login');
        } catch (error: any) {
            console.error('Registration failed:', error.response.data.message);
            // Обработка ошибок в случае неудачной регистрации
        }
    };

    return (
        <Paper style={{ padding: '20px', margin: '20px' }}>
            <Typography variant="h5" align="center">Register</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="First Name"
                    name="firstName"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    value={formData.firstName}
                    onChange={handleChange}
                />
                <TextField
                    label="Last Name"
                    name="lastName"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    value={formData.lastName}
                    onChange={handleChange}
                />
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
                    Register
                </Button>
            </form>
        </Paper>
    );
};

export default RegisterPage;
