import { useState } from "react";
import { getEmployeeName } from "@/utils/formatName";
import {
    Stack,
    Dialog,
    Button,
    TextField,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
    Typography,
} from "@mui/material";
import Iconify from "@/Components/iconify";
import { useSwal } from "@/hooks/useSwal";
import { Inertia } from "@inertiajs/inertia";

const EmployeeAssignment = ({ open, onClose, employee, unassignedUsers }) => {
    const { load, stop } = useSwal();
    const [selectedUser, setSelectedUser] = useState("");
    const name = getEmployeeName(employee);

    const handleSelectChange = (e) => {
        setSelectedUser(e.target.value);
    };

    const onSave = () => {
        const user = unassignedUsers.find((user) => user.id == selectedUser);
        console.log(user);
        Inertia.post(
            `/dashboard/employee/${employee.id}/assign`,
            { user_id: selectedUser },
            {
                onStart() {
                    onClose();
                    load(`Assigning ${name} to user ${user.username}`);
                    setSelectedUser("");
                },
                onFinish() {
                    stop();
                },
            }
        );
    };

    return (
        <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
            <DialogTitle
                sx={{
                    p: (theme) => theme.spacing(3, 3, 2, 3),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                {name}
                <Button
                    size="small"
                    startIcon={<Iconify icon="eva:plus-fill" />}
                >
                    Create User
                </Button>
            </DialogTitle>

            <DialogContent dividers sx={{ pt: 1, pb: 0, border: "none" }}>
                <DialogContentText>
                    Select user below for {name}.
                    <br />{" "}
                    <Typography variant="caption">
                        Only user that has no employee are shown below.
                    </Typography>
                </DialogContentText>
                <TextField
                    select
                    fullWidth
                    SelectProps={{ native: true }}
                    label="Users"
                    placeholder="Users"
                    value={selectedUser}
                    onChange={handleSelectChange}
                    sx={{ my: 3 }}
                >
                    <option value="" />
                    {unassignedUsers?.map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.username}
                        </option>
                    ))}
                </TextField>
            </DialogContent>

            <DialogActions>
                <Stack direction="row" justifyContent="flex-end" flexGrow={1}>
                    <Button
                        variant="soft"
                        onClick={onSave}
                        disabled={!!!selectedUser}
                    >
                        Save
                    </Button>
                </Stack>
            </DialogActions>
        </Dialog>
    );
};

export default EmployeeAssignment;
