import PropTypes from "prop-types";
const {
    Stack,
    InputAdornment,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    OutlinedInput,
    MenuItem,
    Checkbox,
    ListItemText,
} = await import("@mui/material");
import { DatePicker } from "@mui/x-date-pickers";
// components
import Iconify from "@/Components/iconify";

// ----------------------------------------------------------------------

const INPUT_WIDTH = 170;
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 140,
        },
    },
};

const types = [
    "All",
    "Civil",
    "Electrical",
    "Mechanical",
    "Workshop",
    "Office",
];

PreplanningRegisterToolbar.propTypes = {
    isFiltered: PropTypes.bool,
    filterName: PropTypes.string,
    filterType: PropTypes.array,
    onFilterName: PropTypes.func,
    onFilterType: PropTypes.func,
    onResetFilter: PropTypes.func,
    onFilterStartDate: PropTypes.func,
    onFilterEndDate: PropTypes.func,
    filterStartDate: PropTypes.instanceOf(Date),
    filterEndDate: PropTypes.instanceOf(Date),
    selectType: PropTypes.bool,
};

export function PreplanningRegisterToolbar({
    isFiltered,
    filterName,
    onFilterName,
    onResetFilter,
    filterStartDate,
    filterEndDate,
    onFilterStartDate,
    onFilterEndDate,
    filterType = [],
    onFilterType,
    selectType,
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
                openTo="year"
                views={["year", "month", "day"]}
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
                openTo="year"
                views={["year", "month", "day"]}
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

            {selectType && (
                <FormControl sx={{ width: 1, maxWidth: 140 }}>
                    <InputLabel id="tbt-type-label">TBT Type</InputLabel>
                    <Select
                        labelId="tbt-type-label"
                        id="tbt-type"
                        multiple
                        value={filterType}
                        onChange={onFilterType}
                        input={<OutlinedInput label="TBT Type" />}
                        renderValue={(selected) => selected.join(", ")}
                        MenuProps={MenuProps}
                        fullWidth
                    >
                        {types.map((name) => (
                            <MenuItem sx={{ px: 0 }} key={name} value={name}>
                                <Checkbox
                                    checked={filterType?.indexOf(name) > -1}
                                />
                                <ListItemText primary={name} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}

            <TextField
                fullWidth
                value={filterName}
                onChange={onFilterName}
                placeholder="Search toolboxtalks"
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
