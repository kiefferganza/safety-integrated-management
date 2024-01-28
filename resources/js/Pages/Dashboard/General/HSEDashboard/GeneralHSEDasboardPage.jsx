// Components
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
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

export default function GeneralHSEDasboardPage() {
    const theme = useTheme();
    const { themeStretch } = useSettingsContext();
    return (
        <Container maxWidth={themeStretch ? false : "xl"}>
            <Stack gap={1.5}>
                <HseTables />
                <Grid container spacing={1.5}>
                    <Grid item lg={4}>
                        <Card
                            sx={{
                                height: "100%",
                                borderRadius: 0,
                                padding: 0.5,
                            }}
                        >
                            <Box
                                p={0.5}
                                bgcolor={theme.palette.primary.main}
                                display="inline-block"
                            >
                                <Typography
                                    fontSize={theme.typography.body2}
                                    fontWeight={600}
                                >
                                    INCIDENT CLASSIFICATION
                                </Typography>
                            </Box>
                            <IncidentClassification />
                        </Card>
                    </Grid>
                    <Grid item lg={2.5}>
                        <Card
                            sx={{
                                height: "100%",
                                borderRadius: 0,
                                padding: 0.5,
                            }}
                        >
                            <Box
                                p={0.5}
                                bgcolor={theme.palette.primary.main}
                                display="inline-block"
                            >
                                <Typography
                                    fontSize={theme.typography.body2}
                                    fontWeight={600}
                                >
                                    RECORDABLE INCIDENT
                                </Typography>
                            </Box>
                            <RecordableIncident />
                        </Card>
                    </Grid>
                    <Grid item lg={2.5}>
                        <Card
                            sx={{
                                height: "100%",
                                borderRadius: 0,
                                padding: 0.5,
                            }}
                        >
                            <Box
                                p={0.5}
                                bgcolor={theme.palette.primary.main}
                                display="inline-block"
                            >
                                <Typography
                                    fontSize={theme.typography.body2}
                                    fontWeight={600}
                                >
                                    INCIDENT PER MONTH
                                </Typography>
                            </Box>
                            <IncidentPerMonth />
                        </Card>
                    </Grid>
                    <Grid item lg={3}>
                        <Card
                            sx={{
                                height: "100%",
                                borderRadius: 0,
                                padding: 0.5,
                            }}
                        >
                            <Box
                                p={0.5}
                                bgcolor={theme.palette.primary.main}
                                display="inline-block"
                            >
                                <Typography
                                    fontSize={theme.typography.body2}
                                    fontWeight={600}
                                >
                                    INCIDENT PER ROO SITE/LOCATION
                                </Typography>
                            </Box>
                            <IncidentPerLocation />
                        </Card>
                    </Grid>
                </Grid>
                <Grid container spacing={1.5}>
                    <Grid item lg={12}>
                        <Card
                            sx={{
                                height: "100%",
                                borderRadius: 0,
                                padding: 0.5,
                            }}
                        >
                            <Stack direction="row">
                                <Box width={1}>
                                    <Box
                                        p={0.5}
                                        bgcolor={theme.palette.primary.main}
                                        display="inline-block"
                                    >
                                        <Typography
                                            fontSize={theme.typography.body2}
                                            fontWeight={600}
                                        >
                                            LTIR/TRIR
                                        </Typography>
                                    </Box>
                                    <LtirTrir />
                                </Box>

                                <Box width={1}>
                                    <Box
                                        p={0.5}
                                        bgcolor={theme.palette.primary.main}
                                        display="inline-block"
                                    >
                                        <Typography
                                            fontSize={theme.typography.body2}
                                            fontWeight={600}
                                        >
                                            POTENTIAL SEVERITY
                                        </Typography>
                                    </Box>
                                    <PotentialSeverity />
                                </Box>

                                <Box width={1}>
                                    <Box
                                        p={0.5}
                                        bgcolor={theme.palette.primary.main}
                                        display="inline-block"
                                    >
                                        <Typography
                                            fontSize={theme.typography.body2}
                                            fontWeight={600}
                                        >
                                            ROOT CAUSE ANALYSIS
                                        </Typography>
                                    </Box>
                                    <RootCauseAnalysis />
                                </Box>

                                <Box width={1}>
                                    <Box
                                        p={0.5}
                                        bgcolor={theme.palette.primary.main}
                                        display="inline-block"
                                    >
                                        <Typography
                                            fontSize={theme.typography.body2}
                                            fontWeight={600}
                                        >
                                            LEADING INDICATORS
                                        </Typography>
                                    </Box>
                                    <LeadingIndicators />
                                </Box>
                            </Stack>
                        </Card>
                    </Grid>
                </Grid>
                <Grid container spacing={1.5}>
                    <Grid item lg={12}>
                        <Card
                            sx={{
                                height: "100%",
                                borderRadius: 0,
                                padding: 0.5,
                            }}
                        >
                            <Stack direction="row">
                                <Box width={1}>
                                    <Box
                                        p={0.5}
                                        bgcolor={theme.palette.primary.main}
                                        display="inline-block"
                                    >
                                        <Typography
                                            fontSize={theme.typography.body2}
                                            fontWeight={600}
                                        >
                                            BODY PART INJURED
                                        </Typography>
                                    </Box>
                                    <BodyPartInjured />
                                </Box>

                                <Box width={1}>
                                    <Box
                                        p={0.5}
                                        bgcolor={theme.palette.primary.main}
                                        display="inline-block"
                                    >
                                        <Typography
                                            fontSize={theme.typography.body2}
                                            fontWeight={600}
                                        >
                                            MECHANISM OF INJURY
                                        </Typography>
                                    </Box>
                                    <MechanismOfInjury />
                                </Box>

                                <Box width={1}>
                                    <Box
                                        p={0.5}
                                        bgcolor={theme.palette.primary.main}
                                        display="inline-block"
                                    >
                                        <Typography
                                            fontSize={theme.typography.body2}
                                            fontWeight={600}
                                        >
                                            NATURE OF INJURY
                                        </Typography>
                                    </Box>
                                    <NatureOfInjury />
                                </Box>

                                <Box width={1}>
                                    <Box
                                        p={0.5}
                                        bgcolor={theme.palette.primary.main}
                                        display="inline-block"
                                    >
                                        <Typography
                                            fontSize={theme.typography.body2}
                                            fontWeight={600}
                                        >
                                            JOB DESCRIPTION
                                        </Typography>
                                    </Box>
                                    <JobDescriptionGraph />
                                </Box>

                                <Box width={1}>
                                    <Box
                                        p={0.5}
                                        bgcolor={theme.palette.primary.main}
                                        display="inline-block"
                                    >
                                        <Typography
                                            fontSize={theme.typography.body2}
                                            fontWeight={600}
                                        >
                                            EQUIPMENT & MATERIAL INVOLVED
                                        </Typography>
                                    </Box>
                                    <EquipmentMaterialInvolved />
                                </Box>
                            </Stack>
                        </Card>
                    </Grid>
                </Grid>
            </Stack>
        </Container>
    );
}
