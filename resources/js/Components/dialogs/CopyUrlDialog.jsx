import { useRef, useState } from "react";
import { Dialog, TextField, IconButton, DialogActions, DialogContent, DialogTitle, Button, Tooltip } from "@mui/material";
// components
import Iconify from '@/Components/iconify';
import { useSnackbar } from "notistack";
import useCopyToClipboard from "@/hooks/useCopyToClipboard";

const CopyUrlDialog = ({ value, label = "Generated Link", open, onClose, action, title = "Generate Sharable Link", ...other }) => {
	const inputRef = useRef(null);
	const [isCopied, setIsCopied] = useState(false);

	const { enqueueSnackbar } = useSnackbar();
	const { copy } = useCopyToClipboard();

	const handleCopy = () => {
		inputRef.current.select();
		setIsCopied(true);
		enqueueSnackbar('Copied!');
		copy(value);
	};

	const handleOnClose = () => {
		setIsCopied(false);
		onClose();
	}

	return (
		<Dialog open={open} onClose={handleOnClose} maxWidth="xs" fullWidth {...other}>
			<DialogTitle sx={{ pb: 2 }}>{title}</DialogTitle>
			<DialogContent sx={{ my: 2, overflow: 'visible' }}>
				<TextField
					fullWidth
					label={label}
					value={value}
					readOnly
					inputRef={inputRef}
					InputProps={{
						endAdornment: (
							isCopied ? (
								<Tooltip title="Copied">
									<IconButton size="large" onClick={handleCopy} aria-label="Copy to clipboard">
										<Iconify icon="lucide:copy-check" width={24} />
									</IconButton>
								</Tooltip>
							) : (
								<Tooltip title="Copy">
									<IconButton size="large" onClick={handleCopy} aria-label="Copy to clipboard">
										<Iconify icon="lucide:copy" width={24} />
									</IconButton>
								</Tooltip>
							)
						),
					}}
				/>
			</DialogContent>
			<DialogActions>
				{action}
				<Button variant="outlined" color="inherit" onClick={handleOnClose}>
					Cancel
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default CopyUrlDialog;