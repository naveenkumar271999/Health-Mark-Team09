import {Box, InputBase } from '@mui/material';
import Search from '@mui/icons-material/Search';
import { theme } from '../../../theme/muiTheme';

const SearchBox = () => {
  return (
    <Box sx={styles.searchBox}>
        <Box sx={styles.searchIcon}>
            <Search sx={styles.searchIcon} color='lightgray'/>
        </Box>
        <InputBase
            sx={styles.searchInput}
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
        />
    </Box>
  )
}

const styles = {
    searchBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '44px',
        backgroundColor: '#fff',
        borderRadius: '6px',
        marginTop: '8px',
        marginBottom: '8px',
        border: `1px solid ${theme.palette.lightgray.main}`,
    },
    searchIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '42px',
        height: '42px',
        borderRadius: '50%',
        padding: '10px',
    },
    searchInput: {
        width: '100%',
        paddingTop: '12px',
        paddingBottom: '12px',
        paddingRight: '12px',
        marginTop: '4px',
        marginBottom: '4px',
        fontSize: '14px',
    },
}

export default SearchBox;