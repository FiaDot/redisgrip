import React from 'react';
import { Link } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AddBoxIcon from '@material-ui/icons/AddBox';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


export default function ServersToolbar() {
  // const ServersToolbar = () => {

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (message) => {
    console.log(message);
    setOpen(false);
  };


  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Use Google's location service?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending anonymous location data to
            Google, even when no apps are running.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={(event) => handleClose('disagree')} color="secondary">
            Disagree
          </Button>
          <Button onClick={(event) => handleClose('agree')} color="primary" autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>

      <Container maxWidth="sm">
        <Typography variant="h6">Connections</Typography>

        <div>
          <IconButton
            component={Link}
            to="/AddServer"
            fontSize="large"
            color="primary"
            aria-label="add"
          >
            <AddBoxIcon />
          </IconButton>

          <IconButton
            fontSize="large"
            color="primary"
            aria-label="show"
            onClick={handleClickOpen}
          >
            <AddBoxIcon />
          </IconButton>

        </div>
      </Container>
    </div>
  );
};

//export default ServersToolbar;
