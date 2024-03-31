import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Bot, BotFormState } from '../../types/Interfaces';
import { useDeleteBot, useGetbotByIdWithActions, useUpdateBot } from '../../services/botService';
import BotForm from './Components/BotForm';
import Header from '../.Components/Header';
import { DeleteForeverIcon } from '../../Styles/icons';
import { IconButton, Tooltip } from '@mui/material/';
import { useNavigate } from 'react-router-dom';
import MyDialog from '../.Components/MyDialog';


const EditBotPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [bot, setBot] = useState<Bot | null>(null);
  const { data: bots, isLoading, error } = useGetbotByIdWithActions(id ? id : "");
  const { updateBot, isLoading: updateLoading, error: errorUpdate, response } = useUpdateBot();
  const { deleteBot, isLoading: isDeleting, error: deleteError, response: deleteResponse } = useDeleteBot();
  const [uploaded, setUploaded] = useState<boolean>(false)
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({
    title: "Default Title",
    content: "Default content.",
    okButtonText: "OK",
    backButtonText: "",
    nav: "",
  });

  useEffect(() => {
    if (bots && bots.length > 0) {
      setBot(bots[0]);
    }
  }, [bots]);

  useEffect(() => {
    if (!updateLoading && response) {
      console.log('Update successful', response);
      setUploaded(true)
    }
  }, [response]);

  useEffect(() => {
    if (!updateLoading && response) {
      console.log('Update successful', response);
    }
  }, [response]);

  useEffect(() => {
    if (deleteResponse) {
      setDialogConfig({
        title: "Bot Deleted!",
        content: `Bot <${id}> was succesfully deleted!`,
        okButtonText: "Go Back",
        backButtonText: "",
        nav: "/bots",
      });
      setDialogOpen(true);
    }
  }, [deleteResponse]);

  useEffect(() => {
    if (deleteError) {
      setDialogConfig({
        title: "Bot Deletion failed!",
        content: `Bot <${id}> was not deleted, <${deleteError}>`,
        okButtonText: "Go Back",
        backButtonText: "",
        nav: "/bots",
      });
      setDialogOpen(true);
    }
  }, [deleteError]);
  
  const handleToDelete = () => {
    setDialogConfig({
      title: "Delete Bot?",
      content: `The bot with Id: <${id}> will be deleted forever, are you sure?`,
      okButtonText: "Delete",
      backButtonText: "Go back",
      nav: "",
    });
    setDialogOpen(true);
  }
  const handleSave = async (id: string, updatedBot: BotFormState) => {
    await updateBot(id, updatedBot as Bot);
  };
  const deleteBotAction = () => {
    if (id) {
      deleteBot(id)
    }
  }
  if (isLoading) return <p>Loading...</p>;
  return (
    <React.Fragment>
      <Header title={`edit bot`}>
        <Tooltip title="Delete Bot" placement="left">
          <IconButton onClick={handleToDelete} aria-label="edit">
            <DeleteForeverIcon />
          </IconButton>
        </Tooltip>
      </Header>
      {bot ? <BotForm bot={bot} handleSave={handleSave} loading={updateLoading} uploaded={uploaded} setUploaded={setUploaded} /> : <p>No bot found <br />{error}</p>}
      <MyDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        {...dialogConfig}
        extraAction={deleteBotAction}
      />
    </React.Fragment>
  );
};

export default EditBotPage;
