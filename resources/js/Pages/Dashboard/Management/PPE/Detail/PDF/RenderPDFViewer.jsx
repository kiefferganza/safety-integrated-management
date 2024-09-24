import {
    Box,
    Dialog,
    Tooltip,
    IconButton,
    DialogActions,
    CircularProgress,
    Typography,
    Button,
} from "@mui/material";
import { useRenderPDF } from "@/hooks/useRenderPDF";
import Iconify from "@/Components/iconify";
import { useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { LoadingButton } from "@mui/lab";
import { PDF } from "./PDF";

export default function RenderedPDFViewer({ showToolbar = true, props = {} }) {
    const { url, loading, error } = useRenderPDF({
        pdf_type: "ppe_view",
        ...props,
    });

    const src = url ? `${url}#toolbar=${showToolbar ? 1 : 0}` : null;

    const [openPDF, setOpenPDF] = useState(false);

    const handleClose = () => {
        setOpenPDF(false);
    };

    if (error) {
        console.log({ error });
        return (
            <Box sx={{ flexGrow: 1, height: "100%", overflow: "hidden" }}>
                <h2>Something went wrong!</h2>
            </Box>
        );
    }

    return (
        <>
            <Button
                variant="outlined"
                startIcon={<Iconify icon="eva:eye-fill" />}
                onClick={() => {
                    setOpenPDF(true);
                }}
            >
                View PDF
            </Button>
            <PDFDownloadLink
                document={<PDF inventory={props.inventory} />}
                fileName={props.inventory.item}
                style={{ textDecoration: "none" }}
            >
                {({ loading }) =>
                    loading ? (
                        <LoadingButton loading />
                    ) : (
                        <Button
                            variant="outlined"
                            startIcon={<Iconify icon="eva:printer-fill" />}
                            onClick={() => {
                                setOpenPDF(true);
                            }}
                        >
                            Download PDF
                        </Button>
                    )
                }
            </PDFDownloadLink>
            <Dialog fullScreen open={openPDF}>
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
                            <Box
                                height={1}
                                width={1}
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                justifyContent="center"
                                color="gray"
                            >
                                <CircularProgress size={32} color="inherit" />
                                <Typography
                                    variant="caption"
                                    color="gray"
                                    sx={{ mt: 1 }}
                                >
                                    Generating PDF...
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
        </>
    );
}
