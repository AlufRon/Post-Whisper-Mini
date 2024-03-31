import React, { useEffect, useState } from 'react';
import Header from '../.Components/Header';
import MyDialog from '../.Components/MyDialog';
import CreatePostForm from './Components/CreatePostForm';
import { useCreatePost } from '../../services/postService';


const AddPostPage: React.FC = () => {
  const { createPost, isLoading, error, response } = useCreatePost();
  
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
        title: "Post Created!",
        content: `The new Post Id is <${response.data.data.id}>`,
        okButtonText: "Go Back",
        nav: "/posts",
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
      <Header title={`Add Post`}></Header>
      <CreatePostForm createPost={createPost} loading={isLoading} />
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

export default AddPostPage;