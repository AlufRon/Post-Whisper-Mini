import { Theme, styled } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';

export const StyledDrawer = styled(Drawer)(({ theme }) => ({
  flexShrink: 0,
  width: 220,
  '& .MuiDrawer-paper': {
    display: 'flex',
    flexDirection: 'column',
    width: 220,
    boxSizing: 'border-box',
    backgroundColor: '#f0f0f0',
    border: 'none', 
    borderRadius: '0 12px 12px 0',
  },
  [theme.breakpoints.down('sm')]: {
    width: '60%',
    '& .MuiDrawer-paper': {
      width: '60%',
    },
  },
}));

export const ToggleButtonStyle = (theme: Theme) => ({
    mr: 2,
    display: { sm: 'block' },
    position: 'absolute',
    top: 0,
    left: 16,
    zIndex: theme.zIndex.drawer + 1
  });