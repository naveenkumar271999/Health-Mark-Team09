import { Grid } from '@mui/material';
import DoctorSideBar from '../../Common/Compounds/DoctorSideBar';
import DoctorBody from '../../Common/Compounds/DoctorBody';

const Doctor = () => {
  document.title = 'Health Mark | Home';

  return (
      <Grid container sx={styles.root}>
          <DoctorSideBar />
          <DoctorBody />
      </Grid>
  )
}

const styles = {
  root: {
    height: '100vh',
    maxHeight: '100vh',
  },
}

export default Doctor;