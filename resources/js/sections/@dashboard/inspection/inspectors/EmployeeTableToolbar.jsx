import { useRef } from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import { DatePicker } from "@mui/x-date-pickers";
// components
import Iconify from "@/Components/iconify";

// ----------------------------------------------------------------------

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 300,
        },
    },
};

EmployeeTableToolbar.propTypes = {
    isFiltered: PropTypes.bool,
    filterName: PropTypes.string,
    onFilterName: PropTypes.func,
    onResetFilter: PropTypes.func,
    filterPosition: PropTypes.arrayOf(PropTypes.string),
    optionsPositions: PropTypes.arrayOf(PropTypes.string),
    filterDepartment: PropTypes.string,
    onFilterDepartment: PropTypes.func,
    optionsDepartment: PropTypes.arrayOf(PropTypes.string),
    onFilterPosition: PropTypes.func,
    onFilterStartDate: PropTypes.func,
    onFilterEndDate: PropTypes.func,
};

export default function EmployeeTableToolbar({
    isFiltered,
    filterName,
    onFilterName,
    onResetFilter,
    optionsPositions,
    filterPosition,
    onFilterPosition,
    filterDepartment,
    onFilterDepartment,
    optionsDepartment,
    filterStartDate,
    filterEndDate,
    onFilterStartDate,
    onFilterEndDate,
}) {
    const endDateRef = useRef(null);

    const handleEndDateChange = (date) => {
        endDateRef.current = date;
    };

    const onCloseEndDate = () => {
        if (filterStartDate) {
            onFilterEndDate(endDateRef.current);
        }
    };

    return (
        <Stack spacing={1.5} sx={{ px: 2, py: 3 }}>
            <Stack
                spacing={1.5}
                alignItems="center"
                direction={{
                    xs: "column",
                    md: "row",
                }}
            >
                <DatePicker
                    label="Start Date"
                    value={filterStartDate}
                    onChange={onFilterStartDate}
                    openTo="month"
                    disableFuture
                    views={["year", "month", "day"]}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            fullWidth
                            sx={{
                                width: "100%",
                            }}
                            onChange={(event) => event.stopPropagation()}
                        />
                    )}
                />
                <DatePicker
                    label="End Date"
                    value={filterEndDate}
                    onChange={handleEndDateChange}
                    onClose={onCloseEndDate}
                    openTo="month"
                    disableFuture
                    views={["year", "month", "day"]}
                    minDate={filterStartDate}
                    disabled={filterStartDate === null}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            fullWidth
                            sx={{
                                width: "100%",
                            }}
                            onChange={(event) => event.stopPropagation()}
                        />
                    )}
                />
                <FormControl sx={{ m: 1, width: "100%" }}>
                    <InputLabel id="multiple-checkbox-position">
                        Position
                    </InputLabel>
                    <Select
                        labelId="multiple-checkbox-position"
                        id="multiple-checkbox"
                        multiple
                        value={filterPosition}
                        onChange={onFilterPosition}
                        input={<OutlinedInput label="Position" />}
                        renderValue={(selected) => selected.join(", ")}
                        sx={{ width: "100%" }}
                        MenuProps={MenuProps}
                    >
                        {optionsPositions.map((name) => (
                            <MenuItem key={name} value={name}>
                                <Checkbox
                                    checked={filterPosition.indexOf(name) > -1}
                                />
                                <ListItemText primary={name} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

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
                        width: "100%",
                        textTransform: "capitalize",
                    }}
                >
                    {optionsDepartment.map((option) => (
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
            </Stack>
            <Stack
                spacing={1.5}
                alignItems="center"
                direction={{
                    xs: "column",
                    md: "row",
                }}
            >
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
        </Stack>
    );
}
