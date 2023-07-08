import { useState } from 'react';
// @mui
const { Box, Tab, Tabs, Card, Grid, Divider, Container, Stack, TextField, InputAdornment, Button } = await import('@mui/material');
// routes
import { PATH_DASHBOARD } from '@/routes/paths';
import { Head, Link } from '@inertiajs/inertia-react';
// components
import Markdown from '@/Components/markdown';
import CustomBreadcrumbs from '@/Components/custom-breadcrumbs';
import { useSettingsContext } from '@/Components/settings';
// import { PpeDetailsCarousel, PpeDetailsSummary } from '@/sections/@dashboard/ppe/details';
import Iconify from '@/Components/iconify';
import { capitalCase } from 'change-case';
import { CarouselImageArrow } from '@/Components/carousel';
import { StoreDetailsHistory, StoreDetailsSummary } from '@/sections/@dashboard/operation/store/details';

// ----------------------------------------------------------------------

export default function StoreDetailPage ({ store }) {
	const { themeStretch } = useSettingsContext();

	const [filterName, setFilterName] = useState("");

	const [currentTab, setCurrentTab] = useState('history');

	const TABS = [
		{
			value: 'history',
			label: 'History',
			// component: store ? <PpeDetailsHistory bound={store?.bound} filterName={filterName} setFilterName={setFilterName} /> : null,
			component: <StoreDetailsHistory history={store.history} filterName={filterName} setFilterName={setFilterName} />
		},
		{
			value: 'description',
			label: 'description',
			component: store ? <Markdown children={store?.description} /> : null,
		},
	];

	return (
		<>
			<Head>
				<title>{store.name}</title>
			</Head>

			<Container maxWidth={themeStretch ? false : 'lg'}>
				<CustomBreadcrumbs
					heading="Product Details"
					links={[
						{ name: 'Dashboard', href: PATH_DASHBOARD.root },
						{
							name: 'Store',
							href: PATH_DASHBOARD.store.root,
						},
						{ name: capitalCase(store.name) },
					]}
					action={
						<Button
							variant="outlined"
							component={Link}
							href={PATH_DASHBOARD.ppe.edit(store.slug)}
							startIcon={<Iconify icon="eva:edit-fill" />}
						>Edit</Button>
					}
				/>

				{store && (
					<>
						<Grid container spacing={3}>
							<Grid item xs={12} md={6} lg={7}>
								<CarouselImageArrow images={store.images} />
							</Grid>

							<Grid item xs={12} md={6} lg={5}>
								<StoreDetailsSummary store={store} />
							</Grid>
						</Grid>

						<Card>
							<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 3, my: 2, bgcolor: 'background.neutral' }}>
								<Tabs
									value={currentTab}
									onChange={(_event, newValue) => setCurrentTab(newValue)}
								>
									{TABS.map((tab) => (
										<Tab key={tab.value} value={tab.value} label={tab.label} />
									))}
								</Tabs>
								<TextField
									size="small"
									placeholder="Search..."
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
											</InputAdornment>
										),
									}}
									value={filterName}
									onChange={(event) => {
										setFilterName(event.target.value)
									}}
								/>
							</Stack>

							<Divider />

							{TABS.map(
								(tab) =>
									tab.value === currentTab && (
										<Box
											key={tab.value}
											sx={{
												...(currentTab === 'description' && {
													p: 3,
												}),
											}}
										>
											{tab.component}
										</Box>
									)
							)}
						</Card>
					</>
				)}
			</Container>
		</>
	);
}
