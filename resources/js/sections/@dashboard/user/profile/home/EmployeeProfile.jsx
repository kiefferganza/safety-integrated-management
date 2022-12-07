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

// ----------------------------------------------------------------------

EmployeeProfile.propTypes = {
	employee: PropTypes.object
};

export default function EmployeeProfile ({ posts, employee }) {
	return (
		<Grid container spacing={3}>
			<Grid item xs={12} md={4}>
				<Stack spacing={3}>
					<ProfileFollowInfo follower={employee?.followers?.length || 0} following={employee?.following?.length || 0} />

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
