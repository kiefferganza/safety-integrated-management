// Components
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

const TableBox = styled(Card)(({ theme }) => ({
    borderRadius: 0,
    border: "1px solid",
    borderColor: theme.palette.primary.main,
    fontSize: ".7rem",
    overflow: "visible",
    flex: 1,
    maxWidth: 300,
}));

const TableBoxHeader = styled(Box)(({ theme }) => ({
    background: theme.palette.primary.main,
    color: "#fff",
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    textAlign: "center",
    borderBottom: "1px solid",
    borderColor: "inherit",
    width: "100%",
    whiteSpace: "nowrap",
}));

const TableBoxRow = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    borderColor: "inherit",
    "&>div": {
        borderRight: "1px solid",
        borderColor: "inherit",
        width: "100%",
        "&:last-child": {
            borderRight: 0,
        },
        "&>div": {
            "&:first-of-type": {
                borderBottom: "1px solid",
                borderColor: "inherit",
            },
            "&:last-child": {
                textAlign: "right",
            },
            textAlign: "center",
            paddingTop: theme.spacing(0.5),
            paddingBottom: theme.spacing(0.5),
            paddingLeft: theme.spacing(1),
            paddingRight: theme.spacing(1),
            width: "100%",
            borderColor: "inherit",
            "&>p": {
                fontSize: "inherit",
                whiteSpace: "nowrap",
            },
        },
    },
}));

export default function HseTables({ data }) {
    return (
        <Stack direction="row" gap={0.5} flexWrap="wrap">
            <TableBox>
                <TableBoxHeader>Manhours Worked</TableBoxHeader>
                <TableBoxRow>
                    <Stack>
                        <Box>
                            <Typography>This Month</Typography>
                        </Box>
                        <Box>
                            <Typography>
                                {data?.manhours_worked?.this_month || "0"}
                            </Typography>
                        </Box>
                    </Stack>
                    <Stack>
                        <Box>
                            <Typography>PTD</Typography>
                        </Box>
                        <Box>
                            <Typography>
                                {data?.manhours_worked?.PTD || "-"}
                            </Typography>
                        </Box>
                    </Stack>
                    <Stack>
                        <Box>
                            <Typography>YTD Safe Manhours</Typography>
                        </Box>
                        <Box>
                            <Typography>
                                {data?.manhours_worked?.safe_manhours || "-"}
                            </Typography>
                        </Box>
                    </Stack>
                </TableBoxRow>
            </TableBox>
            <TableBox>
                <TableBoxHeader>Man Power</TableBoxHeader>
                <TableBoxRow>
                    <Stack>
                        <Box>
                            <Typography>Ave/Day</Typography>
                        </Box>
                        <Box>
                            <Typography>
                                {data?.man_power?.ave_day || "-"}
                            </Typography>
                        </Box>
                    </Stack>
                    <Stack>
                        <Box>
                            <Typography>This Month</Typography>
                        </Box>
                        <Box>
                            <Typography>
                                {data?.man_power?.this_month || "0"}
                            </Typography>
                        </Box>
                    </Stack>
                    <Stack>
                        <Box>
                            <Typography>PTD</Typography>
                        </Box>
                        <Box>
                            <Typography>
                                {data?.man_power?.PTD || "-"}
                            </Typography>
                        </Box>
                    </Stack>
                </TableBoxRow>
            </TableBox>
            <TableBox>
                <TableBoxHeader>Man Days of the Month</TableBoxHeader>
                <TableBoxRow>
                    <Stack>
                        <Box>
                            <Typography>Acident Free</Typography>
                        </Box>
                        <Box>
                            <Typography>-</Typography>
                        </Box>
                    </Stack>
                    <Stack>
                        <Box>
                            <Typography>PTD</Typography>
                        </Box>
                        <Box>
                            <Typography>-</Typography>
                        </Box>
                    </Stack>
                </TableBoxRow>
            </TableBox>
            <TableBox>
                <TableBoxHeader>Audits</TableBoxHeader>
                <TableBoxRow>
                    <Stack>
                        <Box>
                            <Typography>Internal</Typography>
                        </Box>
                        <Box>
                            <Typography>-</Typography>
                        </Box>
                    </Stack>
                    <Stack>
                        <Box>
                            <Typography>ROO Dept.</Typography>
                        </Box>
                        <Box>
                            <Typography>-</Typography>
                        </Box>
                    </Stack>
                </TableBoxRow>
            </TableBox>
            <TableBox>
                <TableBoxHeader>EMERG. Drills</TableBoxHeader>
                <TableBoxRow>
                    <Stack>
                        <Box>
                            <Typography>Internal</Typography>
                        </Box>
                        <Box>
                            <Typography>-</Typography>
                        </Box>
                    </Stack>
                    <Stack>
                        <Box>
                            <Typography>External</Typography>
                        </Box>
                        <Box>
                            <Typography>-</Typography>
                        </Box>
                    </Stack>
                </TableBoxRow>
            </TableBox>
            <TableBox>
                <TableBoxHeader>HSE Inspection</TableBoxHeader>
                <TableBoxRow>
                    <Stack>
                        <Box>
                            <Typography>This Month</Typography>
                        </Box>
                        <Box>
                            <Typography>
                                {data?.hse_inspection?.this_month || "0"}
                            </Typography>
                        </Box>
                    </Stack>
                    <Stack>
                        <Box>
                            <Typography>PTD</Typography>
                        </Box>
                        <Box>
                            <Typography>
                                {data?.hse_inspection?.PTD || "-"}
                            </Typography>
                        </Box>
                    </Stack>
                </TableBoxRow>
            </TableBox>
            <TableBox>
                <TableBoxHeader>Negative Obs.</TableBoxHeader>
                <TableBoxRow>
                    <Stack>
                        <Box>
                            <Typography>This Month</Typography>
                        </Box>
                        <Box>
                            <Typography>
                                {data?.negative_obs?.this_month || "0"}
                            </Typography>
                        </Box>
                    </Stack>
                    <Stack>
                        <Box>
                            <Typography>PTD</Typography>
                        </Box>
                        <Box>
                            <Typography>
                                {data?.negative_obs?.PTD || "-"}
                            </Typography>
                        </Box>
                    </Stack>
                </TableBoxRow>
            </TableBox>
            <TableBox>
                <TableBoxHeader>Toolbox Talk</TableBoxHeader>
                <TableBoxRow>
                    <Stack>
                        <Box>
                            <Typography>This Month</Typography>
                        </Box>
                        <Box>
                            <Typography>
                                {data?.toolbox_talk?.this_month || "0"}
                            </Typography>
                        </Box>
                    </Stack>
                    <Stack>
                        <Box>
                            <Typography>PTD</Typography>
                        </Box>
                        <Box>
                            <Typography>
                                {data?.toolbox_talk?.PTD || "-"}
                            </Typography>
                        </Box>
                    </Stack>
                </TableBoxRow>
            </TableBox>
            <TableBox>
                <TableBoxHeader>HSE Training Hours</TableBoxHeader>
                <TableBoxRow>
                    <Stack>
                        <Box>
                            <Typography>This Month</Typography>
                        </Box>
                        <Box>
                            <Typography>
                                {data?.hse_training_hours?.this_month || "0"}
                            </Typography>
                        </Box>
                    </Stack>
                    <Stack>
                        <Box>
                            <Typography>PTD</Typography>
                        </Box>
                        <Box>
                            <Typography>
                                {data?.hse_training_hours?.PTD || "-"}
                            </Typography>
                        </Box>
                    </Stack>
                </TableBoxRow>
            </TableBox>
        </Stack>
    );
}
