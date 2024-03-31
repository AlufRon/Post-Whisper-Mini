import React, { useEffect, useState } from 'react'; import { useCreateBot } from '../../services/botService';
import Header from '../.Components/Header';
import CreateBotForm from './Components/CreateBotForm';
import MyDialog from '../.Components/MyDialog';


const AddBotPage: React.FC = () => {
  const { createBot, isLoading, error, response } = useCreateBot();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({
    title: "Default Title",
    content: "Default content.",
    okButtonText: "OK",
    nav: "",
  });
  useEffect(() => {
    if (!isLoading && response) {
      console.log('Update successful', response);
      setDialogConfig({
        title: "Bot Created!",
        content: `The new bot Id is <${response.data.data.id}>`,
        okButtonText: "Go Back",
        nav: "/bots",
      });
      setDialogOpen(true);
    }
  }, [response]);

  useEffect(() => {
    if (error) {
      setDialogConfig({
        title: "An error has occured",
        content: `<${error}>`,
        okButtonText: "Try again",
        nav: "",
      });
      setDialogOpen(true);
    }
  }, [error]);
  if (isLoading) return <p>Loading...</p>;

  return (
    <React.Fragment>
      <Header title={`Add bot`}></Header>
      <CreateBotForm createBot={createBot} loading={isLoading} />
      <MyDialog
        title={dialogConfig.title}
        content={dialogConfig.content}
        open={dialogOpen}
        setOpen={setDialogOpen}
        okButtonText={dialogConfig.okButtonText}
        nav={dialogConfig.nav}
      />
    </React.Fragment>
  );
};

export default AddBotPage;