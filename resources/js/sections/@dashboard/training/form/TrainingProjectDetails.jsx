// @mui
import { Box, Stack, Divider, Typography } from "@mui/material";
// components
import { RHFMuiSelect, RHFSelect, RHFTextField } from "@/Components/hook-form";
import { useFormContext } from "react-hook-form";

// ----------------------------------------------------------------------

const TYPE_OPTIONS = [
    { type: 2, label: "Client" },
    { type: 3, label: "External" },
    // { type: 4, label: 'Induction' },
];

const TrainingProjectDetails = ({ isEdit, sequences, projectDetails }) => {
    const { setValue } = useFormContext();

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
                <RHFSelect
                    disabled={isEdit}
                    size="small"
                    name="type"
                    label="Course Type"
                    sx={{ width: { xs: "100%", md: 140 } }}
                    onChange={(e) => {
                        setValue("type", e.target.value, {
                            shoudValidate: true,
                        });
                        setValue("sequence_no", sequences[e.target.value]);
                    }}
                >
                    <option value=""></option>
                    {TYPE_OPTIONS.map((option) => (
                        <option key={option.type} value={option.type}>
                            {option.label}
                        </option>
                    ))}
                </RHFSelect>
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
