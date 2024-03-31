import React, { useEffect, useState } from 'react';
import Header from '../.Components/Header';
import CreateActionForm from './Components/CreateActionForm';
import MyDialog from '../.Components/MyDialog';
import { useCreateActions } from '../../services/actionService';


const AddActionPage: React.FC = () => {
  const { createActionForBots, isLoading, error, response } = useCreateActions();
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
        title: "Actions Created!",
        content:`<${response.data.message}>`,
        okButtonText: "Go Back",
        nav: "/actions",
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
      <Header title={`Add Actions`}></Header>
      <CreateActionForm createAction={createActionForBots} loading={isLoading} />
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

export default AddActionPage;