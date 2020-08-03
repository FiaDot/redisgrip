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
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { addHash } from './hashContentSlice';

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

  const hashContent = useSelector((state) => state.hashContent);

  return (
    <div className={classes.root}>
      <List component="nav" aria-label="value">
        {hashContent.keyName === null
          ? 'empty hash value'
          : hashContent.content.map((kv) =>
            <ListItemText key={kv.key} primary={kv.key} secondary={kv.value} />
          )}
      </List>
    </div>
  );
}
