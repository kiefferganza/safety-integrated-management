import {
    RHFMuiMultiSelect,
    RHFMuiSelect,
    RHFTextField,
} from "@/Components/hook-form";
import {
    Autocomplete,
    Box,
    Chip,
    Divider,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { format } from "date-fns";
import useResponsive from "@/hooks/useResponsive";

const InspectionForm = ({ personel, projectDetails, inspectionTracker }) => {
    const isDesktop = useResponsive("up", "sm");
    const [cc, setCC] = useState([]);
    const [time, setTime] = useState(null);
    const [inspDate, setInspDate] = useState(
        inspectionTracker?.inspected_date ?? null
    );
    const {
        setValue,
        watch,
        formState: { errors },
    } = useFormContext();
    const values = watch();

    const handleChangeTime = (val) => {
        setTime(val);
        setValue(
            "inspected_time",
            format(val, "d-MMM-yyyy HH:mm").split(" ")[1],
            { shouldDirty: true, shouldValidate: true }
        );
    };

    const handleChangeDate = (val) => {
        setInspDate(val);
        setValue("inspected_date", format(val, "d-MMM-yyyy"), {
            shouldDirty: true,
            shouldValidate: true,
        });
    };

    const getAutocompleteValue = (id) => {
        const findPerson = personel.find((per) => per.employee_id == id);
        if (findPerson) {
            return `${findPerson.firstname} ${findPerson.lastname}`;
        }
        return null;
    };

    const options = personel.map((option) => ({
        id: option.employee_id,
        label: `${option?.firstname} ${option?.lastname}`,
        user_id: option.user_id,
    }));
    return (
        <Stack
            divider={<Divider flexItem sx={{ borderStyle: "dashed" }} />}
            spacing={3}
        >
            <Stack spacing={3}>
                <Typography variant="h6" sx={{ color: "text.disabled" }}>
                    Project Detail
                </Typography>
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
                                      ...projectDetails["Type"].map((d) => ({
                                          label:
                                              d.value +
                                              (d.name ? ` (${d.name})` : ""),
                                          value: d.value,
                                      })),
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
                                      ...projectDetails["Zone"].map((d) => ({
                                          label:
                                              d.value +
                                              (d.name ? ` (${d.name})` : ""),
                                          value: d.value,
                                      })),
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
                                      ...projectDetails["Level"].map((d) => ({
                                          label:
                                              d.value +
                                              (d.name ? ` (${d.name})` : ""),
                                          value: d.value,
                                      })),
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
                        label="Sequence No."
                    />

                    <Box width={1} />
                    <Box width={1} />
                </Stack>
            </Stack>

            <Stack spacing={3}>
                <Typography variant="h6" sx={{ color: "text.disabled" }}>
                    Inspection Detail
                </Typography>

                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={3}
                    sx={{ width: 1 }}
                >
                    <RHFMuiMultiSelect
                        label="Contract No."
                        name="contract_no"
                        fullWidth
                        options={
                            projectDetails["Contract No."]
                                ? [
                                      ...projectDetails["Contract No."].map(
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

                    <RHFTextField
                        disabled
                        name="inspected_by"
                        label="Inspected By"
                    />

                    <RHFTextField
                        name="accompanied_by"
                        label="Accompanied By"
                    />
                </Stack>

                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={3}
                    sx={{ width: 1 }}
                >
                    <RHFMuiSelect
                        label="Location"
                        name="location"
                        fullWidth
                        options={
                            projectDetails["Location"]
                                ? [
                                      { label: "", value: "" },
                                      ...projectDetails["Location"].map(
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

                    {isDesktop ? (
                        <DesktopDatePicker
                            label="Inspected Date"
                            inputFormat="d-MMM-yyyy"
                            disableMaskedInput
                            value={inspDate}
                            onChange={handleChangeDate}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    fullWidth
                                    error={!!errors?.inspected_date?.message}
                                    helperText={errors?.inspected_date?.message}
                                />
                            )}
                        />
                    ) : (
                        <MobileDatePicker
                            label="Inspected Date"
                            inputFormat="d-MMM-yyyy"
                            value={inspDate}
                            disableMaskedInput
                            onChange={handleChangeDate}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    fullWidth
                                    error={!!errors?.inspected_date?.message}
                                    helperText={errors?.inspected_date?.message}
                                />
                            )}
                        />
                    )}

                    <TimePicker
                        label="Inspected Time"
                        value={time}
                        disableMaskedInput
                        onChange={handleChangeTime}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                readOnly
                                fullWidth
                                error={!!errors?.inspected_time?.message}
                                helperText={errors?.inspected_time?.message}
                            />
                        )}
                    />
                </Stack>
            </Stack>

            <Stack spacing={3}>
                <Typography variant="h6" sx={{ color: "text.disabled" }}>
                    Action & Closeout Details{" "}
                    <Typography variant="caption" fontStyle="italic">
                        (Email Notification)
                    </Typography>
                </Typography>

                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={3}
                    sx={{ width: 1 }}
                >
                    <PersonelAutocomplete
                        value={getAutocompleteValue(values.reviewer_id)}
                        onChange={(_event, newValue) => {
                            if (newValue) {
                                setValue("reviewer_id", newValue.id, {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                });
                            } else {
                                setValue("reviewer_id", "", {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                });
                            }
                        }}
                        options={options.filter((emp) => emp.user_id)}
                        label="Action By"
                        error={errors?.reviewer_id?.message}
                    />

                    <PersonelAutocomplete
                        value={getAutocompleteValue(values.verifier_id)}
                        onChange={(_event, newValue) => {
                            if (newValue) {
                                setValue("verifier_id", newValue.id, {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                });
                            } else {
                                setValue("verifier_id", "", {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                });
                            }
                        }}
                        options={options.filter((emp) => emp.user_id)}
                        label="Verified By"
                        error={errors?.verifier_id?.message}
                    />
                    <Autocomplete
                        multiple
                        freeSolo
                        fullWidth
                        value={cc}
                        onChange={(_event, newValue) => {
                            setCC(newValue);
                        }}
                        options={options}
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                                <Chip
                                    {...getTagProps({ index })}
                                    key={index}
                                    size="small"
                                    label={option?.label || option}
                                />
                            ))
                        }
                        renderInput={(params) => (
                            <TextField label="Add CC" {...params} fullWidth />
                        )}
                    />
                </Stack>
            </Stack>
        </Stack>
    );
};

function PersonelAutocomplete({
    value,
    onChange,
    options,
    label,
    error = "",
    ...others
}) {
    return (
        <Autocomplete
            fullWidth
            value={value}
            onChange={onChange}
            options={options}
            renderOption={(props, option) => {
                return (
                    <li {...props} key={props.id}>
                        {option.label}
                    </li>
                );
            }}
            renderInput={(params) => (
                <TextField
                    label={label}
                    {...params}
                    error={!!error}
                    helperText={error}
                />
            )}
            {...others}
        />
    );
}

export default InspectionForm;
