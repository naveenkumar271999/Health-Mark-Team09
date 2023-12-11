import { Grid } from '@mui/material';
import VendorSideBar from '../../Common/Compounds/VendorSideBar';
import VendorBody from '../../Common/Compounds/VendorBody';

const Vendor = () => {
  document.title = 'Health Mark | Home';

  return (
    <Grid container sx={styles.root}>
        <VendorSideBar />
        <VendorBody />
    </Grid>
  )
}

const styles = {
  root: {
    height: '100vh',
    maxHeight: '100vh',
  },
}

export default Vendor;