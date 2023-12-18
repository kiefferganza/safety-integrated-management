import { useCallback, useEffect, useState } from "react";
import { usePage } from "@inertiajs/inertia-react";
// form
import { useFieldArray, useFormContext } from "react-hook-form";
// @mui
import {
    Box,
    Stack,
    Button,
    Divider,
    Typography,
    TextField,
    Autocomplete,
    FormHelperText,
} from "@mui/material";
// components
import { RHFMuiSelect, RHFTextField } from "@/Components/hook-form";
import DateRangePicker, {
    useDateRangePicker,
} from "@/Components/date-range-picker";
import Iconify from "@/Components/iconify";
import TrainingEmployeeDialog from "./TrainingEmployeeDialog";
import TrainingParticipantTable from "./TrainingParticipantTable";
import { format } from "date-fns";
import { MultiFilePreview, Upload } from "@/Components/upload";

// ----------------------------------------------------------------------

const TrainingNewEditDetails = ({
    currentTraining,
    isEdit,
    projectDetails,
}) => {
    const {
        auth: { user },
        personel,
        courses = [],
    } = usePage().props;
    const [openParticipants, setOpenParticipants] = useState(false);
    const {
        control,
        setValue,
        watch,
        formState: { errors },
    } = useFormContext();

    const { append, fields, remove } = useFieldArray({
        control,
        name: "trainees",
    });

    const values = watch();

    const {
        startDate,
        endDate,
        onChangeStartDate,
        onChangeEndDate,
        open: openPicker,
        onOpen: onOpenPicker,
        onClose: onClosePicker,
        isSelected: isSelectedValuePicker,
        isError,
        shortLabel,
        setStartDate,
        setEndDate,
    } = useDateRangePicker();

    useEffect(() => {
        if (
            currentTraining &&
            isEdit &&
            currentTraining?.training_date &&
            currentTraining?.date_expired
        ) {
            setStartDate(new Date(currentTraining?.training_date));
            setEndDate(new Date(currentTraining?.date_expired));
        }
    }, [currentTraining]);

    const handleChangeStartDate = (newValue) => {
        onChangeStartDate(newValue);
    };

    const handleChangeEndDate = (newValue) => {
        onChangeEndDate(newValue);
    };

    const handleCloseDate = () => {
        if (!isError && startDate && endDate) {
            setValue(
                "training_date",
                format(startDate, "yyyy-MM-dd HH:mm:ss"),
                { shouldValidate: true, shouldDirty: true }
            );
            setValue("date_expired", format(endDate, "yyyy-MM-dd HH:mm:ss"), {
                shouldValidate: true,
                shouldDirty: true,
            });
        }
        onClosePicker();
    };

    const handleOpenParticipants = () => {
        setOpenParticipants(true);
    };

    const handleCloseParticipants = () => {
        setOpenParticipants(false);
    };

    const isSelected = (selectedId) =>
        fields.findIndex((tr) => tr?.emp_id === selectedId) !== -1;

    const handleRemoveParticipants = (idx) => {
        remove(idx);
    };

    const handleUploadFile = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];

        if (file) {
            setValue("attachment", file, {
                shouldValidate: true,
                shouldDirty: true,
            });
        }
    }, []);

    const handleRemoveFile = () => {
        setValue("attachment", null, {
            shouldValidate: true,
            shouldDirty: true,
        });
    };

    return (
        <Box sx={{ p: 3 }}>
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 3 }}
            >
                <Typography variant="h6" sx={{ color: "text.disabled", mb: 3 }}>
                    Course Details
                </Typography>
                <Box>
                    <Button
                        variant="soft"
                        color={
                            !!errors?.training_date?.message ||
                            !!errors?.date_expired?.message
                                ? "error"
                                : "inherit"
                        }
                        sx={{
                            textTransform: "unset",
                            color: "text.secondary",
                            width: { xs: 1, md: 240 },
                            height: 1,
                            justifyContent: "flex-start",
                            fontWeight: "fontWeightMedium",
                            ...(isSelectedValuePicker && {
                                color: "text.primary",
                            }),
                        }}
                        startIcon={<Iconify icon="eva:calendar-fill" />}
                        onClick={onOpenPicker}
                    >
                        {isSelectedValuePicker
                            ? shortLabel
                            : "Training Date Range"}
                    </Button>
                </Box>
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
                            name="title"
                            label="Course Title"
                            fullWidth
                            options={courses.map((c) => ({
                                label: c.course_name,
                                value: c.id,
                                disabled:
                                    c.last_used !== null &&
                                    user.user_type !== 0,
                            }))}
                        />

                        <RHFMuiSelect
                            label="Contract No."
                            name="contract_no"
                            fullWidth
                            options={
                                projectDetails["Contract No."]
                                    ? [
                                          { label: "", value: "" },
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

                        <RHFMuiSelect
                            label="Training Location"
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
                    </Stack>

                    <Stack
                        direction={{ xs: "column", md: "row" }}
                        spacing={3}
                        sx={{ width: 1 }}
                    >
                        <Autocomplete
                            clearOnEscape
                            name="trainer"
                            options={personel}
                            fullWidth
                            freeSolo
                            inputValue={values.trainer}
                            getOptionLabel={(option, value) =>
                                `${option?.firstname} ${option?.lastname}`
                            }
                            renderOption={(props, option) => {
                                return (
                                    <li {...props} key={option.employee_id}>
                                        {`${option?.firstname} ${option?.lastname}`}
                                    </li>
                                );
                            }}
                            onInputChange={(event) => {
                                if (event?.type === "change") {
                                    setValue("trainer", event.target.value, {
                                        shouldValidate: true,
                                        shouldDirty: true,
                                    });
                                } else {
                                    setValue("trainer", "", {
                                        shouldValidate: true,
                                        shouldDirty: true,
                                    });
                                }
                            }}
                            onChange={(_event, newValue) => {
                                if (newValue) {
                                    setValue(
                                        "trainer",
                                        `${newValue?.firstname} ${newValue?.lastname}`,
                                        {
                                            shouldValidate: true,
                                            shouldDirty: true,
                                        }
                                    );
                                } else {
                                    setValue("trainer", "", {
                                        shouldValidate: true,
                                        shouldDirty: true,
                                    });
                                }
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Conducted by:"
                                    value={values.trainer}
                                    error={!!errors?.trainer?.message}
                                    helperText={errors?.trainer?.message || ""}
                                />
                            )}
                        />

                        <RHFTextField
                            name="training_hrs"
                            label="Training Hours"
                            type="number"
                            fullWidth
                        />

                        <Box width={1} />
                    </Stack>

                    <Divider flexItem sx={{ borderStyle: "dashed" }} />

                    <Stack spacing={3} sx={{ width: 1 }}>
                        <Typography variant="subtitle2">Attach File</Typography>
                        <Upload
                            error={errors?.attachment?.message}
                            onDrop={handleUploadFile}
                        />
                        {errors?.attachment?.message && (
                            <FormHelperText error>
                                {errors.attachment.message}
                            </FormHelperText>
                        )}
                        {values?.attachment && (
                            <MultiFilePreview
                                sx={{ width: 1 }}
                                files={[values.attachment]}
                                onRemove={handleRemoveFile}
                            />
                        )}
                    </Stack>
                </Stack>
            </Stack>

            <Divider sx={{ my: 3, borderStyle: "dashed" }} />
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 3 }}
            >
                <Typography variant="h6" sx={{ color: "text.disabled" }}>
                    Participants
                </Typography>
                <Box>
                    <Button
                        size="small"
                        color={
                            !!errors?.trainees?.message ? "error" : "primary"
                        }
                        startIcon={<Iconify icon="eva:plus-fill" />}
                        onClick={handleOpenParticipants}
                    >
                        Add Participants
                    </Button>
                    {!!errors?.trainees?.message && (
                        <FormHelperText
                            sx={{ color: (theme) => theme.palette.error.main }}
                        >
                            {errors.trainees.message}
                        </FormHelperText>
                    )}
                </Box>
            </Stack>

            <Stack
                divider={<Divider flexItem sx={{ borderStyle: "dashed" }} />}
                spacing={3}
                sx={{ paddingX: { xs: 0, md: 8 } }}
            >
                <TrainingParticipantTable
                    trainees={fields}
                    handleRemove={handleRemoveParticipants}
                />
            </Stack>

            <DateRangePicker
                variant="calendar"
                startDate={startDate}
                endDate={endDate}
                onChangeStartDate={handleChangeStartDate}
                onChangeEndDate={handleChangeEndDate}
                open={openPicker}
                onClose={handleCloseDate}
                isSelected={isSelectedValuePicker}
                isError={isError}
            />
            <TrainingEmployeeDialog
                open={openParticipants}
                onClose={handleCloseParticipants}
                selected={isSelected}
                personelOptions={personel}
                trainees={values.trainees}
                append={append}
                fields={fields}
                remove={remove}
            />
        </Box>
    );
};

export default TrainingNewEditDetails;
