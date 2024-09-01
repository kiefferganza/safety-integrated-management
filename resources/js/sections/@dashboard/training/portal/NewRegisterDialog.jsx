import PropTypes from "prop-types";
import {
    Stack,
    Dialog,
    Button,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Divider,
} from "@mui/material";
import Iconify from "@/Components/iconify";
import { useFieldArray, useFormContext } from "react-hook-form";
import { RHFTextField } from "@/Components/hook-form";

const NewRegisterDialog = ({
    title = "Add Course",
    open,
    onClose,
    //
    onCreate,
    onUpdate,
    ...other
}) => {
    const { control, handleSubmit } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "courseItem",
    });

    const handleAdd = () => append({ courseItem: "", acronym: "" });

    const handleRemove = (index) => {
        remove(index);
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
                    <Stack
                        spacing={1.5}
                        divider={<Divider sx={{ borderStyle: "dashed" }} />}
                    >
                        {(onCreate || onUpdate) &&
                            fields.map((item, index) => (
                                <Stack
                                    key={item.id}
                                    flexDirection="row"
                                    alignItems="center"
                                >
                                    <Stack width={1} gap={1.5}>
                                        <RHFTextField
                                            name={`courseItem[${index}].course_name`}
                                            label="Course name"
                                            fullWidth
                                        />
                                        <RHFTextField
                                            name={`courseItem[${index}].acronym`}
                                            label="Abbreviation"
                                            fullWidth
                                        />
                                    </Stack>
                                    {onCreate && (
                                        <Button
                                            size="small"
                                            color="error"
                                            startIcon={
                                                <Iconify icon="eva:trash-2-outline" />
                                            }
                                            onClick={() => handleRemove(index)}
                                            sx={{ ml: 1.5 }}
                                        >
                                            Remove
                                        </Button>
                                    )}
                                </Stack>
                            ))}
                    </Stack>
                    {onCreate && (
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Button
                                size="small"
                                startIcon={<Iconify icon="eva:plus-fill" />}
                                onClick={handleAdd}
                            >
                                Add Item
                            </Button>
                        </Box>
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

NewRegisterDialog.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    title: PropTypes.string,
    onCreate: PropTypes.func,
    onUpdate: PropTypes.func,
};

export default NewRegisterDialog;
