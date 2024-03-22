import { useRenderPDF } from "@/hooks/useRenderPDF";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Iconify from "@/Components/iconify";
// MUI
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

export default function ({ dataPDF, open, onClose }) {
    const { url, loading, error } = useRenderPDF(
        {
            pdf_type: "tbt_tracker",
            data: dataPDF,
            logo: route("image", { path: "media/logo/Fiafi-logo.png" }),
        },
        [dataPDF]
    );
    const src = url ? `${url}#toolbar=0&zoom=150` : null;

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
                    <Stack direction="row" gap={1.5}>
                        {loading && !src ? (
                            <Box
                                p={1}
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <CircularProgress size={18} color="inherit" />
                            </Box>
                        ) : (
                            <PDFDownloadLink
                                document={
                                    <iframe
                                        src={src}
                                        style={{
                                            height: "100%",
                                            width: "100%",
                                        }}
                                    />
                                }
                                fileName={"Toolbox Talk Tracker"}
                                style={{ color: "inherit" }}
                            >
                                <Tooltip title="Download PDF">
                                    <IconButton color="inherit">
                                        <Iconify icon="eva:download-fill" />
                                    </IconButton>
                                </Tooltip>
                            </PDFDownloadLink>
                        )}
                        <Tooltip title="Close">
                            <IconButton color="inherit" onClick={onClose}>
                                <Iconify icon="eva:close-fill" />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </DialogActions>

                <Box sx={{ flexGrow: 1, height: "100%", overflow: "hidden" }}>
                    {loading ? (
                        <Box
                            sx={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <CircularProgress size={40} color="primary" />
                            <Typography
                                variant="subtitle2"
                                mt={1}
                                color="GrayText"
                            >
                                Loading...
                            </Typography>
                        </Box>
                    ) : (
                        <iframe
                            src={src}
                            style={{ height: "100%", width: "100%" }}
                        />
                    )}
                </Box>
            </Box>
        </Dialog>
    );
}
