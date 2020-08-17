import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
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
    margin: theme.spacing(1),
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

export default function SetContent() {
  const classes = useStyles();

  const selectKey = useSelector((state) => state.selected.selectKey);
  const selectType = useSelector((state) => state.selected.selectType);

  const records = useSelector((state) => state.setContent.records);

  const showRecord = (index, value) => (
    <TableRow key={`${index}_${value}`}>

      <TableCell component="th" scope="row">
        {index}
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

        <Table stickyHeader className={classes.table} size="small" aria-label="set table">
          <TableHead>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell align="left">Value</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            { value.table.map((kv, index) => showRecord(index, kv.value)) }
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
