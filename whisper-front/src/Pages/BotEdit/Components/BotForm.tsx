import React, { useState, useEffect } from 'react';
import { TextField, Paper, MenuItem, Box, Divider } from '@mui/material';
import { Bot, BotFormState, Status } from '../../../types/Interfaces';
import LoadingButton from '@mui/lab/LoadingButton';
import { CheckCircleIcon, SaveIcon } from '../../../Styles/icons';
import Tooltip from '@mui/material/Tooltip';

type BotFormProps = {
    bot: Bot | null;
    handleSave: (id: string, updatedBot: BotFormState) => Promise<void>;
    loading: boolean;
    uploaded?: boolean;
    setUploaded?: (value: boolean) => void;
};

const BotForm: React.FC<BotFormProps> = ({ bot, handleSave, loading, uploaded, setUploaded }) => {
    const [formBot, setFormBot] = useState<Bot | null>(bot);

    useEffect(() => {
        setFormBot(bot);
    }, [bot]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof Bot) => {
        if (formBot) {
            const value = event.target.value;
            if (field === 'personalityTraits') {
                setFormBot({ ...formBot, personalityTraits: value.split(',').map(trait => trait.trim()) });
            } else {
                setFormBot({ ...formBot, [field]: value });
            }
            if(setUploaded) setUploaded(false);
        }
    };

    const handleSubmit = () => {
        if (formBot) {
            const { id, createdAt, updatedAt, email, name, Actions, ...updatableFields } = formBot;
            if (bot) handleSave(bot.id, updatableFields as BotFormState);
        }
    };

    if (!formBot) return <p>No bot found</p>;

    return (
        <Paper style={{ padding: '20px', maxWidth: '500px', margin: '20px auto' }}>
            <h2>Edit Bot</h2>
            <Divider style={{ marginBottom: '20px' }} />
            <Box display="flex" gap={2}>
                <TextField
                    fullWidth
                    label="Name"
                    value={formBot.name || ''}
                    InputProps={{
                        readOnly: true,
                    }}
                    disabled
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Email"
                    value={formBot.email || ''}
                    InputProps={{
                        readOnly: true,
                    }}
                    disabled
                    margin="normal"
                />
            </Box>
            <TextField
                select
                fullWidth
                label="Status"
                value={formBot.status}
                onChange={(event) => handleChange(event, 'status')}
                margin="normal"
            >
                {Object.keys(Status).map((statusKey) => (
                    <MenuItem
                        key={statusKey}
                        value={Status[statusKey as keyof typeof Status]}
                        disabled={statusKey === 'INACTIVE'}
                    >
                        {statusKey}
                    </MenuItem>
                ))}
            </TextField>
            <Box display="flex" gap={2}>

                <TextField
                    fullWidth
                    label="Access Token"
                    value={formBot.accessToken || ''}
                    onChange={(event) => handleChange(event, 'accessToken')}
                    margin="normal"
                    size="small"
                />
                <TextField
                    fullWidth
                    label="Access Token Secret"
                    value={formBot.accessTokenSecret || ''}
                    onChange={(event) => handleChange(event, 'accessTokenSecret')}
                    margin="normal"
                />
            </Box>
            <TextField
                fullWidth
                label="Personality Traits"
                value={formBot.personalityTraits.join(', ') || ''}
                onChange={(event) => handleChange(event, 'personalityTraits')}
                margin="normal"
            />
            <Box display="flex" justifyContent="center" gap={2}>
                <LoadingButton
                    type="submit"
                    fullWidth
                    variant="contained"
                    onClick={handleSubmit}
                    loading={loading}
                    loadingPosition="start"
                    startIcon={!uploaded  ? <SaveIcon /> :
                     <Tooltip title="Update Successful">
                        <CheckCircleIcon color="success" />
                    </Tooltip>}
                    sx={{ mt: 3, mb: 2 }}
                >
                    Save
                </LoadingButton>
            </Box>
        </Paper>
    );
};

export default BotForm;
