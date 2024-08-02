import { useState } from "react";
const { PDFDownloadLink, PDFViewer } = await import("@react-pdf/renderer");
// @mui
const {
    Box,
    Stack,
    Dialog,
    Tooltip,
    IconButton,
    DialogActions,
    CircularProgress,
} = await import("@mui/material");
// components
import Iconify from "@/Components/iconify";
import Label from "@/Components/label";
import { sentenceCase } from "change-case";
import { useDateRangePicker } from "@/Components/date-range-picker";
import PpePDF from "./PpePDF";

const PpeReportDetailToolbar = ({ inventoryReport }) => {
    const { shortLabel } = useDateRangePicker(
        new Date(inventoryReport.inventory_start_date),
        new Date(inventoryReport.inventory_end_date)
    );

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const getStatusColor = (status) => {
        let statusColor = "warning";
        switch (status) {
            case "for_review":
                statusColor = "warning";
                break;
            case "for_approval":
                statusColor = "info";
                break;
            case "approved":
            case "closed":
                statusColor = "success";
                break;
            case "fail":
                statusColor = "error";
                break;
            default:
                break;
        }
        return statusColor;
    };

    return (
        <>
            <Stack
                spacing={2}
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ sm: "center" }}
                sx={{ mb: 5 }}
            >
                <Stack direction="row" spacing={1}>
                    <Tooltip title="View">
                        <IconButton onClick={handleOpen}>
                            <Iconify icon="eva:eye-fill" />
                        </IconButton>
                    </Tooltip>

                    <PDFDownloadLink
                        document={
                            <PpePDF
                                report={{ ...inventoryReport, shortLabel }}
                                title={inventoryReport.form_number}
                            />
                        }
                        fileName={inventoryReport.form_number}
                        style={{ textDecoration: "none" }}
                    >
                        {({ loading }) => (
                            <Tooltip title="Download">
                                <IconButton>
                                    {loading ? (
                                        <CircularProgress
                                            size={24}
                                            color="inherit"
                                        />
                                    ) : (
                                        <Iconify icon="eva:download-fill" />
                                    )}
                                </IconButton>
                            </Tooltip>
                        )}
                    </PDFDownloadLink>

                    <Tooltip title="Print">
                        <IconButton onClick={handleOpen}>
                            <Iconify icon="eva:printer-fill" />
                        </IconButton>
                    </Tooltip>
                </Stack>
                <Label
                    variant="soft"
                    color={getStatusColor(inventoryReport.status)}
                    sx={{ textTransform: "capitalize" }}
                >
                    {sentenceCase(inventoryReport.status)}
                </Label>
            </Stack>

            <Dialog fullScreen open={open}>
                <Box
                    sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <DialogActions
                        sx={{
                            zIndex: 9,
                            padding: "12px !important",
                            boxShadow: (theme) => theme.customShadows.z8,
                        }}
                    >
                        <Tooltip title="Close">
                            <IconButton color="inherit" onClick={handleClose}>
                                <Iconify icon="eva:close-fill" />
                            </IconButton>
                        </Tooltip>
                    </DialogActions>

                    <Box
                        sx={{ flexGrow: 1, height: "100%", overflow: "hidden" }}
                    >
                        <PDFViewer
                            width="100%"
                            height="100%"
                            style={{ border: "none" }}
                        >
                            <PpePDF
                                report={{ ...inventoryReport, shortLabel }}
                                title={inventoryReport.form_number}
                            />
                        </PDFViewer>
                    </Box>
                </Box>
            </Dialog>
        </>
    );
};

export default PpeReportDetailToolbar;
