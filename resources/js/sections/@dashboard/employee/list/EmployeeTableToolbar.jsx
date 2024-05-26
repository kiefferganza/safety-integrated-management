import PropTypes from "prop-types";
import {
    Stack,
    InputAdornment,
    TextField,
    MenuItem,
    Button,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
// components
import Iconify from "@/Components/iconify";

// ----------------------------------------------------------------------

const INPUT_WIDTH = 160;

EmployeeTableToolbar.propTypes = {
    isFiltered: PropTypes.bool,
    filterName: PropTypes.string,
    onFilterName: PropTypes.func,
    onResetFilter: PropTypes.func,
    filterDepartment: PropTypes.string,
    filterPosition: PropTypes.string,
    filterCompany: PropTypes.string,
    onFilterStartDate: PropTypes.func,
    filterStartDate: PropTypes.instanceOf(Date),
    optionsDepartments: PropTypes.arrayOf(PropTypes.string),
    optionsPositions: PropTypes.arrayOf(PropTypes.string),
    optionsCompanies: PropTypes.arrayOf(PropTypes.string),
    onFilterDepartment: PropTypes.func,
    onFilterCompany: PropTypes.func,
    onFilterPosition: PropTypes.func,
};

export default function EmployeeTableToolbar({
    isFiltered,
    filterName,
    onFilterName,
    onResetFilter,
    optionsDepartments,
    optionsPositions,
    filterStartDate,
    filterDepartment,
    filterPosition,
    onFilterStartDate,
    onFilterDepartment,
    onFilterPosition,
    onFilterCompany,
    filterCompany,
    optionsCompanies,
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
                label="Department"
                value={filterDepartment}
                onChange={onFilterDepartment}
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
                {optionsDepartments.map((option) => (
                    <MenuItem
                        key={option}
                        value={option}
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
                        {option}
                    </MenuItem>
                ))}
            </TextField>

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
                {optionsPositions.map((option) => (
                    <MenuItem
                        key={option}
                        value={option}
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
                        {option}
                    </MenuItem>
                ))}
            </TextField>

            <TextField
                fullWidth
                select
                label="Companies"
                value={filterCompany}
                onChange={onFilterCompany}
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
                {optionsCompanies.map((option) => (
                    <MenuItem
                        key={option}
                        value={option}
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
                        {option}
                    </MenuItem>
                ))}
            </TextField>

            <DatePicker
                label="Joined Date"
                value={filterStartDate}
                onChange={onFilterStartDate}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        fullWidth
                        sx={{
                            maxWidth: { md: INPUT_WIDTH },
                        }}
                    />
                )}
            />

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
