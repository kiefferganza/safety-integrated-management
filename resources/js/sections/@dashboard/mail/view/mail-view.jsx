import { useEffect, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { PATH_DASHBOARD } from '@/routes/paths';

import useBoolean from '@/hooks/useBoolean';
import useResponsive from '@/hooks/useResponsive';

import { EmptyContentWithProps } from '@/Components/empty-content';
import { useSettingsContext } from '@/Components/settings';
import { ProgressLoadingScreen } from '@/Components/loading-screen';

import MailNav from '../mail-nav';
import MailList from '../mail-list';
import MailHeader from '../mail-header';
import MailCompose from '../mail-compose';
import MailDetails from '../mail-details';

// ----------------------------------------------------------------------

const LABEL_INDEX = 'inbox';

const labels = [
	{
		id: "all",
		type: "system",
		name: "all",
		unreadCount: 0
	},
	{
		id: "inbox",
		type: "system",
		name: "inbox",
		unreadCount: 0
	},
	{
		id: "sent",
		type: "system",
		name: "sent",
		unreadCount: 0
	},
	{
		id: "drafts",
		type: "system",
		name: "drafts",
		unreadCount: 0
	},
	{
		id: "trash",
		type: "system",
		name: "trash",
		unreadCount: 0
	},
	{
		id: "spam",
		type: "system",
		name: "spam",
		unreadCount: 0
	},
	{
		id: "important",
		type: "system",
		name: "important",
		unreadCount: 0
	},
	{
		id: "starred",
		type: "system",
		name: "starred",
		unreadCount: 0
	}
]

export default function MailView () {

	// const selectedLabelId = searchParams.get('label') || LABEL_INDEX;
	const selectedLabelId = LABEL_INDEX;

	// const selectedMailId = searchParams.get('id') || '';
	const selectedMailId = '';

	const mdUp = useResponsive('up', 'md');

	const settings = useSettingsContext();

	const openNav = useBoolean();

	const openMail = useBoolean();

	const openCompose = useBoolean();

	const mails = {
		allIds: [],
		byId: {}
	}

	const mail = undefined;

	// const firstMailId = mails.allIds[0] || '';

	const handleToggleCompose = useCallback(() => {
		if (openNav.value) {
			openNav.onFalse();
		}
		openCompose.onToggle();
	}, [openCompose, openNav]);

	const handleClickLabel = useCallback(
		(labelId) => {
			if (!mdUp) {
				openNav.onFalse();
			}

			if (labelId) {
				const href =
					labelId !== LABEL_INDEX
						? `${PATH_DASHBOARD.mail}?label=${labelId}`
						: PATH_DASHBOARD.mail;
				// router.push(href);
			}
		},
		// [openNav, router, mdUp]
		[openNav, mdUp]
	);

	const handleClickMail = useCallback(
		(mailId) => {
			if (!mdUp) {
				openMail.onFalse();
			}

			const href =
				selectedLabelId !== LABEL_INDEX
					? `${PATH_DASHBOARD.mail}?id=${mailId}&label=${selectedLabelId}`
					: `${PATH_DASHBOARD.mail}?id=${mailId}`;

			// router.push(href);
		},
		// [openMail, router, selectedLabelId, mdUp]
		[openMail, selectedLabelId, mdUp]
	);


	useEffect(() => {
		if (openCompose.value) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
	}, [openCompose.value]);

	const renderLoading = (
		<ProgressLoadingScreen
			sx={{
				borderRadius: 1.5,
				bgcolor: 'background.default',
			}}
		/>
	);

	const renderEmpty = (
		<EmptyContentWithProps
			title={`Nothing in ${selectedLabelId}`}
			description="This folder is empty"
			imgUrl="/storage/assets/icons/empty/ic_folder_empty.svg"
			sx={{
				borderRadius: 1.5,
				maxWidth: { md: 320 },
				bgcolor: 'background.default',
			}}
		/>
	);

	const renderMailNav = (
		<MailNav
			// loading={labelsLoading}
			loading={false}
			openNav={openNav.value}
			onCloseNav={openNav.onFalse}
			//
			labels={labels}
			selectedLabelId={selectedLabelId}
			handleClickLabel={handleClickLabel}
			//
			onToggleCompose={handleToggleCompose}
		/>
	);

	const renderMailList = (
		<MailList
			mails={mails}
			// loading={mailsLoading}
			loading={false}
			//
			openMail={openMail.value}
			onCloseMail={openMail.onFalse}
			onClickMail={handleClickMail}
			//
			selectedLabelId={selectedLabelId}
			selectedMailId={selectedMailId}
		/>
	);
	const mailsEmpty = false;
	const mailLoading = false;
	const renderMailDetails = (
		<>
			{mailsEmpty ? (
				<EmptyContentWithProps
					imgUrl="/storage/assets/icons/empty/ic_email_disabled.svg"
					sx={{
						borderRadius: 1.5,
						bgcolor: 'background.default',
						...(!mdUp && {
							display: 'none',
						}),
					}}
				/>
			) : (
				<MailDetails
					mail={mail}
					renderLabel={(id) => labels.filter((label) => label.id === id)[0]}
				/>
			)}
		</>
	);

	return (
		<>
			<Container maxWidth={settings.themeStretch ? false : 'xl'}>
				<Typography
					variant="h4"
					sx={{
						mb: { xs: 3, md: 5 },
					}}
				>
					Mail
				</Typography>

				<Stack
					spacing={1}
					sx={{
						p: 1,
						borderRadius: 2,
						overflow: 'hidden',
						position: 'relative',
						bgcolor: 'background.neutral',
					}}
				>
					{!mdUp && (
						<MailHeader
							onOpenNav={openNav.onTrue}
							// onOpenMail={mailsEmpty ? null : openMail.onTrue}
							onOpenMail={true ? null : openMail.onTrue}
						/>
					)}

					<Stack
						spacing={1}
						direction="row"
						sx={{
							minHeight: { md: 720 },
							height: { xs: 800, md: '72vh' },
						}}
					>
						{renderMailNav}

						{/* {mailsEmpty ? renderEmpty : renderMailList} */}
						{true ? renderEmpty : renderMailList}

						{mailLoading ? renderLoading : renderMailDetails}
					</Stack>
				</Stack>
			</Container>

			{openCompose.value && <MailCompose onCloseCompose={openCompose.onFalse} />}
		</>
	);
}
