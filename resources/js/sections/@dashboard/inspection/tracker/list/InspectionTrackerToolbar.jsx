import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import { DatePicker } from "@mui/x-date-pickers";
// components
import Iconify from "@/Components/iconify";

// ----------------------------------------------------------------------

const INPUT_WIDTH = 170;

InspectionTrackerToolbar.propTypes = {
    isFiltered: PropTypes.bool,
    filterName: PropTypes.string,
    onFilterName: PropTypes.func,
    onResetFilter: PropTypes.func,
    onFilterStartDate: PropTypes.func,
    onFilterEndDate: PropTypes.func,
    filterStartDate: PropTypes.number,
    filterEndDate: PropTypes.number,
};

export function InspectionTrackerToolbar({
    isFiltered,
    filterName,
    onFilterName,
    onResetFilter,
    filterStartDate,
    filterEndDate,
    onFilterStartDate,
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
            sx={{ px: 2, py: 1 }}
        >
            <DatePicker
                label="Start date"
                value={filterStartDate}
                onChange={onFilterStartDate}
                inputFormat="dd MMM yyyy"
                disableMaskedInput
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

            <DatePicker
                label="End date"
                value={filterEndDate}
                onChange={onFilterEndDate}
                inputFormat="dd MMM yyyy"
                disableMaskedInput
                minDate={filterStartDate || new Date()}
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
                placeholder="Search..."
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
