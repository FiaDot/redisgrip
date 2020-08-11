import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import StringContent from './StringContent';
import HashContent from './HashContent';

// import { remote } from 'electron';

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

export default function Values() {
  const classes = useStyles();
  const dispatch = useDispatch();

  return (
    <div className={classes.root}>
       <StringContent />
       <HashContent />
    </div>
  );
}
