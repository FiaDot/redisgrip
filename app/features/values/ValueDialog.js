import React, { Fragment, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import EditValueDialog from './EditValueDialog';
import AddValueDialog from './AddValueDialog';
import DelValueDialog from './DelValueDialog';

const useStyles = makeStyles((theme) => ({
  appBar: {
    top: 'auto',
    bottom: 10,
    width: `calc(100% - 80%)`,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function ValueDialog() {
  const classes = useStyles();

  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <AppBar position="fixed" className={classes.appBar}>
      <div>
        <EditValueDialog />
        <AddValueDialog />
        <DelValueDialog />
      </div>
    </AppBar>
  );
}
