import PropTypes from "prop-types";
import { useState } from "react";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
// @mui
import {
    Box,
    Stack,
    Dialog,
    Tooltip,
    IconButton,
    DialogActions,
    CircularProgress,
} from "@mui/material";
// components
import Iconify from "@/Components/iconify";
//
// import InspectionPDF from "./InspectionPDF";
import { useRenderPDF } from "@/hooks/useRenderPDF";

// ----------------------------------------------------------------------

InspectionToolbar.propTypes = {
    inspection: PropTypes.object,
    cms: PropTypes.string,
};

export default function InspectionToolbar({
    inspection,
    cms,
    reports,
    findings,
    rolloutDate,
}) {
    const { url, loading, error } = useRenderPDF({
        path: "../../sections/@dashboard/inspection/details/PDF",
        inspection,
        cms,
        reports,
        findings,
        rolloutDate,
        logo: route("image", { path: "media/logo/Fiafi-logo.png" }),
    });
    const src = url ? `${url}#toolbar=1` : null;

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    if (error) {
        console.log({ error });
        return (
            <div>
                <h3>Something went wrong!</h3>
                {/* {JSON.stringify(error)} */}
            </div>
        );
    }
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

                    {loading ? (
                        <IconButton>
                            <CircularProgress size={18} color="inherit" />
                        </IconButton>
                    ) : (
                        <PDFDownloadLink
                            document={
                                <iframe
                                    src={src}
                                    style={{ height: "100%", width: "100%" }}
                                />
                            }
                            fileName={cms !== "N/A" ? cms : "Toolbox Talk"}
                            style={{ textDecoration: "none" }}
                        >
                            {({ loading }) => (
                                <Tooltip title="Download">
                                    <IconButton>
                                        {loading ? (
                                            <CircularProgress
                                                size={22}
                                                color="inherit"
                                            />
                                        ) : (
                                            <Iconify icon="eva:download-fill" />
                                        )}
                                    </IconButton>
                                </Tooltip>
                            )}
                        </PDFDownloadLink>
                    )}

                    <Tooltip title="Print">
                        <IconButton onClick={handleOpen}>
                            <Iconify icon="eva:printer-fill" />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Send">
                        <IconButton>
                            <Iconify icon="ic:round-send" />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Share">
                        <IconButton>
                            <Iconify icon="eva:share-fill" />
                        </IconButton>
                    </Tooltip>
                </Stack>
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
                        {loading ? (
                            <IconButton>
                                <CircularProgress size={18} color="inherit" />
                            </IconButton>
                        ) : (
                            <iframe
                                src={src}
                                style={{ height: "100%", width: "100%" }}
                            />
                        )}
                        {/* <PDFViewer
                            width="100%"
                            height="100%"
                            style={{ border: "none" }}
                        >
                            <InspectionPDF
                                inspection={inspection}
                                reports={reports}
                                cms={cms}
                                findings={findings}
                                rolloutDate={rolloutDate}
                            />
                        </PDFViewer> */}
                    </Box>
                </Box>
            </Dialog>
        </>
    );
}
