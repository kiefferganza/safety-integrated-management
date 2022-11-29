import PropTypes from 'prop-types';
// @mui
import { Typography, Stack } from '@mui/material';
//
import { StyledRoot, StyledSectionBg, StyledSection, StyledContent } from './styles';

// ----------------------------------------------------------------------

LoginLayout.propTypes = {
	title: PropTypes.node,
	children: PropTypes.node,
	illustration: PropTypes.string,
};

export default function LoginLayout ({ children, illustration, title }) {
	return (
		<StyledRoot>
			<StyledSection sx={{
				background: `url(${illustration || '/storage/assets/illustrations/dashboard.png'})`,
				backgroundPosition: 'center',
				backgroundRepeat: 'no-repeat',
				backgroundSize: 'cover',
			}}
			>
				<Typography variant="h3"
					sx={{
						mb: 10,
						maxWidth: 580,
						textAlign: 'center',
						color: "#fff"
					}}>
					{title || 'Hi, Welcome back'}
				</Typography>

				<StyledSectionBg />
			</StyledSection>

			<StyledContent>
				<Stack sx={{ width: 1 }}> {children} </Stack>
			</StyledContent>
		</StyledRoot>
	);
}
