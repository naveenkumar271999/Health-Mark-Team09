import { Box, Grid, TextField, Typography } from "@mui/material";
import { theme } from "../../../theme/muiTheme";
import Fire from '@mui/icons-material/Whatshot';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import AppointmentCard from "../Molecules/AppointmentCard";
import { getUsers } from "../../../../context/slices/userSlice";
import MoonLoader from "react-spinners/MoonLoader";
import { PieChart, Pie, Tooltip, Sector, ResponsiveContainer, Legend } from 'recharts';

const filterUsers = (users, searchText) => {
    return users.filter((user) => {
        const fullName = `${user.firstName} ${user.lastName}`;
        return fullName.toLowerCase().includes(searchText.toLowerCase())
            || user.bio.toLowerCase().includes(searchText.toLowerCase());
    });
}

const useFetchUsers = () => {
    const dispatch = useDispatch();
    // eslint-disable-next-line no-unused-vars
    const [usersLoading, setUsersLoading] = useState(true);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        dispatch(getUsers())
            .then((res) => {
                setUsers(res.payload.users);
            })
    }
        , [dispatch]);

    return { users, usersLoading };
}

/**
{
  "_id": {
    "$oid": "6531dfe81b949294a1a568bc"
  },
  "firstName": "Dr.",
  "lastName": "Ans",
  "email": "admin@gmail.com",
  "password": "$2b$10$Ff59PQBioFxUTYvVuB7IvO8ph8mJgMSWprydAhrqtr1Ddh3YXpOmm",
  "isEmailVerified": true,
  "role": "doctor",
  "bio": "lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
  "appointments": [
    {
      "patient": {
        "$oid": "6531dfe81b949294a1a568bc"
      },
      "date": {
        "$date": "2023-10-20T07:28:24.344Z"
      }
    }
  ],
  "__v": 1,
  "createdAt": {
    "$date": "2023-10-20T02:03:20.831Z"
  },
  "updatedAt": {
    "$date": "2023-10-20T07:28:24.336Z"
  }
}
 */
const filterUsersWithAppointments = (doctorID, users) => {
    const usersWithAppointments = [];

    users.forEach((user) => {
        user.appointments.forEach((appointment) => {
            if (appointment.doctor === doctorID) {
                usersWithAppointments.push({
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    appointmentDate: appointment.date,
                });
            }
        });
    });

    return usersWithAppointments;
}


const DoctorBody = () => {
    useFetchUsers();
    const loading = useSelector((state) => state.users.loading);
    const usersFromStore = useSelector(state => state.users.users);
    const [usersWithAppointments, setUsersWithAppointments] = useState([]);

    const [users, setUsers] = useState([]);
    const doctor = useSelector((state) => state.auth.user);
    const [selectedView, setSelectedView] = useState('Overview');

    useEffect(() => {
        setUsersWithAppointments(filterUsersWithAppointments(doctor._id, usersFromStore));
    }, [usersFromStore, doctor]);

    const [searchText, setSearchText] = useState('');

    const handleSearch = (e) => {
        setSearchText(e.target.value);
        if (e.target.value.length > 0) {
            selectedView === 'Appointments' && setUsers(filterUsers(users, e.target.value));
        } else {
            selectedView === 'Appointments' && setUsers(filterUsersWithAppointments(doctor._id, usersFromStore));
        }
    }

    return (
        <Grid item xs={10} sx={styles.bodyContainer}>
            <Box sx={styles.topBar}>
                <Typography sx={styles.date}>
                    {`Welcome, Dr. ${doctor.lastName}`}
                </Typography>
                <Box sx={styles.searchBarContainer}>
                    <TextField
                        placeholder={'Search for appointments'}
                        name={name}
                        fullWidth
                        variant="standard"
                        type={'text'}
                        size='small'
                        sx={styles.input}
                        inputProps={{
                            sx: {
                                padding: '10px',
                                borderRadius: '20px',
                                outline: 'none',
                            }
                        }}
                        value={searchText}
                        onChange={handleSearch}
                    />
                </Box>
            </Box>

            <Box sx={styles.selectedViewContainer}>
                <Box sx={styles.selectedView}>
                    <Typography sx={selectedView === 'Overview' ? { ...styles.view, ...styles.selectedViewText } : styles.view} onClick={() => setSelectedView('Overview')}>
                        Overview
                    </Typography>
                    <Typography sx={selectedView === 'Appointments' ? { ...styles.view, ...styles.selectedViewText } : styles.view} onClick={() => setSelectedView('Appointments')}>
                        Appointments
                    </Typography>
                </Box>
            </Box>


            <Box sx={styles.bodyContentContainer}>
                {loading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', marginTop: '20px' }}>
                        <MoonLoader color={theme.palette.primary.main} size={24} />
                    </Box>
                ) :
                    (<Box sx={styles.bodyContent}>
                        {
                            selectedView === 'Overview' &&
                            <Overview usersWithAppointments={usersWithAppointments} />
                        }
                        {
                            selectedView === 'Appointments' &&
                            <ReusableContent title={'Appointments'} data={usersWithAppointments} CardComponent={AppointmentCard} />
                        }
                    </Box>
                    )}
            </Box>

        </Grid>
    )
};


