import { Box } from '@mui/material';
import PropTypes from 'prop-types';
import { theme } from '../../../theme/muiTheme'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';


const SideBarMenuItem = ({
    text,
    Icon,
    color,
    callback,
}) => {

  return (
    <Box sx={styles.sidebarMenuItemContainer} onClick={callback}>
        <Box sx={styles.sidebarMenuItemIconContainer}>
            {Icon ? <Icon sx={{ color: color}}/> : <LocalHospitalIcon sx={{ color: color}}/>}
        </Box>
        <Box sx={[styles.sidebarMenuItemTextContainer, {color: color}]}>
            {text}
        </Box>
    </Box>
  );
}

const styles = {
    sidebarMenuItemContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        cursor: 'pointer',
        padding: '6px',
        borderRadius: '6px',
        width: '100%',
        '&:hover': {
            backgroundColor: theme.palette.light.main,
        },
    },

    sidebarMenuItemIconContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '28px',
        height: '28px',
    },
    sidebarMenuItemIcon: {
        fontSize: '24px',
        padding: '0px',
    },
    sidebarMenuItemTextContainer: {
        width: '100%',
        padding: '4px',
        paddingLeft: '12px',
    },
}

SideBarMenuItem.defaultProps = {
    text: 'SideBarMenuItem',
    Icon: null,
    color: theme.palette.title.main,
    callback: () => {},
}

SideBarMenuItem.propTypes = {
    text: PropTypes.string || null,
    Icon: PropTypes.object || null,
    color: PropTypes.string || null,
    callback: PropTypes.func || null,
}

export default SideBarMenuItem