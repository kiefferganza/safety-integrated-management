// mui
import {
    Box,
    Card,
    Grid,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Link as MuiLink,
    IconButton,
} from "@mui/material";
// utils
import { fDate } from "@/utils/formatTime";
import { formatCms } from "@/utils/tablesUtils";
// components
import ToolboxTalkToolbar from "./ToolboxTalkToolbar";
import Image from "@/Components/image";
import Scrollbar from "@/Components/scrollbar";
import Iconify from "@/Components/iconify";

const ToolboxTalkDetail = ({ tbt }) => {
    const cms = formatCms(tbt);

    return (
        <>
            <ToolboxTalkToolbar tbt={tbt} cms={cms} />
            <Card sx={{ pt: { xs: 3, md: 5 }, px: { xs: 3, md: 8 } }}>
                <Box sx={{ mb: 2 }}>
                    <Box sx={{ mb: { xs: 0, md: -1 } }}>
                        <Image
                            disabledEffect
                            alt="logo"
                            src="/logo/Fiafi-logo.png"
                            sx={{
                                maxWidth: 160,
                                margin: { xs: "0px auto 8px auto", md: 0 },
                            }}
                        />
                    </Box>
                    <Box>
                        <Typography variant="h4" textAlign="center">
                            Toolbox Talk
                        </Typography>
                    </Box>
                </Box>

                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={{ xs: 3, md: 0 }}
                    justifyContent="space-between"
                    sx={{ mb: 5 }}
                >
                    <Stack alignItems="center" flex={1}>
                        <Box>
                            <Typography variant="body2" fontWeight={700}>
                                CMS Number:
                            </Typography>
                        </Box>
                        <Box>
                            <Typography
                                variant="body1"
                                sx={{ textTransform: "uppercase" }}
                            >
                                {cms}
                            </Typography>
                        </Box>
                    </Stack>

                    <Stack alignItems="center" flex={1}>
                        <Box>
                            <Typography
                                variant="body2"
                                fontWeight={700}
                                textAlign="center"
                            >
                                Revision:
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="body1" textAlign="center">
                                {tbt?.revision_no || 0}
                            </Typography>
                        </Box>
                    </Stack>

                    <Stack alignItems="center" flex={1}>
                        <Box>
                            <Typography variant="body2" fontWeight={700}>
                                Rollout Date:
                            </Typography>
                        </Box>
                        <Box>
                            <Typography></Typography>
                        </Box>
                    </Stack>
                </Stack>

                <Grid container spacing={{ xs: 2, md: 5 }} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6}>
                        <Box sx={{ mb: 1 }}>
                            <Box>
                                <Typography
                                    sx={{ mb: 1, fontWeight: 700 }}
                                    variant="body2"
                                >
                                    TBT Title
                                </Typography>
                            </Box>
                            <Box minHeight={24}>
                                <Typography
                                    variant="body1"
                                    sx={{ color: "text.secondary" }}
                                >
                                    {tbt.title}
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ mb: 1 }}>
                            <Box>
                                <Typography
                                    sx={{ mb: 1, fontWeight: 700 }}
                                    variant="body2"
                                >
                                    Job Description
                                </Typography>
                            </Box>
                            <Box minHeight={24}>
                                <Typography
                                    variant="body1"
                                    sx={{ color: "text.secondary" }}
                                >
                                    {tbt?.description}
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ mb: 1 }}>
                            <Box>
                                <Typography
                                    sx={{ mb: 1, fontWeight: 700 }}
                                    variant="body2"
                                >
                                    Station/Location
                                </Typography>
                            </Box>
                            <Box minHeight={24}>
                                <Typography
                                    variant="body1"
                                    sx={{ color: "text.secondary" }}
                                >
                                    {tbt.location}
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ mb: 1 }}>
                            <Box>
                                <Typography
                                    sx={{ mb: 1, fontWeight: 700 }}
                                    variant="body2"
                                >
                                    Site/Shop in charge
                                </Typography>
                            </Box>
                            <Box minHeight={24}>
                                <Typography
                                    variant="body1"
                                    sx={{ color: "text.secondary" }}
                                >
                                    {tbt?.site}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Box sx={{ mb: 1 }}>
                            <Box>
                                <Typography
                                    sx={{ mb: 1, fontWeight: 700 }}
                                    variant="body2"
                                >
                                    Contract No.
                                </Typography>
                            </Box>
                            <Box minHeight={24}>
                                <Typography
                                    variant="body1"
                                    sx={{ color: "text.secondary" }}
                                >
                                    {tbt.contract_no}
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ mb: 1 }}>
                            <Box>
                                <Typography
                                    sx={{ mb: 1, fontWeight: 700 }}
                                    variant="body2"
                                >
                                    MOC/WO No.
                                </Typography>
                            </Box>
                            <Box minHeight={24}>
                                <Typography
                                    variant="body1"
                                    sx={{ color: "text.secondary" }}
                                >
                                    {tbt?.moc_wo_no}
                                </Typography>
                            </Box>
                        </Box>

                        <Box
                            sx={{
                                mb: 1,
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            <Box width={0.5}>
                                <Box>
                                    <Typography
                                        sx={{ mb: 1, fontWeight: 700 }}
                                        variant="body2"
                                    >
                                        Date of TBT
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography
                                        variant="body1"
                                        sx={{ color: "text.secondary" }}
                                    >
                                        {tbt?.date_conducted
                                            ? fDate(tbt.date_conducted)
                                            : ""}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box width={0.5}>
                                <Box>
                                    <Typography
                                        sx={{ mb: 1, fontWeight: 700 }}
                                        variant="body2"
                                    >
                                        Time of TBT
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography
                                        variant="body1"
                                        sx={{ color: "text.secondary" }}
                                    >
                                        {tbt?.time_conducted}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                        <Box sx={{ mb: 1 }} maxWidth="160px">
                            <Box>
                                <Typography
                                    sx={{ mb: 1, fontWeight: 700 }}
                                    variant="body2"
                                >
                                    Attachment
                                </Typography>
                            </Box>
                            <Box minHeight={24}>
                                {tbt?.file.length > 0 ? (
                                    tbt?.file.map((f, idx) => (
                                        <IconButton
                                            key={idx}
                                            color="primary"
                                            component={MuiLink}
                                            href={`/storage/media/toolboxtalks/${f?.img_src}`}
                                            target="_blank"
                                        >
                                            <Iconify icon="material-symbols:attachment" />
                                        </IconButton>
                                    ))
                                ) : (
                                    <Typography
                                        variant="body1"
                                        sx={{ color: "text.secondary" }}
                                    >
                                        No
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    </Grid>
                </Grid>

                <TableContainer sx={{ overflow: "unset", mb: 4 }}>
                    <Scrollbar>
                        <Table sx={{ minWidth: 960 }}>
                            <TableHead
                                sx={{
                                    borderBottom: 1,
                                    "& th": { backgroundColor: "transparent" },
                                }}
                            >
                                <TableRow>
                                    <TableCell align="left">S.no</TableCell>

                                    <TableCell align="left">Name</TableCell>

                                    <TableCell align="left">Position</TableCell>

                                    <TableCell align="center">Time</TableCell>

                                    <TableCell align="center">
                                        Signature
                                    </TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {tbt?.participants?.map((row, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{
                                            borderBottom: 1,
                                        }}
                                    >
                                        <TableCell align="left">
                                            {index + 1}
                                        </TableCell>

                                        <TableCell align="left">
                                            {row.fullname}
                                        </TableCell>

                                        <TableCell
                                            align="left"
                                            sx={{ textTransform: "capitalize" }}
                                        >
                                            {row.position?.position}
                                        </TableCell>

                                        <TableCell align="center">
                                            {row.pivot.time}
                                        </TableCell>
                                        <TableCell align="center">
                                            {/* {tbt?.file ? (
												<MuiLink href={`/storage/media/toolboxtalks/${tbt?.file?.img_src}`} target="_blank">
													{excerpt(tbt?.file?.img_src)}
												</MuiLink>
											) : (
												"N/A"
											)} */}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Scrollbar>
                </TableContainer>

                <Box sx={{ mt: 10 }} width={1} display="inline-block">
                    <Box width={1} sx={{ mb: 10 }}>
                        <Box>
                            <Typography
                                variant="body1"
                                sx={{ mb: 2 }}
                                fontWeight={700}
                            >
                                Remarks
                            </Typography>
                        </Box>
                        <Box>
                            <Typography
                                variant="body1"
                                sx={{ minHeight: 24 }}
                                width={1}
                                borderBottom={1}
                            >
                                {tbt?.remarks}
                            </Typography>
                        </Box>
                    </Box>
                    <Box width={200}>
                        <Box>
                            <Typography
                                textAlign="center"
                                variant="body1"
                                borderBottom={1}
                            >
                                {tbt?.conducted?.fullname || tbt?.conducted_by}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography
                                textAlign="center"
                                variant="body1"
                                fontWeight={700}
                            >
                                Conducted by:
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <Box sx={{ mt: 10, mb: 2 }}>
                    <Typography textAlign="center" variant="body2">
                        &copy; FIAFI Group Company, {new Date().getFullYear()}.
                        All Rights Reserved.
                    </Typography>
                </Box>
            </Card>
        </>
    );
};

export default ToolboxTalkDetail;
