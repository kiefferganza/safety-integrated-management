import PropTypes from "prop-types";
import {
    Stack,
    Dialog,
    Button,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const NewAuthorizedPosition = ({
    title = "Add Position",
    open,
    onClose,
    positions = [],
    authorizedPositions = [],
    //
    onCreate,
    ...other
}) => {
    const { control, handleSubmit } = useFormContext();
    const { replace } = useFieldArray({
        control,
        name: "positionItem",
        rules: {
            required: "Please add atleast one position.",
        },
    });

    const [ids, setIds] = useState([]);

    useEffect(() => {
        setIds(authorizedPositions.map((p) => p.position_id));
    }, []);

    const handleChange = (e) => {
        const { value } = e.target;
        const val = typeof value === "string" ? value.split(",") : value;
        setIds(val);
        if (val) {
            const values = positions.filter((p) => val.includes(p.position_id));
            replace(values);
        }
    };

    const handleClose = () => {
        setIds(authorizedPositions.map((p) => p.position_id));
        onClose();
    };

    return (
        <Dialog
            fullWidth
            maxWidth="sm"
            open={open}
            onClose={handleClose}
            {...other}
        >
            <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}>
                {title}
            </DialogTitle>

            <DialogContent dividers sx={{ pt: 1, pb: 0, border: "none" }}>
                <FormControl sx={{ width: "100%" }}>
                    <InputLabel id="multiple-position-label">
                        Positions
                    </InputLabel>
                    <Select
                        labelId="multiple-position-label"
                        id="multiple-position"
                        multiple
                        value={ids}
                        onChange={handleChange}
                        input={
                            <OutlinedInput
                                id="select-multiple-position"
                                label="Positions"
                            />
                        }
                        renderValue={(selected) => {
                            return (
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: 0.5,
                                    }}
                                >
                                    {selected.map((value) => (
                                        <Chip
                                            key={value}
                                            label={
                                                positions?.find(
                                                    (p) =>
                                                        p.position_id === value
                                                )?.position
                                            }
                                        />
                                    ))}
                                </Box>
                            );
                        }}
                        MenuProps={{
                            PaperProps: {
                                style: {
                                    maxHeight:
                                        ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                                },
                            },
                        }}
                    >
                        {positions.map((pos) => {
                            return (
                                <MenuItem
                                    key={pos.position_id}
                                    value={pos.position_id}
                                >
                                    {pos.position}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>
            </DialogContent>

            <DialogActions>
                <Stack direction="row" justifyContent="flex-end" flexGrow={1}>
                    <Button variant="soft" onClick={handleSubmit(onCreate)}>
                        Create
                    </Button>
                </Stack>
            </DialogActions>
        </Dialog>
    );
};

NewAuthorizedPosition.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    title: PropTypes.string,
    position: PropTypes.array,
    authorizedPositions: PropTypes.array,
    onCreate: PropTypes.func,
};

export default NewAuthorizedPosition;
