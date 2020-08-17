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
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import LaptopMacIcon from '@material-ui/icons/LaptopMac';
import HotelIcon from '@material-ui/icons/Hotel';
import RepeatIcon from '@material-ui/icons/Repeat';
import Paper from '@material-ui/core/Paper';

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
    //width: '100%',
    //minWidth: 200,
    backgroundColor: theme.palette.background.paper,
    margin: theme.spacing(1),
  },
  dateTab: {
    width: '100',
    // margin: theme.spacing(1),
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
  const stringRecords = useSelector((state) => state.stringContent.records);

  const dispatch = useDispatch();

  const addStringTest = (key, value) => {
    dispatch(addString({ key, value }));
  };


  const showValues = (key, history) => (
    // TODO : key가 들어가야 에러가 안난다... 넣었을때 고유번호 같은걸 하나 넣어야 할듯!!
    // <Typography
    //   className={classes.title}
    //   color="textSecondary"
    //   align="center"
    //   key={`${key}_${history.no}`}
    // >
    //   {history.no} {history.value} {history.time}
    // </Typography>
    <div className={classes.paper} key={`${key}_${history.no}`}>
        <Paper elevation={3} className={classes.dateTab}>
          <Typography variant="caption">{history.time} [No.{history.no}]</Typography>
        </Paper>

        <Paper elevation={3}>
          <Typography>{history.value}</Typography>
        </Paper>
    </div>
  );

  return (
    <div>

      {
        stringRecords.map((record) => (

          record.key === selectKey ?
            record.values.map((valueRecord) => (
                showValues(record.key, valueRecord)
            ))
            : ''
        ))
      }


      {/* 디버깅용 */}

      <Tooltip TransitionComponent={Zoom} title="Add Key">
      <Fab color="primary" aria-label="add" className={classes.fab}>
          <AddIcon />
      </Fab>
      </Tooltip>


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

    </div>
  );
}
