import PropTypes from 'prop-types'; // Import PropTypes
import TextField from '@mui/material/TextField';
import { Typography } from '@mui/material';


const Input = ({ title, placeholder, name, type, ...rest }) => {
  return (
    <>
      <Typography sx={styles.label}>{title}</Typography>
      <TextField
        placeholder={placeholder}
        name={name}
        fullWidth
        variant="outlined"
        type={type}
        size='small'
        sx={styles.input}
        {...rest}
        inputProps={{sx: {
            padding: '10px',
            borderRadius: '8px'
        }}}
      />
    </>
  );
};

// Define propTypes for the Input component
Input.propTypes = {
  title: PropTypes.string.isRequired, // Title should be a string and is required
  placeholder: PropTypes.string.isRequired, // Placeholder should be a string and is required
  name: PropTypes.string.isRequired, // Name should be a string and is required
  type: PropTypes.string.isRequired, // Name should be a string and is required
};

const styles = {
    label:{
        width: '100%',
        textAlign: 'left',
        paddingTop: '10px',
        paddingBottom: '4px',
        fontWeight: '500',
    },
    input: {
        borderRadius: '14px',
    }
};

export default Input;
