import React from 'react';
import { NavLink } from 'react-router-dom';
import routes from 'routes';
import logoUit from 'assets/img/logo-uit.png';
import Typewriter from 'typewriter-effect';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Box from '@material-ui/core/Box';
import Tooltip from '@material-ui/core/Tooltip';
import FeedbackIcon from '@material-ui/icons/FeedbackOutlined';
import GitHubButton from 'react-github-btn';
import { IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/KeyboardArrowLeft';
import clsx from 'clsx';
import { useDrawerContext } from '../../../contexts';

function Index() {
  const classes = useStyles();
  const [open, setOpen] = useDrawerContext();

  return (
    <nav className={classes.drawer}>
      <Drawer
        classes={{ paper: classes.drawerPaper }}
        className={clsx(classes.drawer, {
          [classes.drawerClose]: !open,
        })}
        variant="permanent"
        open={open}
      >
        <Box mx={5} style={{ margin: '0 auto 0' }}>
          <IconButton color="inherit" onClick={() => setOpen((prev) => !prev)}>
            <MenuIcon />
          </IconButton>
        </Box>
        {/* Logo */}
        <Box mx={5} my={5}>
          <Tooltip title="Tool đăng ký học phần UIT">
            <a href="https://github.com/loia5tqd001/Dang-Ky-Hoc-Phan-UIT" target="_blank" rel="noopener noreferrer">
              <img src={logoUit} alt="logo uit" style={{ width: '100%', marginTop: 20 }} />
            </a>
          </Tooltip>
        </Box>
        {/* List item */}
        <List>
          {Object.values(routes).map((route) => (
            <ListItem
              key={route.path}
              className={classes.listItem}
              button
              component={NavLink}
              to={route.path}
              activeClassName={classes.menuItemActive}
            >
              <ListItemText primary={route.name} />
            </ListItem>
          ))}
        </List>

        {/* Icons with link */}
        <Tooltip title="Gửi feedback" placement="top">
          <Box m={1} style={{ margin: 'auto auto 0' }}>
            <a href="https://www.facebook.com/messages/t/loia5tqd001" target="_blank" rel="noopener noreferrer">
              <FeedbackIcon color="primary" fontSize="large" />
            </a>
          </Box>
        </Tooltip>
        {/* Typewriter */}
        <Box className={classes.typewriterWrapper}>
          <Typewriter
            options={{
              strings: ['Give feedback', 'Like & Share', 'Star'],
              autoStart: true,
              loop: true,
            }}
          />
        </Box>
        {/* Github stars */}
        <Tooltip title="Hãy vào star giúp nhé">
          <Box className={classes.githubStarWrapper}>
            <GitHubButton
              href="https://github.com/loia5tqd001/Dang-Ky-Hoc-Phan-UIT/stargazers"
              data-icon="octicon-star"
              data-size="large"
              data-show-count={true}
              children={'Star'}
            />
          </Box>
        </Tooltip>
      </Drawer>
    </nav>
  );
}

export default Index;

// styles below:

const drawerWidth = 190;

const useStyles = makeStyles((theme) => ({
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      // flexShrink: 0,
    },
  },
  drawerClose: {
    // width: 0,
    // flexShrink: 0,
    // transform: 'translateX(-110px)',
  },
  drawerPaper: {
    width: drawerWidth,
    background: '#f2f1e3f0',
  },
  listItem: {
    borderTop: '1px solid transparent',
    borderBottom: '1px solid transparent',
    userSelect: 'none',
    userDrag: 'none',
    marginTop: 10,
  },
  menuItemActive: {
    background: '#f7dce733',
    color: theme.palette.primary.main,
    fontWeight: 'bolder',
    borderColor: '#ccc',
  },
  githubStarWrapper: {
    minHeight: 45,
    margin: 5,
    paddingTop: 5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '3px dotted #0477BD',
    borderRadius: 3,
  },
  typewriterWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));
