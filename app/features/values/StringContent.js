import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import IconButton from '@material-ui/core/IconButton';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import Typography from '@material-ui/core/Typography';
import { addString, clearAllString, clearString } from './stringContentSlice';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.default,
  },
  button: {
    margin: theme.spacing(0),
    // backgroundColor: '#0000cc',
    // borderColor: '#005cbf',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    fontSize: 14,
  },
  textField: {
    width: '80%',
    margin: theme.spacing(2),
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

export default function StringContent() {
  const classes = useStyles();

  const selectKey = useSelector((state) => state.selected.selectKey);
  const selectType = useSelector((state) => state.selected.selectType);

  const stringRecords = useSelector((state) => state.stringContent.records);

  const dispatch = useDispatch();
  const onAddString = (value) => dispatch(addString(value));

  // const [val, setVal] = useState();
  //
  // const onChangeValue = (newVal) => {
  //   setVal(newVal);
  // };

  const addStringTest = (key, value) => {
    dispatch(addString({ key, value }));
  };


  const showValues = (key, history) => (
    // TODO : key가 들어가야 에러가 안난다... 넣었을때 고유번호 같은걸 하나 넣어야 할듯!!
    <Typography
      className={classes.title}
      color="textSecondary"
      align="center"
      key={`${key}_${history.no}`}
    >
      {history.no} {history.value} {history.time}
    </Typography>
  );

  return (
    <div>
      <Tooltip TransitionComponent={Zoom} title="clearAllString">
        <IconButton
          variant="contained"
          className={classes.button}
          onClick={(e) => dispatch(clearAllString())}
        >
          <ClearAllIcon className={classes.buttonIcon} color="secondary" />
        </IconButton>
      </Tooltip>

      <Tooltip TransitionComponent={Zoom} title="clearString">
        <IconButton
          variant="contained"
          className={classes.button}
          onClick={(e) => dispatch(clearString('string_test'))}
        >
          <ClearAllIcon className={classes.buttonIcon} color="secondary" />
        </IconButton>
      </Tooltip>

      <Tooltip TransitionComponent={Zoom} title="addString">
        <IconButton
          variant="contained"
          className={classes.button}
          onClick={(e) => addStringTest('string_test', 'ww3')}
        >
          <ClearAllIcon className={classes.buttonIcon} color="secondary" />
        </IconButton>
      </Tooltip>

      {
        stringRecords.map((record) => (

          record.key === selectKey ?
            record.values.map((valueRecord) => (
                showValues(record.key, valueRecord)
            ))
            : ''
        ))
      }

      <Tooltip TransitionComponent={Zoom} title="Add Key">
      <Fab color="primary" aria-label="add" className={classes.fab}>
          <AddIcon />
      </Fab>
      </Tooltip>
    </div>
  );
}
