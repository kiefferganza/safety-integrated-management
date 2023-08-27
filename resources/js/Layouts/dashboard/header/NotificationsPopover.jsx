import PropTypes from 'prop-types';
// import { noCase } from 'change-case';
import { useState } from 'react';
// @mui
import {
	Box,
	Stack,
	List,
	Badge,
	// Button,
	Avatar,
	Tooltip,
	Divider,
	IconButton,
	Typography,
	ListItemText,
	ListSubheader,
	ListItemAvatar,
	ListItemButton,
} from '@mui/material';
// utils
import { fToNow } from '@/utils/formatTime';
// _mock_
import { _notifications } from '../../../_mock/arrays';
// components
import Iconify from '@/Components/iconify';
import Scrollbar from '@/Components/scrollbar';
import MenuPopover from '@/Components/menu-popover';
import { IconButtonAnimate } from '@/Components/animate';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/utils/axios';
import { Inertia } from '@inertiajs/inertia';

// ----------------------------------------------------------------------

export default function NotificationsPopover () {
	const queryClient = useQueryClient();
	const { data, isLoading, isError } = useQuery({
		queryKey: ['notifications'],
		queryFn: () => axiosInstance.get(route('api.user.notifications'))
	});
	const [openPopover, setOpenPopover] = useState(null);

	if (isLoading || isError) {
		return (
			<IconButtonAnimate
				color='default'
				sx={{ width: 40, height: 40 }}
			>
				<Iconify icon="eva:bell-fill" />
			</IconButtonAnimate>
		)
	}
	const notifications = data?.data?.notifications || [];
	const totalUnRead = notifications?.filter((item) => item.read_at === null)?.length || 0;

	const handleOpenPopover = (event) => {
		setOpenPopover(event.currentTarget);
	};

	const handleClosePopover = () => {
		setOpenPopover(null);
	};

	const handleMarkAllAsRead = () => {
		const ids = notifications.filter(notif => notif?.read_at === null).map(notif => notif.id);
		Inertia.post(route('api.user.read_notifications'), { ids }, {
			onFinish () {
				queryClient.invalidateQueries({ queryKey: ['notifications'] });
			}
		});
	};

	return (
		<>
			<IconButtonAnimate
				color={openPopover ? 'primary' : 'default'}
				onClick={handleOpenPopover}
				sx={{ width: 40, height: 40 }}
			>
				<Badge badgeContent={totalUnRead} color="error">
					<Iconify icon="eva:bell-fill" />
				</Badge>
			</IconButtonAnimate>

			<MenuPopover open={openPopover} onClose={handleClosePopover} sx={{ width: 360, p: 0 }}>
				<Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
					<Box sx={{ flexGrow: 1 }}>
						<Typography variant="subtitle1">Notifications</Typography>

						<Typography variant="body2" sx={{ color: 'text.secondary' }}>
							You have {totalUnRead} unread messages
						</Typography>
					</Box>

					{totalUnRead > 0 && (
						<Tooltip title=" Mark all as read">
							<IconButton color="primary" onClick={handleMarkAllAsRead}>
								<Iconify icon="eva:done-all-fill" />
							</IconButton>
						</Tooltip>
					)}
				</Box>

				<Divider sx={{ borderStyle: 'dashed' }} />

				<Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
					<List
						sx={{ maxHeight: '85vh' }}
						disablePadding
					// subheader={
					// 	<ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
					// 		New
					// 	</ListSubheader>
					// }
					>
						{notifications && notifications?.map((notification) => (
							<NotificationItem key={notification.id} notification={notification} queryClient={queryClient} />
						))}
					</List>

					{/* <List
						disablePadding
						subheader={
							<ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
								Before that
							</ListSubheader>
						}
					>
						{notifications.slice(2, 5).map((notification) => (
							<NotificationItem key={notification.id} notification={notification} />
						))}
					</List> */}
				</Scrollbar>

				{/* <Divider sx={{ borderStyle: 'dashed' }} />

				<Box sx={{ p: 1 }}>
					<Button fullWidth disableRipple>
						View All
					</Button>
				</Box> */}
			</MenuPopover>
		</>
	);
}

// ----------------------------------------------------------------------

NotificationItem.propTypes = {
	queryClient: PropTypes.object,
	notification: PropTypes.shape({
		id: PropTypes.string,
		type: PropTypes.string,
		data: PropTypes.object,
		read_at: PropTypes.string,
		notifiable_id: PropTypes.number,
		created_at: PropTypes.string,
	}),
};

function NotificationItem ({ notification, queryClient }) {
	const { data, id, read_at, created_at } = notification;
	const { avatar, title } = renderContent(notification);

	const handleClickNotification = () => {
		if (!!data?.routeName) {
			const routeName = data?.id ? route(data.routeName, data.id) : route(data.routeName);
			Inertia.visit(routeName, {
				onSuccess: function () {
					if (read_at === null && id) {
						Inertia.post(route('api.user.read_notifications'), { ids: [id] }, {
							onFinish () {
								queryClient.invalidateQueries({ queryKey: ['notifications'] });
							}
						});
					}
				}
			});
		}
	}

	return (
		<ListItemButton
			sx={{
				py: 1.5,
				px: 2.5,
				mt: '1px',
				...(read_at === null && {
					bgcolor: 'action.selected',
				}),
			}}
			onClick={handleClickNotification}
		>
			<ListItemAvatar>
				<Avatar sx={{ bgcolor: 'background.neutral' }}>{avatar}</Avatar>
			</ListItemAvatar>

			<ListItemText
				disableTypography
				primary={title}
				secondary={
					<Stack direction="row" sx={{ mt: 0.5, typography: 'caption', color: 'text.disabled' }}>
						<Iconify icon="eva:clock-fill" width={16} sx={{ mr: 0.5 }} />
						<Typography variant="caption">{fToNow(created_at)}</Typography>
					</Stack>
				}
			/>
		</ListItemButton>
	);
}

// ----------------------------------------------------------------------

function renderContent (notification) {
	const { data } = notification;
	const title = (
		<Typography variant="subtitle2">
			<Box display="block" component="span">{data.title}</Box>
			{data.subtitle && (<Box display="block" component="span">{data.subtitle}</Box>)}
			<Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
				&nbsp; {data.message}
			</Typography>
		</Typography>
	);

	if (notification.type === 'order_placed') {
		return {
			avatar: <img alt={data.title} src="/storage/assets/icons/notification/ic_package.svg" />,
			title,
		};
	}
	if (notification.type === 'order_shipped') {
		return {
			avatar: <img alt={data.title} src="/storage/assets/icons/notification/ic_shipping.svg" />,
			title,
		};
	}
	if (notification.type === 'mail') {
		return {
			avatar: <img alt={data.title} src="/storage/assets/icons/notification/ic_mail.svg" />,
			title,
		};
	}
	if (notification.type === 'chat_message') {
		return {
			avatar: <img alt={data.title} src="/storage/assets/icons/notification/ic_chat.svg" />,
			title,
		};
	}
	return {
		avatar: data?.creator?.profile?.thumbnail ? <img alt={data.title} src={data.creator.profile.thumbnail} /> : data?.creator ? route("image", { path: "assets/images/default-profile.jpg", w: 24, h: 24, fit: "crop" }) : null,
		title,
	};
}
