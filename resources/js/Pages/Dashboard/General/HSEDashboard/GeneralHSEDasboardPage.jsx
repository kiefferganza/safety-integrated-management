// Components
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Skeleton from "@mui/material/Skeleton";
import { useTheme } from "@mui/material/styles";
import { useSettingsContext } from "@/Components/settings";
import {
    BodyPartInjured,
    EquipmentMaterialInvolved,
    HseTables,
    IncidentClassification,
    IncidentPerLocation,
    IncidentPerMonth,
    JobDescriptionGraph,
    LeadingIndicators,
    LtirTrir,
    MechanismOfInjury,
    NatureOfInjury,
    PotentialSeverity,
    RecordableIncident,
    RootCauseAnalysis,
    TrendingObservation,
} from "@/sections/@dashboard/hse";
import { Button, IconButton, LinearProgress, Tooltip } from "@mui/material";
import Iconify from "@/Components/iconify";
import { useDateRangePicker } from "@/Components/date-range-picker";
import DateRangePicker from "@/Components/date-range-picker/DateRangePicker";
import { format } from "date-fns";
import { Inertia } from "@inertiajs/inertia";
// import Scrollbar from "@/Components/scrollbar";

export default function GeneralHSEDasboardPage({ data, isLoading }) {
    const theme = useTheme();
    const { themeStretch } = useSettingsContext();

    const insDateRangePicker = useDateRangePicker();
    const {
        startDate,
        endDate,
        open: openPicker,
        onOpen: onOpenPicker,
        onClose: onClosePicker,
        isSelected: isSelectedValuePicker,
        isError,
        label,
        setStartDate,
        setEndDate,
    } = useDateRangePicker();

    const handleStartDateChange = (date) => {
        setStartDate(date);
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
    };

    const handleOnFilterDate = () => {
        const dates = {
            from: format(startDate ?? new Date(), "yyyy-MM-dd"),
            to: format(endDate, "yyyy-MM-dd"),
        };

        Inertia.get(route("dashboard"), dates, {
            preserveScroll: true,
            preserveState: true,
            only: ["from", "to"],
            onStart() {
                onClosePicker();
            },
        });
    };

    const handleOnFilterDateInspection = () => {
        const dates = {
            inspectionFrom: format(
                insDateRangePicker.startDate ?? new Date(),
                "yyyy-MM-dd"
            ),
            inspectionTo: format(insDateRangePicker.endDate, "yyyy-MM-dd"),
        };

        Inertia.get(route("dashboard"), dates, {
            preserveScroll: true,
            preserveState: true,
            onStart() {
                insDateRangePicker.onClose();
            },
        });
    };

    const handleClosePicker = () => {
        onClosePicker();
        insDateRangePicker.onClose();
    };

    return (
        <>
            <Container maxWidth={themeStretch ? false : "xl"}>
                <Box display="flex" justifyContent="end">
                    <Box>
                        <Typography
                            variant="subtitle2"
                            fontWeight={700}
                            mb={1}
                            textAlign="right"
                        >
                            Filter Analytics
                        </Typography>
                        <Box display="flex" mb={1}>
                            {isSelectedValuePicker ? (
                                <Button
                                    onClick={onOpenPicker}
                                    variant="outlined"
                                >
                                    {label}
                                </Button>
                            ) : (
                                <Button
                                    onClick={onOpenPicker}
                                    variant="outlined"
                                >
                                    Select Date
                                </Button>
                            )}
                        </Box>
                    </Box>
                </Box>
                <Stack gap={1.5}>
                    {isLoading ? (
                        <Skeleton width="100%" height={78} variant="rounded" />
                    ) : (
                        <HseTables data={data?.analytics} />
                    )}
                    <Grid container spacing={1}>
                        <Grid item md={6} sm={12} xs={12} lg={4}>
                            <Card
                                sx={{
                                    height: "100%",
                                    borderRadius: 0,
                                    padding: 0.5,
                                }}
                            >
                                <Box
                                    py={0.5}
                                    px={1}
                                    borderRadius={99}
                                    bgcolor={theme.palette.primary.main}
                                    display="inline-block"
                                >
                                    <Typography
                                        fontSize={theme.typography.subtitle2}
                                        color="#ffffff"
                                        fontWeight={600}
                                    >
                                        INCIDENT CLASSIFICATION
                                    </Typography>
                                </Box>
                                {isLoading ? (
                                    <Skeleton
                                        width="100%"
                                        height={280}
                                        variant="rounded"
                                        sx={{ mt: 1 }}
                                    />
                                ) : (
                                    <IncidentClassification
                                        data={
                                            data?.graph?.incident_classification
                                        }
                                    />
                                )}
                            </Card>
                        </Grid>
                        <Grid item md={6} sm={12} xs={12} lg={2.5}>
                            <Card
                                sx={{
                                    height: "100%",
                                    borderRadius: 0,
                                    padding: 0.5,
                                }}
                            >
                                <Box
                                    py={0.5}
                                    px={1}
                                    borderRadius={99}
                                    bgcolor={theme.palette.primary.main}
                                    display="inline-block"
                                >
                                    <Typography
                                        fontSize={theme.typography.subtitle2}
                                        color="#ffffff"
                                        fontWeight={600}
                                    >
                                        RECORDABLE INCIDENT
                                    </Typography>
                                </Box>
                                {isLoading ? (
                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        height={280}
                                        width={1}
                                    >
                                        <Skeleton
                                            width={180}
                                            height={180}
                                            variant="circular"
                                        />
                                    </Box>
                                ) : (
                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        height={280}
                                        width={1}
                                    >
                                        <RecordableIncident
                                            data={
                                                data?.graph?.recordable_incident
                                            }
                                        />
                                    </Box>
                                )}
                            </Card>
                        </Grid>
                        <Grid item md={6} sm={12} xs={12} lg={2.5}>
                            <Card
                                sx={{
                                    height: "100%",
                                    borderRadius: 0,
                                    padding: 0.5,
                                }}
                            >
                                <Box
                                    py={0.5}
                                    px={1}
                                    borderRadius={99}
                                    bgcolor={theme.palette.primary.main}
                                    display="inline-block"
                                >
                                    <Typography
                                        fontSize={theme.typography.subtitle2}
                                        color="#ffffff"
                                        fontWeight={600}
                                    >
                                        INCIDENT PER MONTH
                                    </Typography>
                                </Box>
                                {isLoading ? (
                                    <Skeleton
                                        width="100%"
                                        height={280}
                                        variant="rounded"
                                        sx={{ mt: 1 }}
                                    />
                                ) : (
                                    <IncidentPerMonth
                                        data={data?.graph?.incident_per_month}
                                    />
                                )}
                            </Card>
                        </Grid>
                        <Grid item md={6} sm={12} xs={12} lg={3}>
                            <Card
                                sx={{
                                    height: "100%",
                                    borderRadius: 0,
                                    padding: 0.5,
                                }}
                            >
                                <Box
                                    py={0.5}
                                    px={1}
                                    borderRadius={99}
                                    bgcolor={theme.palette.primary.main}
                                    display="inline-block"
                                >
                                    <Typography
                                        fontSize={theme.typography.subtitle2}
                                        color="#ffffff"
                                        fontWeight={600}
                                    >
                                        INCIDENT PER ROO SITE/LOCATION
                                    </Typography>
                                </Box>
                                {isLoading ? (
                                    <Skeleton
                                        width="100%"
                                        height={280}
                                        variant="rounded"
                                        sx={{ mt: 1 }}
                                    />
                                ) : (
                                    <IncidentPerLocation
                                        data={
                                            data?.graph?.incident_per_location
                                        }
                                    />
                                )}
                            </Card>
                        </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid item md={6} sm={12} xs={12} lg={3}>
                            <Card
                                sx={{
                                    height: "100%",
                                    borderRadius: 0,
                                    padding: 0.5,
                                }}
                            >
                                <Box width={1}>
                                    <Box
                                        py={0.5}
                                        px={1}
                                        borderRadius={99}
                                        bgcolor={theme.palette.primary.main}
                                        display="inline-block"
                                    >
                                        <Typography
                                            fontSize={
                                                theme.typography.subtitle2
                                            }
                                            color="#ffffff"
                                            fontWeight={600}
                                        >
                                            LTIR/TRIR
                                        </Typography>
                                    </Box>
                                    {isLoading ? (
                                        <Box
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            <Skeleton
                                                width="90%"
                                                height={280}
                                                variant="rounded"
                                                sx={{ mt: 1 }}
                                            />
                                        </Box>
                                    ) : (
                                        <LtirTrir
                                            data={data?.graph?.LTIR_TRIR}
                                        />
                                    )}
                                </Box>
                            </Card>
                        </Grid>
                        <Grid item md={6} sm={12} xs={12} lg={3}>
                            <Card
                                sx={{
                                    height: "100%",
                                    borderRadius: 0,
                                    padding: 0.5,
                                }}
                            >
                                <Box width={1}>
                                    <Box
                                        py={0.5}
                                        px={1}
                                        borderRadius={99}
                                        bgcolor={theme.palette.primary.main}
                                        display="inline-block"
                                    >
                                        <Typography
                                            fontSize={
                                                theme.typography.subtitle2
                                            }
                                            color="#ffffff"
                                            fontWeight={600}
                                        >
                                            POTENTIAL SEVERITY
                                        </Typography>
                                    </Box>
                                    {isLoading ? (
                                        <Box
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            <Skeleton
                                                width="90%"
                                                height={280}
                                                variant="rounded"
                                                sx={{ mt: 1 }}
                                            />
                                        </Box>
                                    ) : (
                                        <PotentialSeverity
                                            data={
                                                data?.graph?.potential_severity
                                            }
                                        />
                                    )}
                                </Box>
                            </Card>
                        </Grid>
                        <Grid item md={6} sm={12} xs={12} lg={3}>
                            <Card
                                sx={{
                                    height: "100%",
                                    borderRadius: 0,
                                    padding: 0.5,
                                }}
                            >
                                <Box width={1}>
                                    <Box
                                        py={0.5}
                                        px={1}
                                        borderRadius={99}
                                        bgcolor={theme.palette.primary.main}
                                        display="inline-block"
                                    >
                                        <Typography
                                            fontSize={
                                                theme.typography.subtitle2
                                            }
                                            color="#ffffff"
                                            fontWeight={600}
                                        >
                                            ROOT CAUSE ANALYSIS
                                        </Typography>
                                    </Box>
                                    {isLoading ? (
                                        <Box
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            <Skeleton
                                                width="90%"
                                                height={280}
                                                variant="rounded"
                                                sx={{ mt: 1 }}
                                            />
                                        </Box>
                                    ) : (
                                        <RootCauseAnalysis
                                            data={
                                                data?.graph?.root_cause_analysis
                                            }
                                        />
                                    )}
                                </Box>
                            </Card>
                        </Grid>
                        <Grid item md={6} sm={12} xs={12} lg={3}>
                            <Card
                                sx={{
                                    height: "100%",
                                    borderRadius: 0,
                                    padding: 0.5,
                                }}
                            >
                                <Box width={1}>
                                    <Box
                                        py={0.5}
                                        px={1}
                                        borderRadius={99}
                                        bgcolor={theme.palette.primary.main}
                                        display="inline-block"
                                    >
                                        <Typography
                                            fontSize={
                                                theme.typography.subtitle2
                                            }
                                            color="#ffffff"
                                            fontWeight={600}
                                        >
                                            LEADING INDICATORS
                                        </Typography>
                                    </Box>
                                    {isLoading ? (
                                        <Box
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            <Skeleton
                                                width="90%"
                                                height={280}
                                                variant="rounded"
                                                sx={{ mt: 1 }}
                                            />
                                        </Box>
                                    ) : (
                                        <LeadingIndicators />
                                    )}
                                </Box>
                            </Card>
                        </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                        {!isLoading && (
                            <>
                                <Grid item md={6} sm={12} xs={12} lg={2.4}>
                                    <Card
                                        sx={{
                                            height: "100%",
                                            borderRadius: 0,
                                            padding: 0.5,
                                        }}
                                    >
                                        <Box width={1}>
                                            <Box
                                                py={0.5}
                                                px={1}
                                                borderRadius={99}
                                                bgcolor={
                                                    theme.palette.primary.main
                                                }
                                                display="inline-block"
                                            >
                                                <Typography
                                                    fontSize={
                                                        theme.typography
                                                            .subtitle2
                                                    }
                                                    color="#ffffff"
                                                    fontWeight={600}
                                                >
                                                    BODY PART INJURED
                                                </Typography>
                                            </Box>
                                            <BodyPartInjured
                                                data={
                                                    data?.graph
                                                        ?.body_part_injured
                                                }
                                            />
                                        </Box>
                                    </Card>
                                </Grid>
                                <Grid item md={6} sm={12} xs={12} lg={2.4}>
                                    <Card
                                        sx={{
                                            height: "100%",
                                            borderRadius: 0,
                                            padding: 0.5,
                                        }}
                                    >
                                        <Box width={1}>
                                            <Box
                                                py={0.5}
                                                px={1}
                                                borderRadius={99}
                                                bgcolor={
                                                    theme.palette.primary.main
                                                }
                                                display="inline-block"
                                            >
                                                <Typography
                                                    fontSize={
                                                        theme.typography
                                                            .subtitle2
                                                    }
                                                    color="#ffffff"
                                                    fontWeight={600}
                                                >
                                                    MECHANISM OF INJURY
                                                </Typography>
                                            </Box>
                                            <MechanismOfInjury
                                                data={
                                                    data?.graph
                                                        ?.mechanism_of_injury
                                                }
                                            />
                                        </Box>
                                    </Card>
                                </Grid>
                                <Grid item md={6} sm={12} xs={12} lg={2.4}>
                                    <Card
                                        sx={{
                                            height: "100%",
                                            borderRadius: 0,
                                            padding: 0.5,
                                        }}
                                    >
                                        <Box width={1}>
                                            <Box
                                                py={0.5}
                                                px={1}
                                                borderRadius={99}
                                                bgcolor={
                                                    theme.palette.primary.main
                                                }
                                                display="inline-block"
                                            >
                                                <Typography
                                                    fontSize={
                                                        theme.typography
                                                            .subtitle2
                                                    }
                                                    color="#ffffff"
                                                    fontWeight={600}
                                                >
                                                    NATURE OF INJURY
                                                </Typography>
                                            </Box>
                                            <NatureOfInjury
                                                data={
                                                    data?.graph
                                                        ?.nature_of_injury
                                                }
                                            />
                                        </Box>
                                    </Card>
                                </Grid>
                                <Grid item md={6} sm={12} xs={12} lg={2.4}>
                                    <Card
                                        sx={{
                                            height: "100%",
                                            borderRadius: 0,
                                            padding: 0.5,
                                        }}
                                    >
                                        <Box width={1}>
                                            <Box
                                                py={0.5}
                                                px={1}
                                                borderRadius={99}
                                                bgcolor={
                                                    theme.palette.primary.main
                                                }
                                                display="inline-block"
                                            >
                                                <Typography
                                                    fontSize={
                                                        theme.typography
                                                            .subtitle2
                                                    }
                                                    color="#ffffff"
                                                    fontWeight={600}
                                                >
                                                    JOB DESCRIPTION
                                                </Typography>
                                            </Box>
                                            <JobDescriptionGraph
                                                data={
                                                    data?.graph?.job_description
                                                }
                                            />
                                        </Box>
                                    </Card>
                                </Grid>
                                <Grid item md={6} sm={12} xs={12} lg={2.4}>
                                    <Card
                                        sx={{
                                            height: "100%",
                                            borderRadius: 0,
                                            padding: 0.5,
                                        }}
                                    >
                                        <Box width={1}>
                                            <Box
                                                py={0.5}
                                                px={1}
                                                borderRadius={99}
                                                bgcolor={
                                                    theme.palette.primary.main
                                                }
                                                display="inline-block"
                                            >
                                                <Typography
                                                    fontSize={
                                                        theme.typography
                                                            .subtitle2
                                                    }
                                                    color="#ffffff"
                                                    fontWeight={600}
                                                >
                                                    EQUIPMENT & MATERIAL
                                                    INVOLVED
                                                </Typography>
                                            </Box>
                                            <EquipmentMaterialInvolved
                                                data={
                                                    data?.graph
                                                        ?.equipment_material_involved
                                                }
                                            />
                                        </Box>
                                    </Card>
                                </Grid>
                            </>
                        )}
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid item md={6} sm={12} xs={12} lg={8}>
                            <Card
                                sx={{
                                    height: "100%",
                                    borderRadius: 0,
                                    padding: 0.5,
                                }}
                            >
                                <Box width={1} my={0.5}>
                                    <Box
                                        display="flex"
                                        justifyContent="space-between"
                                        alignItems="center"
                                    >
                                        <Box
                                            py={0.5}
                                            px={1}
                                            borderRadius={99}
                                            bgcolor={theme.palette.primary.main}
                                            display="inline-block"
                                        >
                                            <Typography
                                                fontSize={
                                                    theme.typography.subtitle2
                                                }
                                                color="#ffffff"
                                                fontWeight={600}
                                            >
                                                Trending Observation
                                            </Typography>
                                        </Box>

                                        <Box>
                                            {insDateRangePicker.isSelected ? (
                                                <Button
                                                    onClick={
                                                        insDateRangePicker.onOpen
                                                    }
                                                    variant="outlined"
                                                >
                                                    {insDateRangePicker.label}
                                                </Button>
                                            ) : (
                                                <Button
                                                    onClick={
                                                        insDateRangePicker.onOpen
                                                    }
                                                    variant="outlined"
                                                >
                                                    Select Inspection Date
                                                </Button>
                                            )}
                                        </Box>
                                    </Box>
                                    {isLoading ? (
                                        <Box
                                            height={300}
                                            width={1}
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            <LinearProgress
                                                sx={{
                                                    maxWidth: 400,
                                                    width: 1,
                                                    height: 6,
                                                }}
                                                color="inherit"
                                            />
                                        </Box>
                                    ) : (
                                        <TrendingObservation
                                            chart={{
                                                series:
                                                    data?.trending_observation
                                                        ?.series || [],
                                                categories:
                                                    data?.trending_observation
                                                        ?.categories || [],
                                            }}
                                            trends={
                                                data?.trending_observation
                                                    ?.trends || []
                                            }
                                        />
                                    )}
                                </Box>
                            </Card>
                        </Grid>
                        <Grid item md={6} sm={12} xs={12} lg={4}>
                            <Card
                                sx={{
                                    height: "100%",
                                    borderRadius: 0,
                                    padding: 0.5,
                                }}
                            >
                                <Box width={1}>
                                    <Box
                                        py={0.5}
                                        px={1}
                                        borderRadius={99}
                                        bgcolor={theme.palette.primary.main}
                                        display="inline-block"
                                    >
                                        <Typography
                                            fontSize={
                                                theme.typography.subtitle2
                                            }
                                            color="#ffffff"
                                            fontWeight={600}
                                        >
                                            Top 5 HSE Hazards (Month)
                                        </Typography>
                                    </Box>
                                    {isLoading ? (
                                        <Box
                                            height={300}
                                            width={1}
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            <LinearProgress
                                                sx={{
                                                    maxWidth: 360,
                                                    width: 1,
                                                    height: 6,
                                                }}
                                                color="inherit"
                                            />
                                        </Box>
                                    ) : (
                                        <TableContainer sx={{ mt: 1 }}>
                                            <Table>
                                                <TableBody>
                                                    {data?.trending_observation?.trends.map(
                                                        (trend, idx) => (
                                                            <TableRow
                                                                key={trend.name}
                                                                sx={{
                                                                    "&:nth-of-type(odd)":
                                                                        {
                                                                            backgroundColor:
                                                                                (
                                                                                    theme
                                                                                ) =>
                                                                                    theme
                                                                                        .palette
                                                                                        .action
                                                                                        .hover,
                                                                        },
                                                                }}
                                                            >
                                                                <TableCell
                                                                    sx={{
                                                                        display:
                                                                            "flex",
                                                                    }}
                                                                >
                                                                    <Typography variant="subtitle2">
                                                                        {idx +
                                                                            1}
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Typography variant="subtitle2">
                                                                        {
                                                                            trend.name
                                                                        }
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Typography
                                                                        variant="subtitle2"
                                                                        color="error.dark"
                                                                        sx={{
                                                                            textDecoration:
                                                                                "underline",
                                                                        }}
                                                                    >
                                                                        {
                                                                            trend.value
                                                                        }
                                                                    </Typography>
                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    )}
                                </Box>
                            </Card>
                        </Grid>
                    </Grid>
                </Stack>
            </Container>
            <DateRangePicker
                variant="calendar"
                title="Choose date"
                startDate={startDate}
                endDate={endDate}
                onChangeStartDate={handleStartDateChange}
                onChangeEndDate={handleEndDateChange}
                open={openPicker}
                onClose={handleClosePicker}
                isSelected={isSelectedValuePicker}
                isError={isError}
                onApply={handleOnFilterDate}
                StartDateProps={{
                    views: ["year", "month", "day"],
                }}
                EndDateProps={{
                    views: ["year", "month", "day"],
                }}
            />

            <DateRangePicker
                variant="calendar"
                title="Choose Inspection date"
                startDate={insDateRangePicker.startDate}
                endDate={insDateRangePicker.endDate}
                onChangeStartDate={(date) => {
                    insDateRangePicker.setStartDate(date);
                }}
                onChangeEndDate={(date) => {
                    insDateRangePicker.setEndDate(date);
                }}
                open={insDateRangePicker.open}
                onClose={handleClosePicker}
                isSelected={insDateRangePicker.isSelected}
                isError={insDateRangePicker.isError}
                onApply={handleOnFilterDateInspection}
                StartDateProps={{
                    views: ["year", "month", "day"],
                }}
                EndDateProps={{
                    views: ["year", "month", "day"],
                }}
            />
        </>
    );
}
