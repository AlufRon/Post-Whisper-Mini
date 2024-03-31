import React from 'react';
import { MenuList, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { useNavigate } from "react-router-dom";

export type MenuItemType = {
  icon: JSX.Element;
  text: string;
  path?: string;
};

type MenuGroupProps = {
  items: MenuItemType[];
  handleDrawerToggle: () => void;
};

const MenuGroup: React.FC<MenuGroupProps> = ({ items, handleDrawerToggle }) => {
  const navigate = useNavigate();
  return (
    <MenuList>
      {items.map((item, index) => (
        <MenuItem key={index} onClick={() => {
          handleDrawerToggle();
          navigate(item.path || '/');
        }}>
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.text} />
        </MenuItem>
      ))}
    </MenuList>
  );
};

export default MenuGroup;
