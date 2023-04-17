// mui
import { Box, Card, CardHeader, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledFirstBox = styled(Box)(({ theme }) => ({
	flex: 1,
	padding: theme.spacing(1),
	textAlign: "center"
}));

const StyledSecondBox = styled(Box)(({ theme }) => ({
	padding: theme.spacing(1),
	textAlign: "center",
	width: 90
}));

const IncidentReportTwoCols = ({ title, firstColTitle, secondColTitle = "TOTAL", data, total, sx }) => {
	return (
		<Card elevation={2} sx={{ p: 2, ...sx }}>
			<CardHeader title={title} sx={{ mb: 1 }} />
			<Stack sx={{ borderColor: "grey.700" }}>
				<Stack direction="row" sx={{ backgroundColor: "primary.main", borderColor: "inherit" }} borderTop={1} borderBottom={1} borderLeft={1} borderRight={1}>
					<StyledFirstBox>
						<Typography variant="subtitle2" color="#fff">{firstColTitle}</Typography>
					</StyledFirstBox>
					<StyledSecondBox borderLeft={1} sx={{ borderColor: "inherit" }}>
						<Typography variant="subtitle2" color="#fff">{secondColTitle}</Typography>
					</StyledSecondBox>
				</Stack>
				{Object.entries(data || {}).map(([label, value], idx) => (
					<Stack direction="row" key={idx} sx={{ borderColor: "inherit" }} borderBottom={1} borderLeft={1} borderRight={1}>
						<StyledFirstBox>
							<Typography variant="subtitle2">{label}</Typography>
						</StyledFirstBox>
						<StyledSecondBox borderLeft={1} sx={{ borderColor: "inherit" }}>
							<Typography variant="subtitle2">{value}</Typography>
						</StyledSecondBox>
					</Stack>
				))}
				<Stack direction="row" sx={{ backgroundColor: "text.disabled", borderColor: "inherit" }} borderBottom={1} borderLeft={1} borderRight={1}>
					<StyledFirstBox>
						<Typography variant="subtitle2">TOTAL</Typography>
					</StyledFirstBox>
					<StyledSecondBox borderLeft={1} sx={{ borderColor: "inherit" }}>
						<Typography variant="subtitle2">{total}</Typography>
					</StyledSecondBox>
				</Stack>
			</Stack>
		</Card>
	)
}

export default IncidentReportTwoCols