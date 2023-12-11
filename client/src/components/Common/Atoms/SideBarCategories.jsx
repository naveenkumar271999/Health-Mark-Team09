import { Box, List, ListItem } from "@mui/material";
import SideBarMenuItem from "../Atoms/SideBarMenuItem";
import { theme } from "../../../theme/muiTheme";
import { useState } from "react";
import PropTypes from 'prop-types';

const SideBarCategories = ({categories}) => {
    const [showAll, setShowAll] = useState(false);

    return (
        <Box sx={styles.sidebarCategoriesContainer}>
            <Box sx={styles.sidebarCategoriesTitleContainer}>
                <Box sx={styles.sidebarCategoriesTitleText}>Categories</Box>
            </Box>
            <List sx={styles.sidebarCategoriesListContainer}>
                {showAll && categories.map((category, index) => (
                    <ListItem key={index} sx={{ padding: 0 }}>
                        <SideBarMenuItem text={category} color={theme.palette.subtitle.main} callback={() => { }} />
                    </ListItem>
                ))}
                {!showAll && categories.slice(0, 5).map((category, index) => (
                    <ListItem key={index} sx={{ padding: 0 }}>
                        <SideBarMenuItem text={category} color={theme.palette.subtitle.main} callback={() => { }} />
                    </ListItem>
                ))}
            </List>
            {categories.length > 5 &&
                <Box sx={styles.sidebarCategoriesShowAllContainer}>
                    <Box sx={styles.sidebarCategoriesShowAllText} onClick={() => setShowAll(!showAll)}>
                        {showAll ? 'Show Less Categories' : 'Show All Categories'}
                    </Box>
                </Box>
            }
        </Box>
    );
}

PropTypes.SideBarCategories = {
    categories: PropTypes.array,
}

const styles = {
    sidebarCategoriesContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    sidebarCategoriesTitleContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: '12px',
    },
    sidebarCategoriesTitleText: {
        fontWeight: 'bold',
        color: theme.palette.title.main,
    },
    sidebarCategoriesTitleIconContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '24px',
        height: '24px',
        position: 'relative',
    },
    sidebarCategoriesTitleIcon: {
        fontSize: '18px',
        padding: '0px',
        color: theme.palette.primary.main,
        '&:hover': {
            color: theme.palette.lightgray.main,
        },
        cursor: 'pointer',
    },
    sidebarCategoriesListContainer: {
        position: 'relative',
        width: '100%',
    },
    sidebarCategoriesListItem: {
        padding: '0px',
        margin: '0px',
        border: '1px solid red',
    },
    sidebarCategoriesShowAllContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginTop: '12px',
        marginBottom: '12px',
    },
    sidebarCategoriesShowAllText: {
        color: theme.palette.primary.main,
        cursor: 'pointer',
        '&:hover': {
            color: theme.palette.lightgray.main,
        },
    },
}

export default SideBarCategories;