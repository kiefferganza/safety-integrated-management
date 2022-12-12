import PropTypes from 'prop-types';
import capitalize from 'lodash/capitalize';
import startCase from 'lodash/startCase';
// @mui
import { Grid, Stack } from '@mui/material';
//
import ProfileAbout from './ProfileAbout';
import ProfilePostCard from './ProfilePostCard';
import ProfilePostInput from './ProfilePostInput';
import ProfileFollowInfo from './ProfileFollowInfo';
import ProfileSocialInfo from './ProfileSocialInfo';
import { isAfter } from 'date-fns';

// ----------------------------------------------------------------------

Profile.propTypes = {
	user: PropTypes.object,
	employee: PropTypes.object,
	posts: PropTypes.array,
	socialAccounts: PropTypes.array,
};

const TODAY = new Date();

export default function Profile ({ posts, user, employee, socialAccounts }) {

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
					<ProfileFollowInfo titleFollower="Valid Training" titleFollowing="Expired Training" follower={trainingSummary.valid} following={trainingSummary.expired} />

					<ProfileAbout
						quote={employee?.about}
						country={capitalize(employee?.country)}
						email={user.email}
						role={capitalize(employee?.position?.position)}
						company={capitalize(employee?.company?.company_name)}
						department={startCase(employee?.department?.department?.toLowerCase())}
					/>
					{socialAccounts.length > 0 && (
						<ProfileSocialInfo socialAccounts={socialAccounts} />
					)}
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
