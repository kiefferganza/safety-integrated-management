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
// utils
import { fDate } from "@/utils/formatTime";
// components
import Label from "@/Components/label";

// ----------------------------------------------------------------------

TrainingTrackerTableRow.propTypes = {
    row: PropTypes.object,
    selected: PropTypes.bool,
    onSelectRow: PropTypes.func,
};

export default function TrainingTrackerTableRow({
    row,
    selected,
    onSelectRow,
}) {
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

                <TableCell align="left" sx={{ whiteSpace: "nowrap" }}>
                    {fDate(row.date_created)}
                </TableCell>

                <TableCell
                    align="left"
                    sx={{ whiteSpace: "nowrap", textTransform: "capitalize" }}
                >
                    {row.position}
                </TableCell>

                <TableCell align="left" sx={{ whiteSpace: "nowrap" }}>
                    {row.department}
                </TableCell>

                <TableCell align="left" sx={{ whiteSpace: "nowrap" }}>
                    {row.company_name ?? "N/A"}
                </TableCell>

                <TableCell align="left" sx={{ whiteSpace: "nowrap" }}>
                    {row.country || "N/A"}
                </TableCell>

                <TableCell align="left" sx={{ whiteSpace: "nowrap" }}>
                    {row.phone_no === "0" ? "N/A" : row.phone_no}
                </TableCell>

                <TableCell align="left" sx={{ whiteSpace: "nowrap" }}>
                    {row?.totalTrainings ?? 0}
                </TableCell>

                <TableCell align="left" sx={{ whiteSpace: "nowrap" }}>
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
            </TableRow>
        </>
    );
}
