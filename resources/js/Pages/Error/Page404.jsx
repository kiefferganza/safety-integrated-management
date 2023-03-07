import { m } from 'framer-motion';
import { Link, Head } from '@inertiajs/inertia-react';
// @mui
import { Button, Typography } from '@mui/material';
// components
import { MotionContainer, varBounce } from '@/Components/animate';
// assets
import { PageNotFoundIllustration } from '@/assets/illustrations';
import CompactLayout from '@/Layouts/compact/CompactLayout';

// ----------------------------------------------------------------------

export default function Page404 () {
	return (
		<>
			<Head>
				<title> 404 Page Not Found</title>
			</Head>

			<CompactLayout>
				<MotionContainer>
					<m.div variants={varBounce().in}>
						<Typography variant="h3" paragraph>
							Sorry, page not found!
						</Typography>
					</m.div>

					<m.div variants={varBounce().in}>
						<Typography sx={{ color: 'text.secondary' }}>
							Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve mistyped the URL? Be sure to check your
							spelling.
						</Typography>
					</m.div>

					<m.div variants={varBounce().in}>
						<PageNotFoundIllustration
							sx={{
								height: 260,
								my: { xs: 5, sm: 10 },
							}}
						/>
					</m.div>

					<Button href="/" component={Link} size="large" variant="contained">
						Go to Home
					</Button>
				</MotionContainer>
			</CompactLayout>
		</>
	);
}
