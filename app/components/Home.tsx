import React from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes.json';
import { List, ListItem, ListItemText } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function Home(): JSX.Element {
  const classes = useStyles();

  return (
    <div className={classes.root}>

      <h4>Home - Debug</h4>

      <List component="nav" aria-label="secondary mailbox folders">

        <ListItem button>
          <Link to={routes.COUNTER}>
            <ListItemText primary="to Counter" />
          </Link>
        </ListItem>

        <ListItem button>
          <Link to={routes.SERVERS}>
            <ListItemText primary="to Server" />
          </Link>
        </ListItem>

        <ListItem button>
          <Link to={routes.ADDSERVER}>
            <ListItemText primary="Add Server" />
          </Link>
        </ListItem>

      </List>
    </div>
  );
}
