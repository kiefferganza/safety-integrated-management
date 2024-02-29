import PropTypes from "prop-types";
import { Stack, InputAdornment, TextField, Button } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
// components
import Iconify from "@/Components/iconify";

// ----------------------------------------------------------------------

const INPUT_WIDTH = 160;

PositionsTableToolbar.propTypes = {
    isFiltered: PropTypes.bool,
    filterName: PropTypes.string,
    onFilterName: PropTypes.func,
    onResetFilter: PropTypes.func,
};

export default function PositionsTableToolbar({
    isFiltered,
    filterName,
    onFilterName,
    onResetFilter,
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
                value={filterName}
                onChange={onFilterName}
                placeholder="Search Position"
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
