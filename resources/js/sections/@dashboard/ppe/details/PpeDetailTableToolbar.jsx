import PropTypes from "prop-types";
// @mui
import {
    Stack,
    Button,
    TextField,
    InputAdornment,
    Select,
    FormControl,
    InputLabel,
    MenuItem,
    OutlinedInput,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
// components
import Iconify from "@/Components/iconify";

// ----------------------------------------------------------------------

PpeDetailTableToolbar.propTypes = {
    isFiltered: PropTypes.bool,
    onResetFilter: PropTypes.func,
    filterStartDate: PropTypes.instanceOf(Date),
    filterEndDate: PropTypes.instanceOf(Date),
    onFilterStartDate: PropTypes.func,
    onFilterEndDate: PropTypes.func,
    filterType: PropTypes.string,
    onFilterType: PropTypes.func,
};

const INPUT_WIDTH = 160;

const STATUS_OPTION = [
    { value: "all", label: "All" },
    { value: "inbound", label: "Restocked" },
    { value: "outbound", label: "Pulled Out" },
];

export function PpeDetailTableToolbar({
    isFiltered,
    onResetFilter,
    filterType,
    onFilterType,
    filterStartDate,
    onFilterStartDate,
    filterEndDate,
    onFilterEndDate,
}) {
    return (
        <Stack
            spacing={2}
            alignItems="center"
            direction={{
                xs: "column",
                md: "row",
            }}
            sx={{ px: 2.5, py: 1 }}
        >
            <FormControl
                sx={{
                    width: { xs: 1, md: INPUT_WIDTH },
                }}
                size="small"
            >
                <InputLabel sx={{ "&.Mui-focused": { color: "text.primary" } }}>
                    Type
                </InputLabel>
                <Select
                    value={filterType}
                    onChange={onFilterType}
                    input={<OutlinedInput label="Type" />}
                >
                    {STATUS_OPTION.map((option) => (
                        <MenuItem
                            key={option.value}
                            value={option.value}
                            sx={{
                                p: 0,
                                mx: 1,
                                my: 0.5,
                                borderRadius: 0.75,
                                typography: "subtitle2",
                                textTransform: "capitalize",
                                "&:first-of-type": { mt: 0 },
                                "&:last-of-type": { mb: 0 },
                            }}
                        >
                            {option.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            {/* <Select
				size="small"
				fullWidth
				sx={{
					maxWidth: { md: INPUT_WIDTH },
				}}
				value={filterType}
				onChange={onFilterType}
			>
				<option value="all">All</option>
				<option value="inbound">Inbound</option>
				<option value="outbound">Outbound</option>
			</Select> */}
            <DatePicker
                label="Start date"
                value={filterStartDate}
                onChange={onFilterStartDate}
                inputFormat="dd MMM yyyy"
                openTo="year"
                views={["year", "month", "day"]}
                disableMaskedInput
                renderInput={(params) => (
                    <TextField
                        {...params}
                        fullWidth
                        size="small"
                        sx={{
                            maxWidth: { md: INPUT_WIDTH },
                        }}
                    />
                )}
            />

            <DatePicker
                label="End date"
                value={filterEndDate}
                onChange={onFilterEndDate}
                inputFormat="dd MMM yyyy"
                openTo="year"
                views={["year", "month", "day"]}
                disableMaskedInput
                minDate={filterStartDate || new Date()}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        fullWidth
                        size="small"
                        sx={{
                            maxWidth: { md: INPUT_WIDTH },
                        }}
                    />
                )}
            />

            {isFiltered && (
                <Button
                    color="error"
                    sx={{ flexShrink: 0, marginLeft: "auto !important" }}
                    onClick={onResetFilter}
                    startIcon={<Iconify icon="eva:trash-2-outline" />}
                >
                    Clear
                </Button>
            )}
        </Stack>
    );
}
