import { m } from 'framer-motion';
import { Link, Head } from '@inertiajs/inertia-react';
// @mui
import { Button, Typography } from '@mui/material';
// components
import { MotionContainer, varBounce } from '@/components/animate';
// assets
import { ForbiddenIllustration } from '@/assets/illustrations';
import CompactLayout from '@/Layouts/compact/CompactLayout';

// ----------------------------------------------------------------------

export default function Page403 () {
	return (
		<>
			<Head>
				<title> 403 Forbidden</title>
			</Head>

			<CompactLayout>
				<MotionContainer>
					<m.div variants={varBounce().in}>
						<Typography variant="h3" paragraph>
							No permission
						</Typography>
					</m.div>

					<m.div variants={varBounce().in}>
						<Typography sx={{ color: 'text.secondary' }}>
							The page you're trying access has restricted access.
							<br />
							Please refer to your system administrator
						</Typography>
					</m.div>

					<m.div variants={varBounce().in}>
						<ForbiddenIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
					</m.div>

					<Button href="/" component={Link} size="large" variant="contained">
						Go to Home
					</Button>
				</MotionContainer>
			</CompactLayout>
		</>
	);
}