const ReusableContent = ({ title, data, CardComponent }) => {
    return (
        <>
            <Box sx={styles.titleContainer}>
                {/* <Fire sx={{ fontSize: '24px', color: theme.palette.primary.main, marginRight: '10px' }} /> */}
                <Typography sx={styles.title}>
                    {title}
                </Typography>
            </Box>
            <Box sx={styles.bodyContentCardsContainer}>
                {
                    data?.length > 0 && data.map((item) => (
                        <CardComponent item={item} key={item._id} />
                    ))
                }
                {data?.length === 0 && (
                    <Box sx={styles.taglineContainer}>
                        <Typography sx={styles.tagline}>
                            {`No ${title.toLowerCase()} found`}
                        </Typography>
                    </Box>
                )}
            </Box>
        </>
    );
};

ReusableContent.propTypes = {
    title: PropTypes.string.isRequired,
    data: PropTypes.array.isRequired,
    CardComponent: PropTypes.elementType.isRequired,
    setData: PropTypes.func.isRequired,
}

const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
        <g>
            <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
                {payload.name}
            </text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 6}
                outerRadius={outerRadius + 10}
                fill={fill}
            />  
            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${value} ${payload.name}`}</text>
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                {`(${(percent * 100).toFixed(2)}%)`}
            </text>
        </g>
    );
};

const Overview = ({ usersWithAppointments }) => {
    const uniquePatients = [];
    usersWithAppointments.forEach((user) => {
        if (!uniquePatients.includes(user.id)) {
            uniquePatients.push(user.id);
        }
    });

    const appointmentsData = [
        { name: 'Patients', value: uniquePatients.length, fill: '#af0337' },
        { name: 'Appointments', value: usersWithAppointments.length, fill: '#fb1d61' },
    ];

    const [usersActiveIndex, setUsersActiveIndex] = useState(0);

    return (
        <>
            <Box sx={styles.titleContainer}>
                {/* <Fire sx={{ fontSize: '24px', color: theme.palette.primary.main, marginRight: '10px' }} /> */}
                <Typography sx={styles.title}>
                    {'Overview'}
                </Typography>
            </Box>
            <Box sx={styles.bodyContentCardsContainer}>
            <Typography sx={styles.chartHead}>
                    {'Appointments Overview'}
                </Typography>
                <ResponsiveContainer width="100%" height={300} style={{marginBottom: '20px'}}>
                    <PieChart width={400} height={400}>
                        <Pie
                            activeIndex={usersActiveIndex}
                            activeShape={renderActiveShape}
                            data={appointmentsData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            onMouseEnter={(data, index) => setUsersActiveIndex(index)}
                        />
                        <Legend />
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </Box>
        </>
    );
};

Overview.propTypes = {
    usersWithAppointments: PropTypes.array.isRequired,
}

const styles = {
    bodyContainer: {
        marginLeft: '16.66%',
        height: '100vh',
        maxHeight: '100vh',
    },
    topBar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft: '20px',
        marginRight: '20px',
        height: '70px',
        borderBottom: '1px solid #E0E0E0',
    },
    date: {
        fontWeight: 'bold',
    },
    searchBarContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '50%',
        height: '40px',
        borderTopRightRadius: '4px',
        borderTopLeftRadius: '4px',
        backgroundColor: '#F5F5F5',
    },
    input: {
        borderRadius: '20px',
        outline: 'none',
    },
    bodyContentContainer: {
        padding: '20px',
        display: 'flex',
    },
    bodyContent: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
    },
    bodyContentTitle: {
        fontWeight: 'bold',
    },
    selectedViewContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
    },
    selectedView: {
        backgroundColor: '#F5F5F5',
        borderRadius: '20px',
        padding: '10px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
    },
    view: {
        fontWeight: 'bold',
        fontSize: '14px',
        color: '#757575',
        '&:hover': {
            cursor: 'pointer',
            color: theme.palette.primary.main,
        },
    },
    selectedViewText: {
        color: theme.palette.primary.main,
        borderBottom: `2px solid ${theme.palette.primary.main}`,
    },
    bodyContentCardsContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
    },
    chartHead: {
        fontWeight: 'bold',
        fontSize: '12px',
        marginBottom: '10px',
        backgroundColor: '#F5F5F5',
        padding: '10px 20px',
        borderRadius: '8px',
        color: '#757575',

    },
    titleContainer: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '20px',
    },
    title: {
        fontWeight: 'bold',
        fontSize: '20px',
    },
    bodyContentCard: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'evenly',
        gap: '20px',
        padding: '20px',
        borderRadius: '8px',
        backgroundColor: '#F5F5F5',
        marginBottom: '20px',
        boxShadow: '0px 0px 4px 0px rgba(3, 3, 3, 0.1)',
        '&:hover': {
            cursor: 'pointer',
            boxShadow: '0px 0px 10px 2px rgba(3, 3, 3, 0.2)',
            backgroundColor: theme.palette.primary.light,
            color: theme.palette.primary.contrastText,
        },
        transition: 'all 0.2s ease-in-out',
    },
    bodyContentCardTitle: {
        fontWeight: 'bold',
        fontSize: '16px',
        width: '20%',
    },
    bodyContentCardDescription: {
        fontSize: '14px',
        textAlign: 'center',
        width: '20%',
    },
    bodyContentCardRole: {
        fontSize: '14px',
        textAlign: 'center',
        width: '10%',
        backgroundColor: '#E0E0E0',
        color: '#757575',
        padding: '5px 10px',
        borderRadius: '4px',
    },

    taglineContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    },
    tagline: {
        fontWeight: 'bold',
        fontSize: '16px',
    },
    viewAllContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    viewAllText: {
        fontWeight: 'bold',
        fontSize: '14px',
        color: theme.palette.primary.main,
        '&:hover': {
            cursor: 'pointer',
            color: theme.palette.primary.dark,
        },
    },
    productCard: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        borderRadius: '8px',
        backgroundColor: '#F5F5F5',
        marginBottom: '20px',
        boxShadow: '0px 0px 4px 0px rgba(3, 3, 3, 0.1)',
        '&:hover': {
            cursor: 'pointer',
            boxShadow: '0px 0px 10px 2px rgba(3, 3, 3, 0.2)',
            backgroundColor: theme.palette.primary.light,
            color: theme.palette.primary.contrastText,
        },
        transition: 'all 0.2s ease-in-out',
        padding: '10px 20px',
    },
    productCardTitle: {
        fontWeight: 'bold',
        fontSize: '16px',
        marginTop: '10px',
        marginBottom: '10px',
        align: 'left',
        width: '20%',
    },
    productCardDescription: {
        fontSize: '14px',
        align: 'left',
        width: '20%',
    },
    productCardFooter: {
        display: 'flex',
        alignItems: 'center',
        gap: '6%',
        marginTop: 'auto',
        width: '30%',
        height: '50px',
    },
    productCardFooterPrice: {
        fontWeight: 'bold',
        fontSize: '16px',
        color: theme.palette.primary.contrastText,
        backgroundColor: theme.palette.primary.main,
        padding: '5px 10px',
        borderRadius: '4px',
    },
    productCardFooterUnits: {
        fontSize: '14px',
        backgroundColor: '#E0E0E0',
        color: '#757575',
        padding: '5px 10px',
        borderRadius: '4px',
    },
    actionButtonsContainer: {
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: '10px',
    },
}

export default DoctorBody;