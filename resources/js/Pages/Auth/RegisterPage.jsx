import { Head } from '@inertiajs/inertia-react';
// sections
import Register from '../../sections/auth/Register';

// ----------------------------------------------------------------------

export default function RegisterPage () {
	return (
		<>
			<Head>
				<title> Register | Minimal UI</title>
			</Head>

			<Register />
		</>
	);
}
