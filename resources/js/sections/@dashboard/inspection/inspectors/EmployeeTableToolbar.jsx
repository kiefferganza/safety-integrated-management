import PropTypes from "prop-types";
import {
    Stack,
    InputAdornment,
    TextField,
    MenuItem,
    Button,
} from "@mui/material";
// components
import Iconify from "@/Components/iconify";

// ----------------------------------------------------------------------

const INPUT_WIDTH = 240;

EmployeeTableToolbar.propTypes = {
    isFiltered: PropTypes.bool,
    filterName: PropTypes.string,
    onFilterName: PropTypes.func,
    onResetFilter: PropTypes.func,
    filterPosition: PropTypes.string,
    optionsPositions: PropTypes.arrayOf(PropTypes.object),
    onFilterPosition: PropTypes.func,
};

export default function EmployeeTableToolbar({
    isFiltered,
    filterName,
    onFilterName,
    onResetFilter,
    optionsPositions,
    filterPosition,
    onFilterPosition,
}) {
    return (
        <Stack
            spacing={2}
            alignItems="center"
            direction={{
                xs: "column",
                md: "row",
            }}
            sx={{ px: 2.5, py: 3 }}
        >
            <TextField
                fullWidth
                select
                label="Position"
                value={filterPosition}
                onChange={onFilterPosition}
                SelectProps={{
                    MenuProps: {
                        PaperProps: {
                            sx: { maxHeight: 220 },
                        },
                    },
                }}
                sx={{
                    maxWidth: { md: INPUT_WIDTH },
                    textTransform: "capitalize",
                }}
            >
                <MenuItem
                    value={"all"}
                    sx={{
                        mx: 1,
                        my: 0.5,
                        borderRadius: 0.75,
                        typography: "body2",
                        textTransform: "capitalize",
                        "&:first-of-type": { mt: 0 },
                        "&:last-of-type": { mb: 0 },
                    }}
                >
                    All
                </MenuItem>
                {optionsPositions.map((option) => (
                    <MenuItem
                        key={option.id}
                        value={option.position}
                        sx={{
                            mx: 1,
                            my: 0.5,
                            borderRadius: 0.75,
                            typography: "body2",
                            textTransform: "capitalize",
                            "&:first-of-type": { mt: 0 },
                            "&:last-of-type": { mb: 0 },
                        }}
                    >
                        {option.position}
                    </MenuItem>
                ))}
            </TextField>

            <TextField
                fullWidth
                value={filterName}
                onChange={onFilterName}
                placeholder="Search employee's name"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Iconify
                                icon="eva:search-fill"
                                sx={{ color: "text.disabled" }}
                            />
                        </InputAdornment>
                    ),
                }}
            />

            {isFiltered && (
                <Button
                    color="error"
                    sx={{ flexShrink: 0 }}
                    onClick={onResetFilter}
                    startIcon={<Iconify icon="eva:trash-2-outline" />}
                >
                    Clear
                </Button>
            )}
        </Stack>
    );
}
