import { Suspense, useCallback, useState } from "react";
import LoadingScreen from "@/Components/loading-screen";
import ToolboxTalkNewEditForm from "@/sections/@dashboard/toolboxtalks/form/ToolboxTalkNewEditForm";
import {
    Avatar,
    Box,
    Collapse,
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

    const handleSelectTracker = useCallback(
        (t) => () => {
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
        },
        [tracker]
    );

    const handleManual = () => {
        setSelectedTbt(null);
        setOpenDialog(false);
    };

    const handleClose = () => {
        window.history.back();
    };

    return (
        <Suspense fallback={<LoadingScreen />}>
            <Dialog
                open={openDialog}
                disableEscapeKeyDown
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Select Assigned TBT</DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
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
                                    height={57}
                                />
                                <Skeleton
                                    variant="rounded"
                                    width="100%"
                                    height={57}
                                />
                                <Skeleton
                                    variant="rounded"
                                    width="100%"
                                    height={57}
                                />
                            </Stack>
                        ) : (
                            <>
                                <List>
                                    <ListItemButton onClick={handleManual}>
                                        <ListItemText primary="Create TBT Manually" />
                                    </ListItemButton>
                                </List>
                                {!!tracker && tracker?.length > 0 && (
                                    <List>
                                        {tracker.map((t) => (
                                            <TrackerListItem
                                                t={t}
                                                handleSelectTracker={handleSelectTracker(
                                                    t
                                                )}
                                                key={t.id}
                                            />
                                        ))}
                                    </List>
                                )}
                            </>
                        )}
                    </Box>
                </DialogContent>
            </Dialog>
            {selectedTbt !== undefined && (
                <ToolboxTalkNewEditForm
                    projectDetails={projectDetails}
                    tbt={selectedTbt}
                />
            )}
        </Suspense>
    );
};

function TrackerListItem({ t, handleSelectTracker }) {
    const [open, setOpen] = useState(false);

    function handleToggle(e) {
        e.preventDefault();
        e.stopPropagation();
        setOpen((isOpen) => !isOpen);
    }

    return (
        <ListItem
            alignItems="flex-start"
            divider
            disablePadding
            sx={{ width: 1, flexDirection: "column" }}
        >
            <ListItemButton onClick={handleSelectTracker} sx={{ width: 1 }}>
                <ListItemAvatar>
                    <Avatar
                        alt={t.tracker.employee.fullname}
                        src={t.tracker.employee.img}
                    />
                </ListItemAvatar>
                <ListItemText
                    primary={
                        <span>
                            {t.tracker.employee.fullname} -{" "}
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                component="span"
                                fontWeight={600}
                            >
                                {fDate(new Date(t.tracker.date_assigned))}
                            </Typography>
                        </span>
                    }
                    secondaryTypographyProps={{
                        component: "div",
                    }}
                />
                {open ? (
                    <IconButton onClick={handleToggle}>
                        <Iconify
                            icon="mdi:chevron-up"
                            sx={{ color: "text.disabled" }}
                        />
                    </IconButton>
                ) : (
                    <IconButton onClick={handleToggle}>
                        <Iconify
                            icon="mdi:chevron-down"
                            sx={{ color: "text.disabled" }}
                        />
                    </IconButton>
                )}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List disablePadding sx={{ listStyle: "circle" }}>
                    <ListItem
                        sx={{
                            pl: 4,
                            listStyleType: "circle",
                            flexDirection: "column",
                            alignItems: "baseline",
                        }}
                    >
                        <ListItemText
                            primaryTypographyProps={{
                                sx: {
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                },
                                component: "div",
                            }}
                            primary={
                                <>
                                    <Iconify icon="mdi:dot" />
                                    <span>Location:</span>
                                    <Typography
                                        sx={{
                                            display: "inline",
                                        }}
                                        color="text.secondary"
                                        component="span"
                                    >
                                        {t.location}
                                    </Typography>
                                </>
                            }
                        />
                        <ListItemText
                            primaryTypographyProps={{
                                sx: {
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                },
                                component: "div",
                            }}
                            primary={
                                <>
                                    <Iconify icon="mdi:dot" />
                                    <span>TBT Type:</span>
                                    <Typography
                                        sx={{
                                            display: "inline",
                                        }}
                                        color="text.secondary"
                                        component="span"
                                    >
                                        {TYPE_OPTIONS[t.tbt_type]}
                                    </Typography>
                                </>
                            }
                        />
                    </ListItem>
                </List>
            </Collapse>
        </ListItem>
    );
}

export default TbtNewEditForm;
