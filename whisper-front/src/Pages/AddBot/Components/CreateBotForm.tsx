import React, { useState } from 'react';
import { TextField, Paper, Box, Divider } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import { CreateBotState } from '../../../types/Interfaces';
type CreateBotFormProps = {
    createBot: (data: CreateBotState) => void;
    loading: boolean;
};

const CreateBotForm: React.FC<CreateBotFormProps> = ({ createBot, loading }) => {
    const [newBot, setNewBot] = useState<CreateBotState>({
        email: '',
        name: '',
        accessToken: null,
        accessTokenSecret: null,
        personalityTraits: [],
    });
    const [emailError, setEmailError] = useState(false);
    const [nameError, setNameError] = useState(false);

    const validateEmail = (email: string) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof CreateBotState) => {
        let value: string | string[] | null = event.target.value;
        if (field === 'personalityTraits') {
            value = value.split(',').map(trait => trait.trim());
        } else if (field === 'email') {
            setEmailError(!validateEmail(value));
        } else if (field === 'name') {
            setNameError(value.trim().length === 0);
        }
        setNewBot({ ...newBot, [field]: value });
    };

    const handleSubmit = async () => {
        const emailValid = validateEmail(newBot.email);
        const nameValid = newBot.name.trim().length > 0;
        setEmailError(!emailValid);
        setNameError(!nameValid);

        if (emailValid && nameValid) {
            await createBot(newBot)
        }
    };


    return (
        <Paper style={{ padding: '20px', maxWidth: '500px', margin: '20px auto' }} >
            <h2>Create New Bot</h2>
            <Divider style={{ marginBottom: '20px' }} />
            <Box display="flex" gap={2}>
                <TextField
                    fullWidth
                    error={nameError}
                    helperText={nameError ? "Name cannot be empty" : ""}
                    label="Name"
                    value={newBot.name}
                    onChange={(event) => handleChange(event, 'name')}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    error={emailError}
                    helperText={emailError ? "Invalid email address" : ""}
                    label="Email"
                    value={newBot.email}
                    onChange={(event) => handleChange(event, 'email')}
                    margin="normal"
                />
            </Box>
            <TextField
                fullWidth
                label="Access Token (optional)"
                value={newBot.accessToken || ''}
                onChange={(event) => handleChange(event, 'accessToken')}
                margin="normal"
            />
            <TextField
                fullWidth
                label="Access Token Secret (optional)"
                value={newBot.accessTokenSecret || ''}
                onChange={(event) => handleChange(event, 'accessTokenSecret')}
                margin="normal"
            />
            <TextField
                fullWidth
                label="Personality Traits (comma-separated)"
                value={newBot.personalityTraits.join(', ')}
                onChange={(event) => handleChange(event, 'personalityTraits')}
                margin="normal"
            />
            <Box display="flex" justifyContent="center" gap={2}>
                <LoadingButton
                    type="submit"
                    fullWidth
                    onClick={handleSubmit}
                    variant="contained"
                    loading={loading}
                    loadingPosition="start"
                    startIcon={<SaveIcon />}
                    sx={{ mt: 3, mb: 2 }}
                >
                    Create
                </LoadingButton>
            </Box>
        </Paper>
    );
};

export default CreateBotForm;
