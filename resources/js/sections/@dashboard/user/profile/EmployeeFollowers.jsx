import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Box, Card, Button, Avatar, Typography, Stack, Pagination, InputAdornment } from '@mui/material';
// components
import Iconify from '@/Components/iconify';
import { getImageSrc } from '@/utils/formatName';
import { CustomTextField } from '@/Components/custom-input';

// ----------------------------------------------------------------------

EmployeeFollowers.propTypes = {
	employees: PropTypes.array,
};

const ROWS_PER_PAGE = 15;

export default function EmployeeFollowers ({ employees }) {
	const [page, setPage] = useState(1);
	const pages = Math.ceil(employees.length / ROWS_PER_PAGE);

	const [filterName, setFilterName] = useState('');

	const dataFiltered = applyFilter({ inputData: employees, filterName });

	const handleSearchName = (e) => {
		setPage(1);
		setFilterName(e.target.value);
	}

	const handlePageChange = (event, value) => {
		setPage(value);
	};

	return (
		<>
			<Stack spacing={3} justifyContent="space-between" direction={{ xs: 'column', sm: 'row' }} sx={{ my: 5 }}>

				<Typography variant="h4">
					Followers
				</Typography>
				<CustomTextField
					width={220}
					size="small"
					value={filterName}
					onChange={handleSearchName}
					placeholder="Search name..."
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
							</InputAdornment>
						),
					}}
				/>
			</Stack>

			<Stack>
				<Box
					gap={3}
					display="grid"
					gridTemplateColumns={{
						xs: 'repeat(1, 1fr)',
						sm: 'repeat(2, 1fr)',
						md: 'repeat(3, 1fr)',
					}}
				>
					{dataFiltered.slice((page - 1) * ROWS_PER_PAGE, ((page - 1) * ROWS_PER_PAGE) + ROWS_PER_PAGE).map((employee) => (
						<FollowerCard key={employee.employee_id} employee={employee} />
					))}
				</Box>
				<Pagination sx={{ my: 3, alignSelf: 'flex-end' }} count={pages} page={page} onChange={handlePageChange} showLastButton showFirstButton />
			</Stack>
		</>
	);
}

// ----------------------------------------------------------------------

FollowerCard.propTypes = {
	follower: PropTypes.shape({
		name: PropTypes.string,
		country: PropTypes.string,
		isFollowed: PropTypes.bool,
		avatarUrl: PropTypes.string,
	}),
};

function FollowerCard ({ employee }) {
	const { firstname, lastname, img_src, country, position, company } = employee;

	const [toggle, setToogle] = useState(false);

	return (
		<Card
			sx={{
				p: 3,
				display: 'flex',
				alignItems: 'center',
			}}
		>
			<Avatar alt={`${firstname} ${lastname}`} src={getImageSrc(img_src)} sx={{ width: 48, height: 48 }} />

			<Box
				sx={{
					pl: 2,
					pr: 1,
					flexGrow: 1,
					minWidth: 0,
				}}
			>
				<Typography variant="subtitle2" noWrap>
					{firstname} {lastname}
				</Typography>

				{country && (
					<Stack spacing={0.5} direction="row" alignItems="center" sx={{ color: 'text.secondary' }}>
						<Iconify icon="eva:pin-fill" width={16} sx={{ flexShrink: 0 }} />

						<Typography variant="body2" component="span" noWrap>
							{country}
						</Typography>
					</Stack>
				)}
				{position?.position && (
					<Stack spacing={0.5} direction="row" alignItems="center" sx={{ color: 'text.secondary' }}>
						<Iconify icon="ic:round-business-center" width={16} sx={{ flexShrink: 0 }} />

						<Typography variant="body2" component="span" noWrap>
							{position?.position} - {company.company_name}
						</Typography>
					</Stack>
				)}
			</Box>

			<Button
				size="small"
				onClick={() => setToogle(!toggle)}
				variant={toggle ? 'text' : 'outlined'}
				color={toggle ? 'primary' : 'inherit'}
				startIcon={toggle && <Iconify icon="eva:checkmark-fill" />}
				sx={{ flexShrink: 0 }}
			>
				{toggle ? 'Followed' : 'Follow'}
			</Button>
		</Card>
	);
}


function applyFilter ({
	inputData,
	filterName,
}) {

	if (filterName) {
		inputData = inputData.filter((employee) => `${employee?.firstname} ${employee?.lastname}`.toLowerCase().includes(filterName.toLowerCase()));
	}

	return inputData;
}
