import React from 'react';
import { Link } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AddBoxIcon from '@material-ui/icons/AddBox';

export default function ServersToolbar() {
  // const ServersToolbar = () => {
  return (
    <div>
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
        </div>
      </Container>
    </div>
  );
};

//export default ServersToolbar;
