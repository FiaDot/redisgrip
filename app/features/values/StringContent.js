import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import { addString } from './stringContentSlice';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#eeeeee',
    // backgroundColor: theme.palette.background.paper,
  },
  button: {
    margin: theme.spacing(0),
    // backgroundColor: '#0000cc',
    // borderColor: '#005cbf',
  },
  paper: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(1),
      // width: theme.spacing(32),
      // height: theme.spacing(26),
      minWidth: 250,
      backgroundColor: '#eeeeee',
    },
  },
  title: {
    fontSize: 14,
  },
}));

export default function StringContent() {
  const classes = useStyles();

  const stringContent = useSelector((state) => state.stringContent.content);

  const dispatch = useDispatch();
  const onAddString = (value) => dispatch(addString(value));

  const [val, setVal] = useState(stringContent.content);

  const onChangeValue = (newVal) => {
    setVal(newVal);
  };

  return (
    <div>
      <TextField
        id="outlined-multiline-static"
        label="String"
        multiline
        rows={4}
        variant="outlined"
        value={stringContent}
        // onChange={(e) => {
        //   onChangeValue(e.target.value);
        // }}
      />
    </div>
  );
}
