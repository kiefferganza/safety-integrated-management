import { useEffect, useState } from 'react';
// @mui
import { Box } from '@mui/material';
// hooks
import useResponsive from '@/hooks/useResponsive';
// components
import { useSettingsContext } from '@/Components/settings';
//
import Main from './Main';
import Header from './header';
import NavMini from './nav/NavMini';
import NavVertical from './nav/NavVertical';
import NavHorizontal from './nav/NavHorizontal';
import { useSnackbar } from 'notistack';
import { usePage } from '@inertiajs/inertia-react';

// ----------------------------------------------------------------------

export default function DashboardLayout ({ children }) {
	const { flash } = usePage().props;
	const { themeLayout } = useSettingsContext();

	const { enqueueSnackbar } = useSnackbar();

	const isDesktop = useResponsive('up', 'lg');

	const [open, setOpen] = useState(false);

	const isNavHorizontal = themeLayout === 'horizontal';

	const isNavMini = themeLayout === 'mini';

	useEffect(() => {
		if (flash.message) {
			enqueueSnackbar(flash.message, { variant: flash.type || "default" });
			flash.message = null;
		}
	}, [flash]);

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const renderNavVertical = <NavVertical openNav={open} onCloseNav={handleClose} />;

	if (isNavHorizontal) {
		return (
			<>
				<Header onOpenNav={handleOpen} />

				{isDesktop ? <NavHorizontal /> : renderNavVertical}

				<Main>
					{children}
				</Main>
			</>
		);
	}

	if (isNavMini) {
		return (
			<>
				<Header onOpenNav={handleOpen} />

				<Box
					sx={{
						display: { lg: 'flex' },
						minHeight: { lg: 1 },
					}}
				>
					{isDesktop ? <NavMini /> : renderNavVertical}

					<Main>
						{children}
					</Main>
				</Box>
			</>
		);
	}

	return (
		<>
			<Header onOpenNav={handleOpen} />

			<Box
				sx={{
					display: { lg: 'flex' },
					minHeight: { lg: 1 },
				}}
			>
				{renderNavVertical}

				<Main>
					{children}
				</Main>
			</Box>
		</>
	);
}
