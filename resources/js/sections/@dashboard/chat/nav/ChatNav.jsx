import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
// @mui
import { useTheme, styled } from '@mui/material/styles';
import { Box, Stack, Drawer, IconButton } from '@mui/material';
// hooks
import useResponsive from '@/hooks/useResponsive';
// utils
import axios from '@/utils/axios';
// routes
import { PATH_DASHBOARD } from '@/routes/paths';
// components
import Iconify from '@/Components/iconify';
import Scrollbar from '@/Components/scrollbar';
//
import ChatNavList from './ChatNavList';
import ChatNavSearch from './ChatNavSearch';
import ChatNavAccount from './ChatNavAccount';
import ChatNavSearchResults from './ChatNavSearchResults';
import { Link } from '@inertiajs/inertia-react';

// ----------------------------------------------------------------------

const StyledToggleButton = styled((props) => <IconButton disableRipple {...props} />)(({ theme }) => ({
	left: 0,
	zIndex: 9,
	width: 32,
	height: 32,
	position: 'absolute',
	top: theme.spacing(13),
	borderRadius: `0 12px 12px 0`,
	color: theme.palette.primary.contrastText,
	backgroundColor: theme.palette.primary.main,
	boxShadow: theme.customShadows.primary,
	'&:hover': {
		backgroundColor: theme.palette.primary.darker,
	},
}));

// ----------------------------------------------------------------------

const NAV_WIDTH = 320;

const NAV_COLLAPSE_WIDTH = 96;

ChatNav.propTypes = {
	conversations: PropTypes.object,
	activeConversationId: PropTypes.string,
};

export default function ChatNav ({ conversations, activeConversationId }) {
	const theme = useTheme();

	// const navigate = useNavigate();

	const isDesktop = useResponsive('up', 'md');

	const [openNav, setOpenNav] = useState(false);

	const [searchResults, setSearchResults] = useState([]);

	const [searchContacts, setSearchContacts] = useState('');

	const isCollapse = isDesktop && !openNav;

	useEffect(() => {
		if (!isDesktop) {
			handleCloseNav();
		} else {
			handleOpenNav();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isDesktop]);

	const handleToggleNav = () => {
		setOpenNav(!openNav);
	};

	const handleOpenNav = () => {
		setOpenNav(true);
	};

	const handleCloseNav = () => {
		setOpenNav(false);
	};

	const handleChangeSearch = async (event) => {
		try {
			const { value } = event.target;

			setSearchContacts(value);

			if (value) {
				const response = await axios.get('/api/chat/search', {
					params: { query: value },
				});

				setSearchResults(response.data.results);
			} else {
				setSearchResults([]);
			}
		} catch (error) {
			console.error(error);
		}
	};

	const handleSelectContact = (result) => {
		setSearchContacts('');
		// navigate(PATH_DASHBOARD.chat.view(result.username));
	};

	const renderContent = (
		<>
			<Box sx={{ p: 2.5 }}>
				<Stack direction="row" alignItems="center" justifyContent="center">
					{!isCollapse && (
						<>
							<ChatNavAccount />
							<Box sx={{ flexGrow: 1 }} />
						</>
					)}

					<IconButton onClick={handleToggleNav}>
						<Iconify icon={openNav ? 'eva:arrow-ios-back-fill' : 'eva:arrow-ios-forward-fill'} />
					</IconButton>

					{!isCollapse && (
						<IconButton href={PATH_DASHBOARD.chat.new} component={Link} preserveScroll>
							<Iconify icon="eva:edit-fill" />
						</IconButton>
					)}
				</Stack>

				{!isCollapse && (
					<ChatNavSearch
						value={searchContacts}
						onChange={handleChangeSearch}
						onClickAway={() => setSearchContacts('')}
					/>
				)}
			</Box>

			<Scrollbar>
				{!searchContacts ? (
					<ChatNavList
						openNav={openNav}
						onCloseNav={handleCloseNav}
						conversations={conversations}
						selected={(conversationId) => activeConversationId === conversationId}
					/>
				) : (
					<ChatNavSearchResults
						searchContacts={searchContacts}
						searchResults={searchResults}
						onSelectContact={handleSelectContact}
					/>
				)}
			</Scrollbar>
		</>
	);

	return (
		<>
			{!isDesktop && (
				<StyledToggleButton onClick={handleToggleNav}>
					<Iconify width={16} icon="eva:people-fill" />
				</StyledToggleButton>
			)}

			{isDesktop ? (
				<Drawer
					open={openNav}
					variant="persistent"
					PaperProps={{
						sx: {
							pb: 1,
							width: 1,
							position: 'static',
							...(isCollapse && {
								transform: 'none !important',
								visibility: 'visible !important',
							}),
						},
					}}
					sx={{
						width: NAV_WIDTH,
						transition: theme.transitions.create('width'),
						...(isCollapse && {
							width: NAV_COLLAPSE_WIDTH,
						}),
					}}
				>
					{renderContent}
				</Drawer>
			) : (
				<Drawer
					open={openNav}
					onClose={handleCloseNav}
					ModalProps={{ keepMounted: true }}
					PaperProps={{
						sx: {
							pb: 1,
							width: NAV_WIDTH,
						},
					}}
				>
					{renderContent}
				</Drawer>
			)}
		</>
	);
}
