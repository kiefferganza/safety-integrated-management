
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '@/routes/paths';
// components
import { useSettingsContext } from '@/components/settings';
import CustomBreadcrumbs from '@/components/custom-breadcrumbs';
// sections
import { BlogNewPostForm } from '@/sections/@dashboard/blog';
import { Head } from '@inertiajs/inertia-react';

// ----------------------------------------------------------------------

export default function BlogNewPostPage () {
	const { themeStretch } = useSettingsContext();

	return (
		<>
			<Head>
				<title> Blog: New Post | Minimal UI</title>
			</Head>

			<Container maxWidth={themeStretch ? false : 'lg'}>
				<CustomBreadcrumbs
					heading="Create a new post"
					links={[
						{
							name: 'Dashboard',
							href: PATH_DASHBOARD.root,
						},
						{
							name: 'Blog',
							href: PATH_DASHBOARD.blog.root,
						},
						{
							name: 'Create',
						},
					]}
				/>

				<BlogNewPostForm />
			</Container>
		</>
	);
}
