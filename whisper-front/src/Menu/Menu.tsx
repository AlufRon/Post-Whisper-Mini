import React, { useEffect, useState } from 'react';
import CustomDrawer from './Components/CustomDrawer';
import { QueryStatsOutlinedIcon, SmartToyIcon, PostAddIcon, QueueSharpIcon, AllInboxIcon, PersonAddAlt1Icon, ChecklistIcon } from '../Styles/icons';
import MenuGroup, { MenuItemType } from './Components/MenuGroup';

const mainMenu: MenuItemType[] = [
  { icon: <QueryStatsOutlinedIcon />, text: 'Statistics', path: "/" },
  { icon: <SmartToyIcon />, text: 'Bots', path: "/bots" },
  { icon: <AllInboxIcon />, text: 'Posts', path: "/posts" },
  { icon: <ChecklistIcon />, text: 'Actions', path: "/actions" },
];

const subMenu: MenuItemType[] = [
  { icon: <PersonAddAlt1Icon />, text: 'Add Bot', path: "/addBot" },
  { icon: <PostAddIcon />, text: 'Add Post', path: "/addPost" },
  { icon: <QueueSharpIcon />, text: 'Add Actions', path: "/addAction" },
];

const MenuComponent = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <CustomDrawer mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle}>
        <img src="/images/logo.png" alt="Logo" style={{ maxWidth: '60%', margin: 20, alignSelf: 'center'}} />
        <MenuGroup items={mainMenu} handleDrawerToggle={handleDrawerToggle} />
        <br />
        <MenuGroup items={subMenu} handleDrawerToggle={handleDrawerToggle} />
    </CustomDrawer>
  );
};

export default MenuComponent;
