import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { hidePopup } from './popupSlice';


export default function Popup() {
  //const classes = useStyles();

  const dispatch = useDispatch();
  const isOpenPopup = useSelector((state) => state.popup.isOpenPopup);
  const message = useSelector((state) => state.popup.message);

  const onClose = () => {
    dispatch(hidePopup());
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      open={isOpenPopup}
      onClose={onClose}
      autoHideDuration={3000}
      key="bottom center"
    >
      <Alert severity="error" onClose={onClose}>
        {message}
      </Alert>
    </Snackbar>
  );
};
