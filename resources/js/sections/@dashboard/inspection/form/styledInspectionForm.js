import { Box, styled } from '@mui/material';


export const HeadingTH = styled(Box)`
	background-color: #B2C8DF;
	padding: 5px;
	color: black;
	fontWeight: 600;
	border: 1px solid #000;
`;

export const TRow = styled(Box)`
	display: grid;
	grid-template-columns: 70px 1fr 70px;
	border-left: 1px solid;
	border-right: 1px solid;
`;

export const TCell = styled(Box)`
	display: flex;
	align-items:center;
	justify-content:center;
	padding: 5px;
	border-bottom-color: #e4e7ed;
	border-left-color: #000;
	border-right-color: #000;
`;

export const ScoreSelect = styled('select')`
	text-align: center;
	border: 0;
	outline: 0;
	background-color: transparent;
	-webkit-appearance: none;
	appearance: none;
	width: 100%;
	height: 100%;
`;