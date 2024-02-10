// Components
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
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
} from "@/sections/@dashboard/hse";

export default function GeneralHSEDasboardPage({ data, isLoading }) {
    console.log({ data });
    const theme = useTheme();
    const { themeStretch } = useSettingsContext();
    return (
        <Container maxWidth={themeStretch ? false : "xl"}>
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
                                    data={data?.graph?.incident_classification}
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
                                        data={data?.graph?.recordable_incident}
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
                                    data={data?.graph?.incident_per_location}
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
                                        fontSize={theme.typography.subtitle2}
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
                                    <LtirTrir data={data?.graph?.LTIR_TRIR} />
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
                                        fontSize={theme.typography.subtitle2}
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
                                        data={data?.graph?.potential_severity}
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
                                        fontSize={theme.typography.subtitle2}
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
                                        data={data?.graph?.root_cause_analysis}
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
                                        fontSize={theme.typography.subtitle2}
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
                                                BODY PART INJURED
                                            </Typography>
                                        </Box>
                                        <BodyPartInjured
                                            data={
                                                data?.graph?.body_part_injured
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
                                                MECHANISM OF INJURY
                                            </Typography>
                                        </Box>
                                        <MechanismOfInjury
                                            data={
                                                data?.graph?.mechanism_of_injury
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
                                                NATURE OF INJURY
                                            </Typography>
                                        </Box>
                                        <NatureOfInjury
                                            data={data?.graph?.nature_of_injury}
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
                                                JOB DESCRIPTION
                                            </Typography>
                                        </Box>
                                        <JobDescriptionGraph
                                            data={data?.graph?.job_description}
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
                                                EQUIPMENT & MATERIAL INVOLVED
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
            </Stack>
        </Container>
    );
}
