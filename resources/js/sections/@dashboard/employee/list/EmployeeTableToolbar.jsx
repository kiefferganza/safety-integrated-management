import PropTypes from "prop-types";
import {
    Stack,
    InputAdornment,
    TextField,
    MenuItem,
    Button,
    FormControl,
    InputLabel,
    Select,
    OutlinedInput,
    Checkbox,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
// components
import Iconify from "@/Components/iconify";
import { sentenceCase } from "change-case";

// ----------------------------------------------------------------------

EmployeeTableToolbar.propTypes = {
    isFiltered: PropTypes.bool,
    filterName: PropTypes.string,
    onFilterName: PropTypes.func,
    onResetFilter: PropTypes.func,
    filterDepartment: PropTypes.array,
    filterPosition: PropTypes.array,
    filterCompany: PropTypes.array,
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
            direction={{
                xs: "column",
                md: "row",
            }}
            width={1}
        >
            <Stack
                spacing={2}
                alignItems="center"
                sx={{ px: 2.5, py: 3 }}
                width={1}
            >
                <Stack
                    spacing={2}
                    alignItems="center"
                    direction={{
                        xs: "column",
                        md: "row",
                    }}
                    width={1}
                >
                    <MultiDropdown
                        label="Department"
                        options={optionsDepartments}
                        value={filterDepartment}
                        onChange={onFilterDepartment}
                    />

                    <MultiDropdown
                        label="Position"
                        options={optionsPositions}
                        value={filterPosition}
                        onChange={onFilterPosition}
                    />

                    <MultiDropdown
                        label="Companies"
                        options={optionsCompanies}
                        value={filterCompany}
                        onChange={onFilterCompany}
                    />

                    <DatePicker
                        label="Joined Date"
                        value={filterStartDate}
                        onChange={onFilterStartDate}
                        renderInput={(params) => (
                            <TextField {...params} fullWidth />
                        )}
                    />
                </Stack>

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
            </Stack>
            <Stack alignItems="center" justifyContent="center">
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
        </Stack>
    );
}

function MultiDropdown({ label = "", options = [], value = "", onChange }) {
    return (
        <FormControl fullWidth>
            <InputLabel sx={{ "&.Mui-focused": { color: "text.primary" } }}>
                {label}
            </InputLabel>
            <Select
                multiple
                value={value}
                onChange={onChange}
                input={<OutlinedInput label={label} />}
                renderValue={(selected) =>
                    selected.map((value) => sentenceCase(value)).join(", ")
                }
            >
                {options.map((option) => (
                    <MenuItem
                        key={option}
                        value={option}
                        sx={{
                            p: 0,
                            mx: 1,
                            my: 0.5,
                            borderRadius: 0.75,
                            typography: "body2",
                            textTransform: "capitalize",
                            "&:first-of-type": { mt: 0 },
                            "&:last-of-type": { mb: 0 },
                        }}
                    >
                        <Checkbox
                            disableRipple
                            size="small"
                            checked={value.includes(option)}
                        />
                        {option}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}
