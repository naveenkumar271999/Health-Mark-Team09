import { Box, Button, Grid, NativeSelect, Typography } from '@mui/material';
import { theme } from '../../../theme/muiTheme';
import CloseIcon from '@mui/icons-material/Close';
import UserIcon from '@mui/icons-material/Person';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../Atoms/Input';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { addUser, bookAppointment, deleteUser, updateUser } from '../../../../context/slices/userSlice';
import { setUser } from '../../../../context/slices/authSlice';
import MoonLoader from 'react-spinners/MoonLoader';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import bcrypt from 'bcryptjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';


/**
 * @param {*} 
 * @param {*} callback: function to close the modal
 * @param {*} modalStatus: object that contains the modal status and its type
 * @returns: UserProfile component
 * @description: This component is a modal that allows the user to add a new Product
 */
const UserProfile = ({ callback: handleModalOpenClose, modalStatus }) => {

    const [userProfileData, setUserProfileData] = useState(
        modalStatus.user || {
            firstName: '',
            lastName: '',
            email: '',
            role: 'user',
            bio: '',
            appointments:[]
        });
      
        const [passwordData, setPasswordData] = useState({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        });
    
    const loggedInUser = useSelector(state => state.auth.user);

    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);

    /* This function is called when the user clicks on the save button */
    const handleSaveUser = () => {
        if (
            userProfileData.firstName === '' ||
            userProfileData.lastName === '' ||
            userProfileData.email === ''
        ) {
            toast.error('Please fill in all the fields');
            return;
        }

        if (passwordData.currentPassword) {
            // Check if the current password matches the user's current password
            const isCurrentPasswordMatch = bcrypt.compareSync(
                passwordData.currentPassword,
                userProfileData.password
            );
    
            if (!isCurrentPasswordMatch) {
                toast.error('Current password is incorrect');
                return;
            }
            
            // Check if both new password and confirm password are provided
            if (!passwordData.newPassword || !passwordData.confirmPassword) {
                toast.error('Please provide both new password and confirm password');
                return;
            }
    
            // Validate new password length and equality with confirm password
            if (passwordData.newPassword.length < 8 || passwordData.newPassword !== passwordData.confirmPassword) {
                toast.error('New password must be at least 8 characters long and match the confirm password');
                return;
            }
        }
        // If nothing is changed, close the modal
        if (
            userProfileData.firstName === modalStatus.user.firstName &&
            userProfileData.lastName === modalStatus.user.lastName &&
            userProfileData.email === modalStatus.user.email &&
            userProfileData.role === modalStatus.user.role &&
            userProfileData.bio === modalStatus.user.bio &&
            passwordData.newPassword === '' &&
            passwordData.confirmPassword === ''
        ) {
            toast.error('No changes detected');
            return;
        }

        setLoading(true);

        const updatedUserData = { ...userProfileData };

        // If new password is provided, update the password in the user data
        if (passwordData.newPassword !== '' && passwordData.confirmPassword !== '') {
            updatedUserData.password = passwordData.newPassword;
        }

        dispatch(updateUser(updatedUserData))
            .then((resultAction) => {
                if (updateUser.fulfilled.match(resultAction)) {
                    const { status } = resultAction.payload;
                    if (status === 200) {
                        toast.success('User updated successfully');
                        if (loggedInUser._id === userProfileData._id) {
                            dispatch(setUser(updatedUserData));
                        }
                        setLoading(false);
                        handleModalOpenClose();
                    } else {
                        toast.error('Error updating user');
                        setLoading(false);
                    }
                }
            })
            .catch((error) => {
                setLoading(false);
                toast.error(error.message);
            });
    };

    const handleDeleteUser = () => {
        setLoading(true);
        dispatch(deleteUser(userProfileData._id))
            .then((resultAction) => {
                if (deleteUser.fulfilled.match(resultAction)) {
                    const { status } = resultAction.payload;
                    if (status === 200) {
                        toast.success("User deleted successfully");
                        handleModalOpenClose();
                        setLoading(false);
                    }
                    else {
                        toast.error("Error deleting user");
                        setLoading(false);
                    }
                } else {
                    toast.error("Error deleting user");
                    setLoading(false);
                }
            })
            .catch((error) => {
                toast.error(error.message);
                setLoading(false);
            });
    }

    const handleAddNewUser = () => {
        if (userProfileData.firstName === '' || userProfileData.lastName === '' || userProfileData.email === '') {
            toast.error('Please fill in all the fields');
            return;
        }
        setLoading(true);
        dispatch(addUser(userProfileData))
            .then((res) => {
                toast[res.payload.status === 200 ? 'success' : 'error'](res.payload.message);
                setLoading(false);
                handleModalOpenClose();
            })
            .catch((error) => {
                toast.error(error.message);
                setLoading(false);
            });
    }

    return (
        <Grid item xs={12} sx={styles.root}>
            {/* HEADER IS HERE */}
            <Box sx={styles.header}>
                <Box onClick={handleModalOpenClose}
                    sx={{ cursor: 'pointer', '&:hover': { opacity: '.5' } }}>
                    <CloseIcon sx={styles.closeIcon} />
                </Box>
                <Typography sx={styles.headerText} onClick={modalStatus.type === 'empty' ? handleAddNewUser : handleSaveUser}>
                    {modalStatus.readonly ? '' : 'Save User'}
                </Typography>
            </Box>

            <Box sx={styles.bodyContainer}>
                <Box sx={styles.subHeader}>
                    <UserIcon sx={{ fontSize: '36px', color: theme.palette.primary.main }} />
                    <Typography sx={{ fontSize: '24px', fontWeight: 'bold', marginLeft: '12px' }}>
                        {modalStatus.user ? modalStatus.user.firstName + "'s Profile" : 'Add New User'}
                    </Typography>
                    <Typography sx={styles.roleText}>
                        {modalStatus.user ? modalStatus.user.role : 'User'}
                    </Typography>
                </Box>
                {
                    // if role is admin or it matches the vendorID, delete button
                    (modalStatus.type !== 'empty' && loggedInUser.role === 'admin') &&
                    <Box sx={styles.addToCartContainer}>
                        <Box sx={styles.addToCart}>
                            <Typography sx={styles.addToCartText} onClick={handleDeleteUser}>
                                Delete User
                            </Typography>
                        </Box>
                    </Box>
                }
                {/* If loggedin user is user and current user is doctor, show book appoiintment */}
                {loggedInUser.role === 'user' && modalStatus.user && modalStatus.user.role === 'doctor' ? (
                    <>
                        <Box sx={styles.addToCartContainer}>
                            <BookAppointment doctorId={modalStatus.user._id} userId={loggedInUser._id}  existingAppointments={userProfileData.appointments} />
                        </Box>
                        <Typography sx={{ fontSize: '14px', fontWeight: 'bold', }}>
                            {userProfileData.appointments && userProfileData.appointments.length + ' appointments booked'}
                        </Typography>
                    </>
                ) : null}
                <Box sx={styles.dataContainer}>
                    {loading &&
                        <Box sx={styles.overlay}>
                            <MoonLoader color={theme.palette.primary.main} loading={loading} size={24} />
                        </Box>
                    }
                    <Box sx={styles.metadataItem}>
                        <Box sx={styles.metadataItem}>
                            <Typography sx={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' }}>Bio</Typography>
                            <Typography sx={{ fontSize: '14px', marginBottom: '12px' }}>{userProfileData.bio}</Typography>
                        </Box>
                        <Input title={'First Name'} placeholder={'First Name'} name={'firstName'} type={'text'}
                            value={userProfileData.firstName}
                            onChange={(e) => setUserProfileData({ ...userProfileData, firstName: e.target.value })}
                            disabled={modalStatus.readonly}
                        />
                    </Box>
                    <Box sx={styles.metadataItem}>
                        <Input title={'Last Name'} placeholder={'Last Name'} name={'lastName'} type={'text'} value={userProfileData.lastName} onChange={(e) => setUserProfileData({ ...userProfileData, lastName: e.target.value })} disabled={modalStatus.readonly} />
                    </Box>
                    <Box sx={styles.metadataItem}>
                        <Input title={'Email'} placeholder={'Email'} name={'email'} type={'email'} value={userProfileData.email} onChange={(e) => setUserProfileData({ ...userProfileData, email: e.target.value })} disabled={modalStatus.readonly} />
                    </Box>
                    <Box sx={styles.metadataItem}>
                        {loggedInUser.role === 'admin' ?
                            (
                                <>
                                    <Typography sx={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' }}>Role</Typography>
                                    <NativeSelect sx={styles.metaDataSelect} value={userProfileData.role} onChange={(e) => setUserProfileData({ ...userProfileData, role: e.target.value })} disabled={modalStatus.readonly}>
                                        <option value={'user'}>User</option>
                                        <option value={'admin'}>Admin</option>
                                        <option value={'doctor'}>Doctor</option>
                                        <option value={'vendor'}>Vendor</option>
                                    </NativeSelect>
                                </>
                            ) : (
                                <Input title={'Role'} placeholder={'Role'} name={'role'} type={'text'} value={userProfileData.role} onChange={(e) => setUserProfileData({ ...userProfileData, role: e.target.value })} disabled={true} />
                            )}

                    </Box>
                    <Box sx={styles.metadataItem}>
                        <Input title={'Bio'} placeholder={'Bio'} name={'bio'} type={'text'} value={userProfileData.bio} onChange={(e) => setUserProfileData({ ...userProfileData, bio: e.target.value })} disabled={modalStatus.readonly} />
                    </Box>
                    <Box sx={styles.metadataItem} hidden>
                        <Input title={'Created At'} placeholder={'Created At'} name={'createdAt'} type={'text'}
                            value={userProfileData.createdAt ? dayjs(userProfileData.createdAt).format('dddd, MMMM D, YYYY h:mm A') : ''}
                            disabled={true} />
                    </Box>
                    <Box sx={styles.metadataItem} hidden>
                        <Input title={'Last Updated'} placeholder={'Updated At'} name={'updatedAt'} type={'text'}
                            value={userProfileData.updatedAt ? dayjs(userProfileData.updatedAt).format('dddd, MMMM D, YYYY h:mm A') : ''}
                            disabled={true} />
                    </Box>
                    {loggedInUser.role === 'vendor' || loggedInUser.role === 'doctor' ? (
                        <Box sx={styles.metadataItem}>
                            <Typography sx={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' }}>
                                Change Password
                            </Typography>
                            <Input
                                title={'Current Password'}
                                placeholder={'Current Password'}
                                name={'currentPassword'}
                                type={'password'}
                                value={passwordData.currentPassword}
                                onChange={(e) =>
                                    setPasswordData({ ...passwordData, currentPassword: e.target.value })
                                }
                                disabled={modalStatus.readonly}
                            />
                            <Input
                                title={'New Password'}
                                placeholder={'New Password'}
                                name={'newPassword'}
                                type={'password'}
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                disabled={modalStatus.readonly}
                            />
                            <Input
                                title={'Confirm Password'}
                                placeholder={'Confirm Password'}
                                name={'confirmPassword'}
                                type={'password'}
                                value={passwordData.confirmPassword}
                                onChange={(e) =>
                                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                                }
                                disabled={modalStatus.readonly}
                            />
                        </Box>
                    ) : null}

                </Box>
            </Box>
        </Grid>
    );
}

UserProfile.propTypes = {
    open: PropTypes.bool,
    callback: PropTypes.func,
    modalStatus: PropTypes.object,
    user: PropTypes.object,
}
const currentTime = new Date();

const BookAppointment = ({ doctorId, userId, existingAppointments }) => {
  const [loading, setLoading] = useState(false);
  const [appointmentData, setAppointmentData] = useState({
    date: dayjs(),
    time: currentTime,
  });

  const shouldDisableTime = (time) => {
    const isBeforeCurrentTime = time < currentTime;
    const isToday = time.toDateString() === currentTime.toDateString();
    const isPastDate = appointmentData.date.$d.toDateString() < dayjs().startOf('day').$d.toDateString();
    return (isBeforeCurrentTime && isToday && !isPastDate);
  };

  const isDisabled = shouldDisableTime(appointmentData.time);

  const dispatch = useDispatch();

  const handleBookAppointment = () => {
    setLoading(true);

    const appointment = {
      doctorId: doctorId,
      patientId: userId,
      date: appointmentData.date.format(),
      time: appointmentData.time,
    };
   
    const hasExistingAppointment = existingAppointments.some(
        (existingAppointment) => {
          
          const existingDate = dayjs(existingAppointment.date).format('YYYY-MM-DD');
          const expectedDate = dayjs(appointmentData.date).format('YYYY-MM-DD');
      
          const existingTime = dayjs(existingAppointment.time).format('YYYY-MM-DD HH:MM');
          const expectedTime = dayjs(appointmentData.time).format('YYYY-MM-DD HH:MM');
      
          const hasSameDate = existingDate === expectedDate;
          const hasSameTime = existingTime === expectedTime;
      
          const result = hasSameDate && hasSameTime;
      
          return result;
        }
      );
      
  
    if (hasExistingAppointment) {
      toast.error('You already have an appointment in this slot for the selected date.');
      setLoading(false);
      return;
    }

    dispatch(bookAppointment(appointment))
      .then((resultAction) => {
        if (bookAppointment.fulfilled.match(resultAction)) {
          const { status } = resultAction.payload;
          existingAppointments  = resultAction.payload.user.appointments;
          if (status === 200) {
            toast.success('Appointment booked successfully');
          } else {
            toast.error('Error booking appointment');
          }
        }
      })
      .catch((error) => {
        toast.error(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleTimeChange = (newValue) => {
    setAppointmentData({ ...appointmentData, time: newValue });
  };

  return (
    <Box sx={styles.appointmentContainer}>
      <Box sx={styles.appointmentHeader}>
        <Typography sx={styles.appointmentHeaderText}>Book Appointment</Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs} sx={{ width: '100%' }}>
          <DatePicker
            sx={styles.appointmentDatePicker}
            label="Appointment Date"
            value={appointmentData.date}
            onChange={(newValue) => {
              setAppointmentData({ ...appointmentData, date: newValue });
            }}
            renderInput={(params) => <Input {...params} />}
            minDate={dayjs()}
            maxDate={dayjs().add(1, 'month')}
          />
        </LocalizationProvider>
      </Box>
      <Box sx={styles.appointmentBody}>
        <Typography sx={styles.appointmentBodyText}>Select Time</Typography>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <TimePicker
            sx={styles.appointmentDatePicker}
            label="Appointment Time"
            value={appointmentData.time}
            onChange={handleTimeChange}
            renderInput={(params) => <Input {...params} />}
            shouldDisableTime={shouldDisableTime}
          />
        </LocalizationProvider>
      </Box>
      <Box sx={styles.appointmentFooter}>
        <Button sx={styles.appointmentButton} onClick={handleBookAppointment} disabled={isDisabled}>
          Book Appointment
        </Button>
      </Box>
    </Box>
  );
};

BookAppointment.propTypes = {
  doctorId: PropTypes.string,
  userId: PropTypes.string,
  existingAppointments: PropTypes.array,
};



const styles = {
    root: {
        position: 'absolute',
        top: '0px',
        right: '0px',
        width: '100%',
        height: '100%',
        backgroundColor: theme.palette.light.main,
        zIndex: '100',
        overflowY: 'auto',
        boxShadow: '-5px 0px 5px rgba(0, 0, 0, 0.1)',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px',
        borderBottom: '1px solid #E0E0E0',
    },
    closeIcon: {
        fontSize: '24px',
        color: theme.palette.subtitle.main,
    },
    bodyContainer: {
        padding: '24px',
    },
    headerText: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: theme.palette.primary.main,
        cursor: 'pointer',
        '&:hover': {
            color: theme.palette.lightgray.main,
        }
    },
    subHeader: {
        display: 'flex',
        alignItems: 'center',
        paddingBottom: '24px',
        borderBottom: '1px solid #E0E0E0',
    },
    roleText: {
        fontSize: '14px',
        marginLeft: '12px',
        backgroundColor: theme.palette.primary.main,
        padding: '4px 8px',
        color: theme.palette.light.main,
        borderRadius: '4px',
        textAlign: 'center',
    },
    addToCartContainer: {
        display: 'flex',
        justifyContent: 'flex-start',
        marginTop: '12px',
    },
    addToCart: {
        backgroundColor: theme.palette.primary.main,
        padding: '8px 16px',
        borderRadius: '4px',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: theme.palette.primary.dark,
        }
    },
    addToCartText: {
        fontSize: '14px',
        fontWeight: 'bold',
        color: theme.palette.light.main,
    },
    dataContainer: {
        display: 'flex',
        flexDirection: 'column',
        marginTop: '24px',
        paddingBottom: '24px',
        borderBottom: '1px solid #E0E0E0',
    },
    overlay: {
        position: 'absolute',
        top: '0px',
        left: '0px',
        width: '100%',
        height: 'calc(100% - 48px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        zIndex: '1',
    },
    metadataItem: {
        alignItems: 'center',
        justifyContent: 'left',
        marginBottom: '12px',
    },
    metaDataSelect: {
        width: '100%',
        height: '40px',
        padding: '10px',
        borderRadius: '4px',
        backgroundColor: theme.palette.light.main,
        border: 'none',
        '&:focus': {
            outline: 'none',
        },
    },
    appointmentContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        padding: '24px 0',
    },
    appointmentHeader: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
    },
    appointmentHeaderText: {
        fontSize: '16px',
        fontWeight: 'bold',
        marginBottom: '18px',
    },
    appointmentDatePicker: {
        width: '100%',
        marginBottom: '12px',
    },
    appointmentBody: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
    },
    appointmentBodyText: {
        fontSize: '14px',
        fontWeight: 'bold',
        marginBottom: '12px',
    },
    appointmentTimePicker: {
        width: '100%',
        padding: '10px',
        marginBottom: '12px',
    },
    appointmentFooter: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    appointmentButton: {
        width: '100%',
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.light.main,
        padding: '12px',
        borderRadius: '4px',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: theme.palette.primary.dark,
        }
    },
}

export default UserProfile;