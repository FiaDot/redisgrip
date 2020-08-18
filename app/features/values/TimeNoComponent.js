import React from 'react';
import useValueStyles from './ValueStyle';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

export default function TimeNoComponent(props) {
  const classes = useValueStyles();

  const { time, no } = props;

  return (
    <Paper elevation={3} className={classes.dateTab}>
      <Typography variant="caption">{time} [No.{no}]</Typography>
    </Paper>
  );
};
