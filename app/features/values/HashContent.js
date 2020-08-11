import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

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
}));

export default function HashContent() {
  const classes = useStyles();

  const keyName = useSelector((state) => state.hashContent.keyName);
  const contents = useSelector((state) => state.hashContent.contents);

  return (
    <div className={classes.root}>

      <TableContainer component={Paper}>
        <Table stickyHeader className={classes.table} size="small" aria-label="a dense table">

          <TableHead>
            <TableRow>
              <TableCell>Key</TableCell>
              <TableCell align="left">Value</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {contents.map((kv) => (
              <TableRow key={kv.key}>
                <TableCell component="th" scope="row">
                  {kv.key}
                </TableCell>
                <TableCell align="left">{kv.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

    </div>
  );
}
