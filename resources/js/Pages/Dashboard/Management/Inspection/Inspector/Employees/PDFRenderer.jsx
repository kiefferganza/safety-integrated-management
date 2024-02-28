import { useRenderPDF } from "@/hooks/useRenderPDF";
import Iconify from "@/Components/iconify";
// MUI
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";

export default function ({ dataPDF, filterDate, open, onClose }) {
    const { url, loading, error } = useRenderPDF(
        {
            pdf_type: "inspectors_view",
            data: dataPDF,
            filterDate,
        },
        [dataPDF, filterDate]
    );
    const src = url ? `${url}#toolbar=1` : null;

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
                    <Tooltip title="Close">
                        <IconButton color="inherit" onClick={onClose}>
                            <Iconify icon="eva:close-fill" />
                        </IconButton>
                    </Tooltip>
                </DialogActions>

                <Box sx={{ flexGrow: 1, height: "100%", overflow: "hidden" }}>
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
                </Box>
            </Box>
        </Dialog>
    );
}
