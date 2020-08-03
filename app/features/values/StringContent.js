import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import HomeIcon from '@material-ui/icons/Home';
import { Link } from 'react-router-dom';
import { addString, updateString } from './stringContentSlice';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  buttons: {
    padding: 5,
  },
}));

export default function Keys() {
  const classes = useStyles();

  const stringContent = useSelector((state) => state.stringContent);

  const dispatch = useDispatch();
  const onAddString = (value) => dispatch(addString(value));

  return (
    <div className={classes.root}>
      <div className={classes.buttons}>
        <Button
          startIcon={<HomeIcon />}
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          component={Link}
          to="/"
        >
          home
        </Button>
      </div>

      <List component="nav" aria-label="value">
        {stringContent.keyName === null ? 'empty value' : stringContent.keyName}
      </List>
    </div>
  );
}
