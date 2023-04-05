import PropTypes from 'prop-types';
// @mui
import { Grid, Stack } from '@mui/material';
//
import ProfileAbout from './ProfileAbout';
// import ProfilePostCard from './ProfilePostCard';
import ProfilePostInput from './ProfilePostInput';
import ProfileFollowInfo from './ProfileFollowInfo';
import ProfileSocialInfo from './ProfileSocialInfo';
import _ from 'lodash';
import { isAfter } from 'date-fns';

// ----------------------------------------------------------------------

EmployeeProfile.propTypes = {
	employee: PropTypes.object
};


export default function EmployeeProfile ({ employee, trainings = [] }) {

	const trainingSummary = trainings.reduce((acc, curr) => {
		if (isAfter(new Date(curr.training_date), new Date(curr.date_expired))) {
			acc.expired++;
		} else {
			acc.valid++;
		}
		return acc;
	}, { valid: 0, expired: 0 });

	return (
		<Grid container spacing={3}>
			<Grid item xs={12} md={4}>
				<Stack spacing={3}>
					{/* <ProfileFollowInfo follower={employee?.followers?.length || 0} following={employee?.following?.length || 0} /> */}
					<ProfileFollowInfo titleFollower="Valid Training" titleFollowing="Expired Training" follower={trainingSummary.valid} following={trainingSummary.expired} />

					<ProfileAbout
						quote={employee?.about || ""}
						country={_.capitalize(employee?.country)}
						email={employee.email}
						role={_.capitalize(employee?.raw_position)}
						company={_.capitalize(employee?.raw_company)}
						department={_.startCase(employee?.raw_department?.toLowerCase())}
						editLink={route("management.employee.update", employee.employee_id)}
					/>

					{employee?.social_accounts.length > 0 && (
						<ProfileSocialInfo socialAccounts={employee?.social_accounts} />
					)}
				</Stack>
			</Grid>

			<Grid item xs={12} md={8}>
				<Stack spacing={3}>
					<ProfilePostInput />

					{/* <ProfilePostCard post={[]} /> */}
				</Stack>
			</Grid>
		</Grid>
	);
}
