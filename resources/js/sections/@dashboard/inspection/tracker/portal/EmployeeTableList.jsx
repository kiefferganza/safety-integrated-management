import Iconify from "@/Components/iconify";
import Scrollbar from "@/Components/scrollbar";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { forwardRef } from "react";

// ----------------------------------------------------------------------

const EmployeeTableList = forwardRef(
    ({ list = [], onRemove, onUpdate }, ref) => {
        return (
            <TableContainer component={Paper}>
                <Scrollbar
                    sx={{ maxHeight: 281 }}
                    forceVisible="y"
                    autoHide={false}
                    ref={ref}
                >
                    <Table stickyHeader size="small" sx={{ px: 1.25 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Condcuted By</TableCell>
                                <TableCell>Position</TableCell>
                                <TableCell>Location</TableCell>
                                <TableCell>Reviewer</TableCell>
                                <TableCell>Verifier</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {list.map((row, index) => (
                                <TableRow
                                    key={row.id}
                                    hover
                                    sx={{
                                        "& td, & th": {
                                            borderBottom: 1,
                                        },
                                    }}
                                >
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>
                                        <Stack
                                            direction="row"
                                            alignItems="center"
                                            spacing={1}
                                        >
                                            <Avatar
                                                alt={row.fullname}
                                                src={row.img}
                                                sx={{
                                                    width: 32,
                                                    height: 32,
                                                }}
                                            />

                                            <Typography
                                                variant="subtitle2"
                                                noWrap
                                                sx={{
                                                    marginLeft: 1,
                                                }}
                                            >
                                                {row.fullname}
                                            </Typography>
                                        </Stack>
                                    </TableCell>
                                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                                        {row.position}
                                    </TableCell>
                                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                                        {row.location}
                                    </TableCell>
                                    <TableCell>
                                        {row?.reviewer?.fullname && (
                                            <Stack
                                                direction="row"
                                                alignItems="center"
                                                spacing={1}
                                            >
                                                <Avatar
                                                    alt={row.reviewer.fullname}
                                                    src={row.reviewer.img}
                                                    sx={{
                                                        width: 32,
                                                        height: 32,
                                                    }}
                                                />

                                                <Typography
                                                    variant="subtitle2"
                                                    noWrap
                                                    sx={{
                                                        marginLeft: 1,
                                                    }}
                                                >
                                                    {row.reviewer.fullname}
                                                </Typography>
                                            </Stack>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {row?.verifier?.fullname && (
                                            <Stack
                                                direction="row"
                                                alignItems="center"
                                                spacing={1}
                                            >
                                                <Avatar
                                                    alt={row.verifier.fullname}
                                                    src={row.verifier.img}
                                                    sx={{
                                                        width: 32,
                                                        height: 32,
                                                    }}
                                                />

                                                <Typography
                                                    variant="subtitle2"
                                                    noWrap
                                                    sx={{
                                                        marginLeft: 1,
                                                    }}
                                                >
                                                    {row.verifier.fullname}
                                                </Typography>
                                            </Stack>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Stack direction="row">
                                            <Tooltip title="Edit">
                                                <IconButton
                                                    size="small"
                                                    color="info"
                                                    onClick={onUpdate(index)}
                                                >
                                                    <Iconify icon="eva:edit-fill" />
                                                </IconButton>
                                            </Tooltip>

                                            <Tooltip title="Remove">
                                                <IconButton
                                                    onClick={onRemove(index)}
                                                    color="error"
                                                    size="small"
                                                >
                                                    <Iconify icon="eva:trash-2-outline" />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {!list.length && (
                                <TableRow>
                                    <TableCell colSpan={12} sx={{ p: 0 }}>
                                        <Typography
                                            variant="subtitle1"
                                            gutterBottom
                                            sx={{
                                                color: "text.disabled",
                                            }}
                                            align="center"
                                            pt={1}
                                        >
                                            Add an employee.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Scrollbar>
            </TableContainer>
        );
    }
);

EmployeeTableList.propTypes = {
    list: PropTypes.array,
    onRemove: PropTypes.func,
    onUpdate: PropTypes.func,
};

export default EmployeeTableList;
