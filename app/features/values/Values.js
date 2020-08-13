import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import IconButton from '@material-ui/core/IconButton';
import RefreshOutlinedIcon from '@material-ui/icons/RefreshOutlined';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import AccessTimeOutlinedIcon from '@material-ui/icons/AccessTimeOutlined';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import { clearString } from './stringContentSlice';
import Divider from '@material-ui/core/Divider';
import HashContent from './HashContent';
import StringContent from './StringContent';
import ZsetContent from './ZsetContent';
import ListContent from './ListContent';

// import { remote } from 'electron';

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
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(1),
      // width: theme.spacing(32),
      // height: theme.spacing(26),
      minWidth: 250,
      backgroundColor: theme.palette.background.paper,
    },
  },
  divider: {
    margin: theme.spacing(1),
  },
  title: {
    fontSize: 14,
  },
}));

export default function Values() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const selectKey = useSelector((state) => state.selected.selectKey);
  const selectType = useSelector((state) => state.selected.selectType);

  const clear = () => {
    dispatch(clearString());
  };

  return (
    <div>
      <div className={classes.root}>
        <Typography
          className={classes.title}
          color="textSecondary"
          gutterBottom
          align="center"
        >
          Value
        </Typography>

        <div className={classes.paper}>
          <Paper elevation={3}>
            <Tooltip TransitionComponent={Zoom} title="Reload">
              <IconButton
                variant="contained"
                className={classes.button}
                onClick={null}
              >
                <RefreshOutlinedIcon color="primary" />
              </IconButton>
            </Tooltip>

            <Tooltip TransitionComponent={Zoom} title="Save">
              <IconButton
                variant="contained"
                className={classes.button}
                onClick={null}
              >
                <SaveOutlinedIcon color="primary" />
              </IconButton>
            </Tooltip>

            <Tooltip TransitionComponent={Zoom} title="Edit">
              <IconButton
                variant="contained"
                className={classes.button}
                onClick={null}
              >
                <EditOutlinedIcon color="primary" />
              </IconButton>
            </Tooltip>

            <Tooltip TransitionComponent={Zoom} title="Set TTL">
              <IconButton
                variant="contained"
                className={classes.button}
                onClick={null}
              >
                <AccessTimeOutlinedIcon color="primary" />
              </IconButton>
            </Tooltip>

            <Tooltip TransitionComponent={Zoom} title="Delete">
              <IconButton
                variant="contained"
                className={classes.button}
                onClick={null}
              >
                <DeleteOutlineOutlinedIcon color="primary" />
              </IconButton>
            </Tooltip>

            <Tooltip TransitionComponent={Zoom} title="Clear">
              <IconButton
                variant="contained"
                className={classes.button}
                onClick={clear}
              >
                <ClearAllIcon color="primary" />
              </IconButton>
            </Tooltip>

          </Paper>
        </div>

      </div>

      <Typography key="title">
        {selectType} {selectKey? ':' : ' '} {selectKey}
      </Typography>

      <Divider className={classes.divider} />

      <StringContent />
      <Divider className={classes.divider} />

      <HashContent />
      <Divider className={classes.divider} />

      <ZsetContent />
      <Divider className={classes.divider} />

      <ListContent />
      <Divider className={classes.divider} />
    </div>
  );
}
