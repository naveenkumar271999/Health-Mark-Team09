import dayjs from 'dayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import PropTypes from 'prop-types';


export default function Calendar({ task, setTask }) {
    const handleCalendarChange = (newValue) => {    
        setTask({...task, _create: newValue});
    };

    return (    
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker 
            defaultValue={dayjs()}
            format='ddd, MMMM D, YYYY'
            onChange={handleCalendarChange}
            sx={styles.datePicker}
            minDate={dayjs()}
            maxDate={dayjs().add(1, 'year')}
          />
         </LocalizationProvider>
    );
}

Calendar.propTypes = {
    task: PropTypes.object.isRequired,
    setTask: PropTypes.func.isRequired,
};


const styles = {
    datePicker: {    
        '& .MuiInputBase-root': {
            padding: '0px',
            border: 'none',
            margin: '0px',
        },
        '& .MuiInputBase-input': {
            fontSize: '14px',
        },
        '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',
        },
        '& .MuiInputBase-inputAdornedEnd': {
            padding: '0px',
        },
    }
}