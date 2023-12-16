// @mui
import { Box, Stack, Divider, Typography } from "@mui/material";
// components
import { RHFMuiSelect, RHFTextField } from "@/Components/hook-form";

// ----------------------------------------------------------------------

const TrainingProjectDetails = ({ projectDetails }) => {
    return (
        <Box sx={{ p: 3 }}>
            <Stack
                direction={{ xs: "column", md: "row" }}
                alignItems="center"
                sx={{ mb: 3 }}
            >
                <Typography
                    variant="h6"
                    sx={{ color: "text.disabled", flex: 1 }}
                >
                    Project Detail
                </Typography>
            </Stack>

            <Stack
                divider={<Divider flexItem sx={{ borderStyle: "dashed" }} />}
                spacing={3}
            >
                <Stack alignItems="flex-end" spacing={2}>
                    <Stack
                        direction={{ xs: "column", md: "row" }}
                        spacing={3}
                        sx={{ width: 1 }}
                    >
                        <RHFMuiSelect
                            label="Project Code"
                            name="project_code"
                            fullWidth
                            options={
                                projectDetails["Project Code"]
                                    ? [
                                          { label: "", value: "" },
                                          ...projectDetails["Project Code"].map(
                                              (d) => ({
                                                  label:
                                                      d.value +
                                                      (d.name
                                                          ? ` (${d.name})`
                                                          : ""),
                                                  value: d.value,
                                              })
                                          ),
                                      ]
                                    : []
                            }
                        />

                        <RHFMuiSelect
                            label="Originator"
                            name="originator"
                            fullWidth
                            options={
                                projectDetails["Originator"]
                                    ? [
                                          { label: "", value: "" },
                                          ...projectDetails["Originator"].map(
                                              (d) => ({
                                                  label:
                                                      d.value +
                                                      (d.name
                                                          ? ` (${d.name})`
                                                          : ""),
                                                  value: d.value,
                                              })
                                          ),
                                      ]
                                    : []
                            }
                        />

                        <RHFMuiSelect
                            label="Discipline"
                            name="discipline"
                            fullWidth
                            options={
                                projectDetails["Discipline"]
                                    ? [
                                          { label: "", value: "" },
                                          ...projectDetails["Discipline"].map(
                                              (d) => ({
                                                  label:
                                                      d.value +
                                                      (d.name
                                                          ? ` (${d.name})`
                                                          : ""),
                                                  value: d.value,
                                              })
                                          ),
                                      ]
                                    : []
                            }
                        />
                    </Stack>
                    <Stack
                        direction={{ xs: "column", md: "row" }}
                        spacing={3}
                        sx={{ width: 1 }}
                    >
                        <RHFMuiSelect
                            label="Type"
                            name="document_type"
                            fullWidth
                            options={
                                projectDetails["Type"]
                                    ? [
                                          { label: "", value: "" },
                                          ...projectDetails["Type"].map(
                                              (d) => ({
                                                  label:
                                                      d.value +
                                                      (d.name
                                                          ? ` (${d.name})`
                                                          : ""),
                                                  value: d.value,
                                              })
                                          ),
                                      ]
                                    : []
                            }
                        />

                        <RHFMuiSelect
                            label="Zone (Optional)"
                            name="document_zone"
                            fullWidth
                            options={
                                projectDetails["Zone"]
                                    ? [
                                          { label: "", value: "" },
                                          ...projectDetails["Zone"].map(
                                              (d) => ({
                                                  label:
                                                      d.value +
                                                      (d.name
                                                          ? ` (${d.name})`
                                                          : ""),
                                                  value: d.value,
                                              })
                                          ),
                                      ]
                                    : []
                            }
                        />

                        <RHFMuiSelect
                            label="Level (Optional)"
                            name="document_level"
                            fullWidth
                            options={
                                projectDetails["Level"]
                                    ? [
                                          { label: "", value: "" },
                                          ...projectDetails["Level"].map(
                                              (d) => ({
                                                  label:
                                                      d.value +
                                                      (d.name
                                                          ? ` (${d.name})`
                                                          : ""),
                                                  value: d.value,
                                              })
                                          ),
                                      ]
                                    : []
                            }
                        />
                    </Stack>
                    <Stack
                        direction={{ xs: "column", md: "row" }}
                        spacing={3}
                        sx={{ width: 1 }}
                    >
                        <RHFTextField
                            disabled
                            name="sequence_no"
                            label="Squence No."
                            fullWidth
                        />
                        <Box width={1} />
                        <Box width={1} />
                    </Stack>
                </Stack>
            </Stack>

            <Divider sx={{ my: 3, borderStyle: "dashed" }} />
        </Box>
    );
};

export default TrainingProjectDetails;
