
// hooks
import useOffSetTop from '@/hooks/useOffSetTop';
// config
import { HEADER } from '../../config';
// components
import Header from './Header';
import { usePage } from '@inertiajs/inertia-react';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';

// ----------------------------------------------------------------------

export default function SimpleLayout ({ children }) {
	const { flash } = usePage().props;
	const { enqueueSnackbar } = useSnackbar();

	const isOffset = useOffSetTop(HEADER.H_MAIN_DESKTOP);

	useEffect(() => {
		if (flash?.message) {
			enqueueSnackbar(flash.message, { variant: flash.type || "default" });
			flash.message = null;
		}
	}, [flash]);

	return (
		<>
			<Header isOffset={isOffset} />

			{children}
		</>
	);
}
