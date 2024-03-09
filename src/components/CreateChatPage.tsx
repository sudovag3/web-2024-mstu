import React, { useState } from 'react';
import { Button, MenuItem, Paper, TextField, Typography } from "@mui/material";
import axios from 'axios';
import { useRouter } from 'next/navigation';

const CreateChatPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        type: 'public', // Assuming default type is public
    });

    const router = useRouter();

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            const response = await axios.post('http://127.0.0.1:8080/chats', formData, {
                headers: {
                    Authorization: token,
                },
            });

            // Переход на домашнюю страницу после успешного создания чата
            router.push('/');
        } catch (error: any) {
            console.error('Create chat failed:', error.response.data.message);
            // Обработка ошибок в случае неудачного создания чата
        }
    };

    return (
        <Paper style={{ padding: '20px', margin: '20px' }}>
            <Typography variant="h5" align="center">Create Chat</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Chat Name"
                    name="name"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    value={formData.name}
                    onChange={handleChange}
                />
                <TextField
                    label="Description"
                    name="description"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    value={formData.description}
                    onChange={handleChange}
                />
                <TextField
                    select
                    label="Chat Type"
                    name="type"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    value={formData.type}
                    onChange={handleChange}
                >
                    <MenuItem value="public">Public</MenuItem>
                    <MenuItem value="private">Private</MenuItem>
                </TextField>
                <Button type="submit" variant="contained" color="primary">
                    Create Chat
                </Button>
            </form>
        </Paper>
    );
};

export default CreateChatPage;
