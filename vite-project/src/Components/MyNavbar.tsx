import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MicIcon from '@mui/icons-material/Mic';
import HomeIcon from '@mui/icons-material/Home';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PageviewIcon from '@mui/icons-material/Pageview';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonIcon from '@mui/icons-material/Person';

interface Page {
  text: string;
  path: string;
  icon: React.ReactNode;
}

const Navbar: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState<boolean>(false);

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  const toggleProfileDialog = () => {
    setProfileDialogOpen((prev) => !prev);
  };

  const handleLinkClick = () => {
    setDrawerOpen(false); // Closes the drawer when a link is clicked
  };

  const pages: Page[] = [
    { text: 'Home', path: '/HomePage', icon: <HomeIcon /> },
    { text: 'Favorites', path: '/FavoritesPage', icon: <FavoriteIcon /> },
    { text: 'PodShows', path: '/shows/:id', icon: <PageviewIcon /> },
    { text: 'Login', path: '/Login', icon: <LoginIcon /> },
    { text: 'Sign Up', path: '/Signup', icon: <PersonAddIcon /> },
    { text: 'Profile', path: '/UserProfilePage', icon: <PersonIcon /> },
  ];

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
            <MicIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            PODFLEX
          </Typography>
          {/* Profile Icon for SignUp/Login */}
          <IconButton edge="end" color="inherit" onClick={toggleProfileDialog} aria-label="profile">
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <List sx={{ width: 250 }}>
          {pages.map(({ text, path, icon }) => (
            <ListItem key={text} component={Link} to={path} onClick={handleLinkClick}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Profile Dialog (for navigation to Login/SignUp pages) */}
      <Dialog open={profileDialogOpen} onClose={toggleProfileDialog}>
        <DialogTitle>Profile</DialogTitle>
        <DialogContent>
          {/* Information about account actions */}
          <Typography>Would you like to Sign Up or Log In?</Typography>
        </DialogContent>
        <DialogActions>
          <Button color="primary" component={Link} to="/Signup" onClick={toggleProfileDialog}>
            Sign Up
          </Button>
          <Button color="primary" component={Link} to="/Login" onClick={toggleProfileDialog}>
            Login
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Navbar;
