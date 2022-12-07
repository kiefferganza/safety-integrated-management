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

// ----------------------------------------------------------------------

Profile.propTypes = {
	info: PropTypes.object,
	posts: PropTypes.array,
};

export default function Profile ({ info, posts, user, employee }) {
	return (
		<Grid container spacing={3}>
			<Grid item xs={12} md={4}>
				<Stack spacing={3}>
					<ProfileFollowInfo />

					<ProfileAbout
						quote={user?.about}
						country={capitalize(employee?.country)}
						email={user.email}
						role={capitalize(employee?.position?.position)}
						company={capitalize(employee?.company?.company_name)}
						department={startCase(employee?.department?.department?.toLowerCase())}
					/>

					<ProfileSocialInfo socialLinks={info.socialLinks} />
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
