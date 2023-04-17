import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledGrid = styled(Box)(({ theme }) => ({
	display: "grid",
	// gridTemplateColumns: "48px 120px 120px 120px 120px 120px 120px 120px 120px 120px 120px 120px 120px 80px 120px 120px 120px 62px",
	gridAutoRows: 32,
	borderColor: theme.palette.grey.A700,
	borderStyle: "solid",
	borderRightWidth: 0,
	borderBottomWidth: 0,
	borderTopWidth: 0,
	borderLeftWidth: 0,
	marginTop: theme.spacing(1),
	// [theme.breakpoints.down("md")]: {
	// 	gridAutoRows: 36,
	// }
}));

export const StyledTableHead = styled(Box)(({ theme }) => ({
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	backgroundColor: theme.palette.primary.main,
	color: "#fff",
	borderColor: "inherit",
	borderStyle: "solid",
	borderRightWidth: 0,
	borderBottomWidth: 1,
	borderTopWidth: 1,
	borderLeftWidth: 1,
	paddingLeft: theme.spacing(1),
	paddingRight: theme.spacing(1),
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
	justifyContent: "center",
	paddingLeft: theme.spacing(1),
	paddingRight: theme.spacing(1),
}));

