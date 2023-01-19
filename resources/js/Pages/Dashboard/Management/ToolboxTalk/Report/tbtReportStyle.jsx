import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledGridBox = styled(Box)(({ theme }) => ({
	display: "grid"
}));

export const StyledTableHead = styled(Box)(({ theme }) => ({
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	backgroundColor: "#1f497d",
	color: "#fff",
	borderRight: "1px solid #000",
	borderBottom: "1px solid #000",
	borderTop: "1px solid #000"
}));

export const StyledTableCell = styled(Box)(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	borderRight: "1px solid #000",
	borderBottom: "1px solid #000",
}));

