import {
    Box,
    Dialog,
    Tooltip,
    IconButton,
    DialogActions,
    CircularProgress,
    Typography,
} from "@mui/material";
import { useRenderPDF } from "@/hooks/useRenderPDF";
import Iconify from "@/Components/iconify";

export default function RenderedPDFViewer({
    showToolbar = true,
    open = false,
    title = "",
    author = "",
    description = "",
    props = {},
    handleClose,
}) {
    const { url, loading, error } = useRenderPDF({
        title,
        author,
        description,
        pdf_type: "employee_list",
        ...props,
    });

    const src = url ? `${url}#toolbar=${showToolbar ? 1 : 0}` : null;

    if (error) {
        console.log({ error });
        return (
            <div className={className} style={style}>
                <h2>Something went wrong!</h2>
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
                    <Tooltip title="Close">
                        <IconButton color="inherit" onClick={handleClose}>
                            <Iconify icon="eva:close-fill" />
                        </IconButton>
                    </Tooltip>
                </DialogActions>

                <Box sx={{ flexGrow: 1, height: "100%", overflow: "hidden" }}>
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
    );
}
