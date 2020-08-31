import { makeStyles } from '@material-ui/core/styles';

const useValueStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    //maxWidth: 360,
  },
  buttons: {
    padding: 5,
    margin: theme.spacing(0),
    // backgroundColor: '#0000cc',
    // borderColor: '#005cbf',
  },
  table: {
    minWidth: 200,
  },
  dateTab: {
    width: '100',
    paddingLeft: theme.spacing(1),
    // margin: theme.spacing(1),
  },
  paper: {
    //width: '100%',
    //minWidth: 200,
    margin: theme.spacing(1),
    //backgroundColor: theme.palette.background.paper,
  },
  textField: {
    width: '80%',
    margin: theme.spacing(2),
  },
  divider: {
    margin: theme.spacing(1),
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

export default useValueStyles;
