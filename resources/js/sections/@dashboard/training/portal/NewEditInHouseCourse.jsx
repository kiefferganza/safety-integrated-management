import { useCallback } from "react";
import PropTypes from "prop-types";
import {
    Stack,
    Dialog,
    Button,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    FormHelperText,
} from "@mui/material";
import { useFormContext } from "react-hook-form";
import { RHFTextField } from "@/Components/hook-form";
import { MultiFilePreview, Upload } from "@/Components/upload";

const NewEditInHouseCourse = ({
    title = "Add In House Course",
    open,
    onClose,
    //
    onCreate,
    onUpdate,
    ...other
}) => {
    const {
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isDirty },
    } = useFormContext();
    const attachedFile = watch("attached_file");

    const handleUploadFile = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];

        if (file) {
            setValue("attached_file", file, {
                shouldValidate: true,
                shouldDirty: true,
            });
        }
    }, []);

    const handleRemoveFile = () => {
        setValue("attached_file", null, {
            shouldValidate: true,
            shouldDirty: true,
        });
    };

    return (
        <Dialog
            fullWidth
            maxWidth="sm"
            open={open}
            onClose={onClose}
            {...other}
        >
            <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}>
                {" "}
                {title}{" "}
            </DialogTitle>

            <DialogContent dividers sx={{ pt: 1, pb: 0, border: "none" }}>
                <Stack spacing={1}>
                    {(onCreate || onUpdate) && (
                        <Stack gap={1.5} alignItems="center">
                            <RHFTextField
                                name="course_name"
                                label="Course name"
                                fullWidth
                            />
                            <RHFTextField
                                name="acronym"
                                label="Abbreviation"
                                fullWidth
                            />
                            <Upload
                                error={!!errors?.attached_file?.message}
                                onDrop={handleUploadFile}
                            />
                            {errors?.attached_file?.message && (
                                <FormHelperText error>
                                    {errors.attached_file.message}
                                </FormHelperText>
                            )}
                            {attachedFile && (
                                <MultiFilePreview
                                    sx={{ width: 1 }}
                                    files={[attachedFile]}
                                    onRemove={handleRemoveFile}
                                />
                            )}
                        </Stack>
                    )}
                </Stack>
            </DialogContent>

            <DialogActions>
                {(onCreate || onUpdate) && (
                    <Stack
                        direction="row"
                        justifyContent="flex-end"
                        flexGrow={1}
                    >
                        <Button
                            disabled={onUpdate ? !isDirty : false}
                            variant="soft"
                            onClick={handleSubmit(onCreate || onUpdate)}
                        >
                            {onUpdate ? "Save" : "Create"}
                        </Button>
                    </Stack>
                )}
            </DialogActions>
        </Dialog>
    );
};

NewEditInHouseCourse.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    title: PropTypes.string,
    onCreate: PropTypes.func,
    onUpdate: PropTypes.func,
};

export default NewEditInHouseCourse;
