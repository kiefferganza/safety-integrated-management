import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledGridBox = styled(Box)(({ theme }) => ({
	display: "grid",
	gridTemplateColumns: "48px 68px 68px 68px 68px 68px 68px 68px 68px 68px 68px 68px 68px 80px 120px 140px 140px 62px",
	// gridTemplateColumns: "48px 68px 68px 68px 68px 68px 68px 68px 68px 68px 68px 68px 68px 80px 120px 140px 140px",
	gridAutoRows: 36,
	borderColor: theme.palette.grey.A700,
	borderStyle: "solid",
	borderRightWidth: 0,
	borderBottomWidth: 0,
	borderTopWidth: 0,
	borderLeftWidth: 0,
	[theme.breakpoints.down("md")]: {
		gridAutoRows: 24,
	}
}));

export const StyledTableHeader = styled(Box)(({ theme }) => ({
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	backgroundColor: theme.palette.primary.dark,
	color: "#fff",
	borderColor: "inherit",
	borderStyle: "solid",
	borderRightWidth: 0,
	borderBottomWidth: 0,
	borderTopWidth: 1,
	borderLeftWidth: 1
}));

export const StyledTableHead = styled(Box)(({ theme }) => ({
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	backgroundColor: theme.palette.text.disabled,
	color: "#fff",
	borderColor: "inherit",
	borderStyle: "solid",
	borderRightWidth: 0,
	borderBottomWidth: 1,
	borderTopWidth: 1,
	borderLeftWidth: 1
}));

export const StyledTableCell = styled(Box)(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	borderColor: "inherit",
	borderStyle: "solid",
	borderRightWidth: 0,
	borderBottomWidth: 1,
	borderTopWidth: 0,
	borderLeftWidth: 1,
	justifyContent: "center"
}));

