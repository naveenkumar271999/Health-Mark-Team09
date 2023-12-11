import { Grid } from '@mui/material';
import AdminSideBar from '../../Common/Compounds/AdminSideBar';
import AdminBody from '../../Common/Compounds/AdminBody';

const Admin = () => {
  document.title = 'Health Mark | Admin';

  return (
    <Grid container sx={styles.root}>
        <AdminSideBar />
        <AdminBody />
    </Grid>
  )
}

const styles = {
  root: {
    height: '100vh',
    maxHeight: '100vh',
    overflowY: 'scroll',
  },
}

export default Admin;