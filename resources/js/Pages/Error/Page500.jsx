import { m } from 'framer-motion';
import { Link, Head } from '@inertiajs/inertia-react';
// @mui
import { Button, Typography } from '@mui/material';
// components
import { MotionContainer, varBounce } from '@/Components/animate';
// assets
import { SeverErrorIllustration } from '@/assets/illustrations';
import CompactLayout from '@/Layouts/compact/CompactLayout';

// ----------------------------------------------------------------------

export default function Page500 () {
	return (
		<>
			<Head>
				<title> 500 Internal Server Error</title>
			</Head>

			<CompactLayout>
				<MotionContainer>
					<m.div variants={varBounce().in}>
						<Typography variant="h3" paragraph>
							500 Internal Server Error
						</Typography>
					</m.div>

					<m.div variants={varBounce().in}>
						<Typography sx={{ color: 'text.secondary' }}>
							There was an error, please try again later.
						</Typography>
					</m.div>

					<m.div variants={varBounce().in}>
						<SeverErrorIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
					</m.div>

					<Button href="/" component={Link} size="large" variant="contained">
						Go to Home
					</Button>
				</MotionContainer>
			</CompactLayout>
		</>
	);
}
