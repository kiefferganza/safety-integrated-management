import { useState } from "react";
// @mui
import {
    Stack,
    Dialog,
    TextField,
    Typography,
    ListItemButton,
    InputAdornment,
    IconButton,
    ListItemIcon,
    Checkbox,
} from "@mui/material";
// components
import Iconify from "@/Components/iconify";
import Scrollbar from "@/Components/scrollbar";
import SearchNotFound from "@/Components/search-not-found";

const TrainingEmployeeDialog = ({
    open,
    selected,
    onClose,
    onSelect,
    personelOptions,
    trainees,
}) => {
    const [searchAddress, setSearchAddress] = useState("");

    const dataFiltered = applyFilter(personelOptions, searchAddress);

    const isNotFound = !dataFiltered.length && !!searchAddress;

    const handleSearchAddress = (event) => {
        setSearchAddress(event.target.value);
    };

    const handleSelectAddress = (employee) => {
        onSelect(employee);
        setSearchAddress("");
    };

    return (
        <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ pt: 2.5, px: 3 }}
            >
                <Typography variant="h6"> Select employee </Typography>

                {trainees.length > 0 ? (
                    <IconButton
                        sx={{ alignSelf: "flex-end" }}
                        onClick={onClose}
                    >
                        <Iconify
                            icon="material-symbols:check"
                            sx={{ color: "primary.main" }}
                        />
                    </IconButton>
                ) : (
                    <IconButton
                        sx={{ alignSelf: "flex-end" }}
                        onClick={onClose}
                    >
                        <Iconify
                            icon="material-symbols:close"
                            sx={{ color: "text.disabled" }}
                        />
                    </IconButton>
                )}
            </Stack>

            <Stack sx={{ p: 2.5 }}>
                <TextField
                    value={searchAddress}
                    onChange={handleSearchAddress}
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
            </Stack>

            {isNotFound ? (
                <SearchNotFound
                    query={searchAddress}
                    sx={{ px: 3, pt: 5, pb: 10 }}
                />
            ) : (
                <Scrollbar sx={{ p: 1.5, pt: 0, maxHeight: 80 * 8 }}>
                    {dataFiltered.map((employee) => (
                        <ListItemButton
                            key={employee.employee_id}
                            selected={selected(employee.employee_id)}
                            onClick={() => handleSelectAddress(employee)}
                            sx={{
                                p: 1.5,
                                mb: 1,
                                borderRadius: 1,
                                alignItems: "flex-start",
                                "&.Mui-selected": {
                                    bgcolor: "action.selected",
                                    "&:hover": {
                                        bgcolor: "action.selected",
                                    },
                                },
                            }}
                        >
                            <ListItemIcon>
                                <Checkbox
                                    edge="start"
                                    tabIndex={-1}
                                    disableRipple
                                    checked={!!selected(employee.employee_id)}
                                    onChange={() =>
                                        handleSelectAddress(employee)
                                    }
                                />
                            </ListItemIcon>
                            <Stack>
                                <Typography variant="subtitle2">
                                    {employee?.firstname} {employee?.lastname}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{ color: "text.secondary" }}
                                >
                                    {employee?.position}
                                </Typography>
                            </Stack>
                        </ListItemButton>
                    ))}
                </Scrollbar>
            )}
        </Dialog>
    );
};

function applyFilter(array, query) {
    if (query) {
        return array.filter(
            (employee) =>
                `${employee?.firstname} ${employee?.lastname}`
                    .toLowerCase()
                    .indexOf(query.toLowerCase()) !== -1 ||
                employee?.position
                    .toLowerCase()
                    .indexOf(query.toLowerCase()) !== -1
        );
    }

    return array;
}

export default TrainingEmployeeDialog;
