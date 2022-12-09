import PropTypes from 'prop-types';
// @mui
import { Grid, Stack } from '@mui/material';
//
import ProfileAbout from './ProfileAbout';
import ProfilePostCard from './ProfilePostCard';
import ProfilePostInput from './ProfilePostInput';
import ProfileFollowInfo from './ProfileFollowInfo';
import ProfileSocialInfo from './ProfileSocialInfo';
import _ from 'lodash';
import { isAfter } from 'date-fns';

// ----------------------------------------------------------------------

EmployeeProfile.propTypes = {
	employee: PropTypes.object
};

const TODAY = new Date();

export default function EmployeeProfile ({ posts, employee }) {

	const trainingSummary = employee?.trainings?.reduce((acc, curr) => {
		if (isAfter(TODAY, new Date(curr.date_expired))) {
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
						role={_.capitalize(employee?.position?.position)}
						company={_.capitalize(employee?.company?.company_name)}
						department={_.startCase(employee?.department?.department?.toLowerCase())}
						editLink={`/dashboard/employee/${employee.employee_id}/edit`}
					/>

					<ProfileSocialInfo
						socialLinks={{
							facebookLink: `https://www.facebook.com`,
							instagramLink: `https://www.instagram.com`,
							linkedinLink: `https://www.linkedin.com`,
							twitterLink: `https://www.twitter.com`,
						}}
					/>
				</Stack>
			</Grid>

			<Grid item xs={12} md={8}>
				<Stack spacing={3}>
					<ProfilePostInput />

					<ProfilePostCard post={posts[0]} />
				</Stack>
			</Grid>
		</Grid>
	);
}
