import PropTypes from "prop-types";
// @mui
import {
    // Link,
    Stack,
    Checkbox,
    TableRow,
    TableCell,
    Typography,
    Avatar,
} from "@mui/material";
// components
import Label from "@/Components/label";

// ----------------------------------------------------------------------

EmployeeTableRow.propTypes = {
    row: PropTypes.object,
    selected: PropTypes.bool,
    onSelectRow: PropTypes.func,
};

export default function EmployeeTableRow({ row, selected, onSelectRow }) {
    if (row.id === 348 || row.id === 710) {
        console.log(row);
    }
    return (
        <>
            <TableRow hover selected={selected}>
                <TableCell padding="checkbox">
                    <Checkbox checked={selected} onClick={onSelectRow} />
                </TableCell>

                <TableCell>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar
                            alt={row.fullname}
                            src={
                                row?.profile?.thumbnail ||
                                route("image", {
                                    path: "assets/images/default-profile.jpg",
                                    w: 128,
                                    h: 128,
                                    fit: "crop",
                                })
                            }
                        />

                        <Typography variant="subtitle2" noWrap>
                            {row.fullname}
                        </Typography>
                    </Stack>
                </TableCell>

                <TableCell align="left">{row.position}</TableCell>

                <TableCell align="left">{row.department}</TableCell>

                <TableCell align="left">{row.country || "N/A"}</TableCell>

                <TableCell align="left">{row.phone_no}</TableCell>

                <TableCell align="left">
                    <Label
                        variant="soft"
                        color={
                            (row.status === "active" && "success") ||
                            (row.status === "inactive" && "warning") ||
                            "default"
                        }
                    >
                        {row.status}
                    </Label>
                </TableCell>

                <TableCell align="left">
                    {row?.inspections_count || 0}
                </TableCell>
            </TableRow>
        </>
    );
}
