import React from 'react';
import { IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { StyledDrawer, ToggleButtonStyle } from '../MenuStyles';
import { MenuIcon } from '../../Styles/icons';

interface CustomDrawerProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
  children: React.ReactNode;
}

const CustomDrawer: React.FC<CustomDrawerProps> = ({ mobileOpen, handleDrawerToggle, children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      {isMobile && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={ToggleButtonStyle(theme)}
        >
          <MenuIcon />
        </IconButton>
      )}
      <StyledDrawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <>
          {children}
        </>
      </StyledDrawer>
    </>
  );
};

export default CustomDrawer;
