import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import VpnKeyOutlinedIcon from '@material-ui/icons/VpnKeyOutlined';
import RefreshOutlinedIcon from '@material-ui/icons/RefreshOutlined';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import { scanKeys } from './keysSlice';
import { selectKey } from '../servers/selectedSlice';
import SearchKey from './SearchKey';
import AddKeyDialog from './AddKeyDialog';
import DelKeyDialog from './DelKeyDialog';
import Badge from '@material-ui/core/Badge';
import withStyles from '@material-ui/core/styles/withStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import DeleteForeverOutlinedIcon from '@material-ui/icons/DeleteForeverOutlined';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import GroupKeys from './GroupKeys';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    // width: 500,
    //maxWidth: 360,
    backgroundColor: theme.palette.background.default,
    //overflowY: 'scroll',
  },
  //button: {
  //   margin: theme.spacing(0),
  //   // backgroundColor: '#0000cc',
  //   // borderColor: '#005cbf',
  // },
  // paper: {
  //   display: 'flex',
  //   flexWrap: 'wrap',
  //   '& > *': {
  //     margin: theme.spacing(1),
  //     width: theme.spacing(32),
  //     height: theme.spacing(6),
  //     //minWidth: 250,
  //     backgroundColor: theme.palette.background.paper,
  //   },
  // },
  // title: {
  //   fontSize: 14,
  // },
  paper: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    // display: 'flex',
    // flexWrap: 'wrap',
    // '& > *': {
    //   margin: theme.spacing(1),
    //   width: theme.spacing(32),
    //   height: theme.spacing(6),
    //   minWidth: 300,
    //   backgroundColor: theme.palette.background.paper,
    // },
  },
}));

const StyledBadge = withStyles((theme) => ({
  badge: {
    right: 25,
    top: 1,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}))(Badge);
//
// const NormalItem = (key, onSelectKey, selectedKey) = (
//   <ListItem
//     button
//     selected={selectedKey === key.key}
//     key={key.key}
//     onClick={(event) => onSelectKey(key.key)}
//   >
//     <StyledBadge badgeContent={key.count} max={9} color="secondary">
//       {/*<Badge color="primary" variant="dot" invisible={false}>*/}
//       <VpnKeyOutlinedIcon
//         color={key.delete ? 'secondary' : 'primary'}
//         style={{ paddingRight: 10, fontSize: 32 }}
//       />
//       {/*</Badge>*/}
//     </StyledBadge>
//     <ListItemText primary={key.key} />
//   </ListItem>
// );

const KeysMemo = React.memo(function keys({ keys, onSelectKey, selectedKey }) {
  return (
    <div>
      {keys.map((key) => (
        <Grid container spacing={0} key={key.key}>
          <Grid item xs={12}>
            {/*{NormalItem(key, onSelectKey, selectedKey)}*/}

            {key.deleted ?
              <ListItem
                key={key.key}
              >
                <StyledBadge badgeContent={0} max={9} color="secondary">
                  {/*<Badge color="primary" variant="dot" invisible={false}>*/}
                  <DeleteForeverOutlinedIcon
                    color={"secondary"}
                    style={{ paddingRight: 10, fontSize: 32 }}
                  />
                  {/*</Badge>*/}
                </StyledBadge>
                <ListItemText primary={key.key + ' [DELETED]'} />
              </ListItem>
              :
              <ListItem
                button
                selected={selectedKey === key.key}
                key={key.key}
                onClick={(event) => onSelectKey(key.key)}
              >
                <StyledBadge badgeContent={key.count} max={9} color="secondary">
                  {/*<Badge color="primary" variant="dot" invisible={false}>*/}
                  <VpnKeyOutlinedIcon
                    color={key.delete ? 'secondary' : 'primary'}
                    style={{ paddingRight: 10, fontSize: 32 }}
                  />
                  {/*</Badge>*/}
                </StyledBadge>
                <ListItemText primary={key.key}/>
              </ListItem>
            }
            {/*<Divider variant="middle" component="li" />*/}
          </Grid>
        </Grid>
      ))}
    </div>
  );
});

export default function Keys() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const keys = useSelector((state) => state.keys);
  const selectedKey = useSelector((state) => state.selected.selectKey);

  const initialState = {
    group: false,
  };

  const [inputs, setInputs] = useState(initialState);

  const { group } = inputs;

  const handleChange = (event) => {
    setInputs({ ...inputs, [event.target.name]: event.target.checked });
    console.log(`group=${group}`);
  };


  const onSelectKey = async (key) => {
    await dispatch(selectKey({ key }));
  };

  const scan = async () => {
    await dispatch(scanKeys());
  };

  return (
    <div className={classes.root}>
      <CssBaseline />

      <Typography
        className={classes.title}
        color="textSecondary"
        gutterBottom
        align="center"
      >
        Keys
      </Typography>

      <div className={classes.paper}>
        <Paper elevation={3}>
          {/* Refresh */}
          <Tooltip TransitionComponent={Zoom} title="Refresh">
            <IconButton
              variant="contained"
              className={classes.button}
              onClick={(event) => scan()}
            >
              <RefreshOutlinedIcon color="primary" />
            </IconButton>
          </Tooltip>

          {/* Add Key */}
          <AddKeyDialog />


          {/* Del key */}
          <DelKeyDialog />

          {/* Trace key : TODO : IMPL */}
          {/*<Tooltip TransitionComponent={Zoom} title="Trace Key">*/}
          {/*  <IconButton*/}
          {/*    variant="contained"*/}
          {/*    className={classes.button}*/}
          {/*    onClick={null}*/}
          {/*  >*/}
          {/*    <TrackChangesOutlinedIcon color={'disabled'} />*/}
          {/*  </IconButton>*/}
          {/*</Tooltip>*/}

          <FormControlLabel
            control={
              <Switch checked={group} onChange={handleChange} color="primary" name="group" />
            }
            label="Group"
            labelPlacement="start"
          />
        </Paper>
      </div>

      {/* Search bar TODO : IMPL*/}
      {/*<SearchKey />*/}

      {/* Key List */}
      {group
        ?
          <GroupKeys />
        :
          <List component="nav" aria-label="keys">
            {
              keys.length <= 0
                ? ''
                : <KeysMemo keys={keys} onSelectKey={onSelectKey} selectedKey={selectedKey} />
            }
          </List>
      }

    </div>
  );
}
