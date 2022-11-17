// sections
import { Head } from '@inertiajs/inertia-react';
import Login from '../../sections/auth/Login';
// import Login from '../../sections/auth/LoginAuth0';

// ----------------------------------------------------------------------

export default function LoginPage () {
	return (
		<>
			<Head>
				<title> Login | Minimal UI</title>
			</Head>

			<Login />
		</>
	);
}
