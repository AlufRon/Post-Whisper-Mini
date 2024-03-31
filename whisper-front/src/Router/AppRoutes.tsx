import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainPage from '../Pages/MainPage/MainPage';
import BotPage from '../Pages/BotPage/BotPage';
import EditBotPage from '../Pages/BotEdit/BotEditPage';
import AddBotPage from '../Pages/AddBot/AddBotPage';
import PostPage from '../Pages/PostPage/Postpage';
import AddPostPage from '../Pages/AddPost/AddPostPage';
import ActionPage from '../Pages/ActionPage/Actionpage';
import AddActionPage from '../Pages/AddAction/AddActionPage';


const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<MainPage/>} />
      <Route path="/bots" element={<BotPage/>} />
      <Route path="/edit-bot/:id" element={<EditBotPage />} />
      <Route path="/addBot" element={<AddBotPage/>} />
      <Route path="/posts" element={<PostPage/>} />
      <Route path="/addPost" element={<AddPostPage/>} />
      <Route path="/actions" element={<ActionPage/>} />
      <Route path="/addAction" element={<AddActionPage/>} />

    </Routes>
  );
};

export default AppRouter;
