
// hooks
import useOffSetTop from '@/hooks/useOffSetTop';
// config
import { HEADER } from '../../config';
// components
import Header from './Header';

// ----------------------------------------------------------------------

export default function SimpleLayout ({ children }) {
	const isOffset = useOffSetTop(HEADER.H_MAIN_DESKTOP);

	return (
		<>
			<Header isOffset={isOffset} />

			{children}
		</>
	);
}
