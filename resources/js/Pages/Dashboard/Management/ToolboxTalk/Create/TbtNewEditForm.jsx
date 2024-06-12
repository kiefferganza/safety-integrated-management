import { Suspense, useState } from "react";
import LoadingScreen from "@/Components/loading-screen";
import ToolboxTalkNewEditForm from "@/sections/@dashboard/toolboxtalks/form/ToolboxTalkNewEditForm";
import {
    Avatar,
    Box,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Skeleton,
    Stack,
    Typography,
} from "@mui/material";
import { fDate } from "@/utils/formatTime";
import { format } from "date-fns";
import Iconify from "@/Components/iconify";

const TYPE_OPTIONS = {
    1: "Civil",
    2: "Electrical",
    3: "Mechanical",
    4: "Workshop",
    5: "Office",
};

const TbtNewEditForm = ({ projectDetails, tracker, loading }) => {
    const [openDialog, setOpenDialog] = useState(true);
    const [selectedTbt, setSelectedTbt] = useState(undefined);

    const handleSelectTracker = (t) => () => {
        setSelectedTbt({
            location: t.location,
            tbt_type: t.tbt_type,
            date_conducted: format(
                new Date(t.tracker.date_assigned),
                "yyyy-MM-dd 00:00:00"
            ),
            conducted_by: t.emp_id,
            project_code: t.tracker.project_code,
            originator: t.tracker.originator,
            discipline: t.tracker.discipline,
            document_type: "TBT",
        });
        setOpenDialog(false);
    };

    return (
        <Suspense fallback={<LoadingScreen />}>
            <Dialog
                open={openDialog}
                disableEscapeKeyDown
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>Select Item</DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={() => window.history.back()}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <Iconify
                        icon="material-symbols:close"
                        sx={{ color: "text.disabled" }}
                    />
                </IconButton>
                <DialogContent sx={{ width: 1 }}>
                    <Box pb={3}>
                        {loading ? (
                            <Stack gap={1.5}>
                                <Skeleton
                                    variant="rounded"
                                    width="100%"
                                    height={36}
                                />
                                <Skeleton
                                    variant="rounded"
                                    width="100%"
                                    height={36}
                                />
                                <Skeleton
                                    variant="rounded"
                                    width="100%"
                                    height={36}
                                />
                            </Stack>
                        ) : !!tracker && tracker?.length > 0 ? (
                            <List>
                                {tracker.map((t) => (
                                    <ListItem
                                        alignItems="flex-start"
                                        key={t.id}
                                        divider
                                        disablePadding
                                    >
                                        <ListItemButton
                                            onClick={handleSelectTracker(t)}
                                        >
                                            <ListItemAvatar>
                                                <Avatar
                                                    alt={
                                                        t.tracker.employee
                                                            .fullname
                                                    }
                                                    src={t.tracker.employee.img}
                                                />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    t.tracker.employee.fullname
                                                }
                                                secondaryTypographyProps={{
                                                    component: "div",
                                                }}
                                                secondary={
                                                    <Stack>
                                                        <Typography
                                                            color="text.primary"
                                                            sx={{
                                                                display:
                                                                    "inline",
                                                            }}
                                                            variant="body2"
                                                        >
                                                            Location -{" "}
                                                            <Typography
                                                                variant="body2"
                                                                sx={{
                                                                    display:
                                                                        "inline",
                                                                }}
                                                                color="text.secondary"
                                                                component="span"
                                                            >
                                                                {t.location}
                                                            </Typography>
                                                        </Typography>
                                                        <Typography
                                                            color="text.primary"
                                                            sx={{
                                                                display:
                                                                    "inline",
                                                            }}
                                                            variant="body2"
                                                        >
                                                            Date -{" "}
                                                            <Typography
                                                                variant="body2"
                                                                sx={{
                                                                    display:
                                                                        "inline",
                                                                }}
                                                                color="text.secondary"
                                                                component="span"
                                                            >
                                                                {fDate(
                                                                    new Date(
                                                                        t.tracker.date_assigned
                                                                    )
                                                                )}
                                                            </Typography>
                                                        </Typography>
                                                        <Typography
                                                            color="text.primary"
                                                            sx={{
                                                                display:
                                                                    "inline",
                                                            }}
                                                            variant="body2"
                                                        >
                                                            TBT Type -{" "}
                                                            <Typography
                                                                variant="body2"
                                                                sx={{
                                                                    display:
                                                                        "inline",
                                                                }}
                                                                color="text.secondary"
                                                                component="span"
                                                            >
                                                                {
                                                                    TYPE_OPTIONS[
                                                                        t
                                                                            .tbt_type
                                                                    ]
                                                                }
                                                            </Typography>
                                                        </Typography>
                                                    </Stack>
                                                }
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Typography
                                variant="body2"
                                color="GrayText"
                                textAlign="center"
                            >
                                No Assigned TBT
                            </Typography>
                        )}
                    </Box>
                </DialogContent>
            </Dialog>
            {!!selectedTbt && (
                <ToolboxTalkNewEditForm
                    projectDetails={projectDetails}
                    tbt={selectedTbt}
                />
            )}
        </Suspense>
    );
};

export default TbtNewEditForm;
