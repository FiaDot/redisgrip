import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  buttons: {
    padding: 5,
  },
  table: {
    minWidth: 200,
  },
  paper: {
    padding: 5,
    margin: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    fontSize: 14,
  },
  divider: {
    margin: theme.spacing(1),
  },
}));

export default function HashContent() {
  const classes = useStyles();

  const selectKey = useSelector((state) => state.selected.selectKey);
  const selectType = useSelector((state) => state.selected.selectType);

  const records = useSelector((state) => state.zsetContent.records);

  // {key, values:[{no, time, hash:[{key,value}]}]
  const showHash = (key, value) => (

    <TableRow key={`${key}_${value}`}>

      <TableCell component="th" scope="row">
        {key}
      </TableCell>

      <TableCell align="left">
        {value}
      </TableCell>

    </TableRow>
  );

  const showKey = (key, value) => (
    <div key={value.time}>

      <Divider className={classes.divider} />

      <TableContainer component={Paper} key={`${key}_${value.no}`}>

        <Typography key="title">
          {value.no} / {value.time}
        </Typography>

        <Table stickyHeader className={classes.table} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Key</TableCell>
              <TableCell align="left">Score</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            { value.table.map((kv) => showHash(kv.key, kv.value)) }
          </TableBody>
        </Table>
      </TableContainer>

    </div>
  );

  return (
    <div className={classes.root}>
        { records.map((record) =>
            record.values.map((value) =>
              showKey(record.key, value)
            )
        )}
    </div>
  );
}
