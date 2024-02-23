import PropTypes from "prop-types";
// @mui
import {
    Box,
    Card,
    Grid,
    Table,
    TableRow,
    TableBody,
    TableHead,
    TableCell,
    Typography,
    TableContainer,
    Stack,
    Avatar,
    Tooltip,
    Link as MuiLink,
} from "@mui/material";
// utils
import { fDate } from "@/utils/formatTime";
import { ellipsis } from "@/utils/exercpt";
// components
import Image from "@/Components/image";
import Scrollbar from "@/Components/scrollbar";
//
import TrainingToolbar from "./TrainingToolbar";
import { fileFormat, fileThumb } from "@/Components/file-thumbnail";

// ----------------------------------------------------------------------

InHouseDetail.propTypes = {
    training: PropTypes.object,
};

export default function InHouseDetail({ training, rolloutDate }) {
    if (!training) {
        return null;
    }

    return (
        <>
            <TrainingToolbar
                training={training}
                module="In House"
                rolloutDate={rolloutDate}
            />

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
                            In House Training
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
                                {training?.cms || ""}
                            </Typography>
                        </Box>
                    </Stack>

                    <Stack alignItems="center" flex={1}>
                        <Box>
                            <Typography
                                variant="body2"
                                fontWeight={700}
                                textAlign="center"
                            ></Typography>
                        </Box>
                        <Box></Box>
                    </Stack>

                    <Stack alignItems="center" flex={1}>
                        <Box>
                            <Typography variant="body2" fontWeight={700}>
                                Rollout Date:
                            </Typography>
                        </Box>
                        <Box>
                            <Typography>
                                {rolloutDate
                                    ? new Date(rolloutDate).toLocaleDateString()
                                    : ""}
                            </Typography>
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
                                    Course Title
                                </Typography>
                            </Box>
                            <Box>
                                <Typography
                                    variant="body1"
                                    sx={{ color: "text.secondary" }}
                                >
                                    {training?.course
                                        ? training.course.course_name
                                        : training.title}
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ mb: 1 }}>
                            <Box>
                                <Typography
                                    sx={{ mb: 1, fontWeight: 700 }}
                                    variant="body2"
                                >
                                    Training Location
                                </Typography>
                            </Box>
                            <Box>
                                <Typography
                                    variant="body1"
                                    sx={{ color: "text.secondary" }}
                                >
                                    {training.location}
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ mb: 1 }}>
                            <Box>
                                <Typography
                                    sx={{ mb: 1, fontWeight: 700 }}
                                    variant="body2"
                                >
                                    Contract No.
                                </Typography>
                            </Box>
                            <Box>
                                <Typography
                                    variant="body1"
                                    sx={{ color: "text.secondary" }}
                                >
                                    {training.contract_no}
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ mb: 1 }}>
                            <Box>
                                <Typography
                                    sx={{ mb: 1, fontWeight: 700 }}
                                    variant="body2"
                                >
                                    Conducted By
                                </Typography>
                            </Box>
                            <Box>
                                <Typography
                                    variant="body1"
                                    sx={{ color: "text.secondary" }}
                                >
                                    {training.trainer}
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
                                    Date of Training
                                </Typography>
                            </Box>
                            <Box>
                                <Typography
                                    variant="body1"
                                    sx={{ color: "text.secondary" }}
                                >
                                    {training?.training_date
                                        ? fDate(training.training_date)
                                        : ""}
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ mb: 1 }}>
                            <Box>
                                <Typography
                                    sx={{ mb: 1, fontWeight: 700 }}
                                    variant="body2"
                                >
                                    Training Hours
                                </Typography>
                            </Box>
                            <Box>
                                <Typography
                                    variant="body1"
                                    sx={{ color: "text.secondary" }}
                                >
                                    {training.training_hrs}
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ mb: 1 }}>
                            <Box>
                                <Typography
                                    sx={{ mb: 1, fontWeight: 700 }}
                                    variant="body2"
                                >
                                    Status
                                </Typography>
                            </Box>
                            <Box>
                                <Typography
                                    variant="body1"
                                    color={
                                        training?.status === "completed"
                                            ? "#86E8AB"
                                            : "#FFAC82"
                                    }
                                >
                                    {training?.status === "completed"
                                        ? "Completed"
                                        : "Incomplete"}
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ mb: 1 }}>
                            <Box>
                                <Typography
                                    sx={{ mb: 1, fontWeight: 700 }}
                                    variant="body2"
                                >
                                    Attachment
                                </Typography>
                            </Box>
                            <Box minHeight={24}>
                                {training?.attachment ? (
                                    <Tooltip title={training.attachment.name}>
                                        <MuiLink
                                            component="a"
                                            href={training.attachment.url}
                                            sx={{
                                                color: "text.primary",
                                            }}
                                            target="_file"
                                            rel="noopener noreferrer"
                                        >
                                            <Stack
                                                spacing={2}
                                                direction="row"
                                                alignItems="center"
                                            >
                                                <Avatar
                                                    variant="rounded"
                                                    sx={{
                                                        bgcolor:
                                                            "background.neutral",
                                                        width: 36,
                                                        height: 36,
                                                        borderRadius: "9px",
                                                    }}
                                                >
                                                    <Box
                                                        component="img"
                                                        src={fileThumb(
                                                            fileFormat(
                                                                training
                                                                    .attachment
                                                                    .url
                                                            )
                                                        )}
                                                        sx={{
                                                            width: 24,
                                                            height: 24,
                                                        }}
                                                    />
                                                </Avatar>

                                                <Stack
                                                    spacing={0.5}
                                                    flexGrow={1}
                                                >
                                                    <Typography
                                                        variant="subtitle2"
                                                        sx={{
                                                            textDecoration:
                                                                "none",
                                                        }}
                                                    >
                                                        {ellipsis(
                                                            training.attachment
                                                                .name || "",
                                                            24
                                                        )}
                                                    </Typography>
                                                </Stack>
                                            </Stack>
                                        </MuiLink>
                                    </Tooltip>
                                ) : (
                                    <Box minHeight={24}>
                                        <Typography
                                            variant="body1"
                                            sx={{ color: "text.secondary" }}
                                        >
                                            No Attachment.
                                        </Typography>
                                    </Box>
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
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {training?.trainees?.map((row, index) => (
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
                                            {row.position}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Scrollbar>
                </TableContainer>

                <Box sx={{ mt: 10, mb: 2 }}>
                    <Typography textAlign="center" variant="body2">
                        &copy; FIAFI Group Company, {new Date().getFullYear()}.
                        All Rights Reserved.
                    </Typography>
                </Box>
            </Card>
        </>
    );
}
