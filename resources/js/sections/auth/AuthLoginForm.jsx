import { useEffect, useState } from 'react';
// @mui
import { Link as MuiLink, Stack, Alert, IconButton, InputAdornment, TextField, Checkbox, FormControlLabel } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '@/Components/iconify';
import { useForm, Link } from '@inertiajs/inertia-react';

// ----------------------------------------------------------------------

export default function AuthLoginForm () {

	const [showPassword, setShowPassword] = useState(false);

	const { data, setData, post, processing, errors } = useForm({
		email: '',
		password: '',
		remember: true,
	});

	useEffect(() => {
		const rememberedData = localStorage.getItem('remember');
		if (rememberedData) {
			const userInfo = JSON.parse(rememberedData);
			setData(userInfo);
		}
	}, []);

	const onHandleChange = (event) => {
		setData(event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value);
	};

	const onSubmit = async (e) => {
		e.preventDefault();

		if (data.remember) {
			localStorage.setItem('remember', JSON.stringify(data));
		} else {
			localStorage.removeItem('remember');
		}

		post(route('login'), {
			preserveScroll: true
		});
	};

	return (
		<form onSubmit={onSubmit}>
			<Stack spacing={3}>
				{!!errors.general && <Alert severity="error">{errors.general}</Alert>}

				<TextField
					name="email"
					value={data.email}
					label="Username or email"
					onChange={onHandleChange}
					error={!!errors.general}
				/>

				<TextField
					name="password"
					label="Password"
					type={showPassword ? 'text' : 'password'}
					onChange={onHandleChange}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
									<Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
								</IconButton>
							</InputAdornment>
						),
					}}
					error={!!errors.general}
				/>
			</Stack>

			<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
				<FormControlLabel label="Remember me" control={<Checkbox checked={data.remember} onChange={onHandleChange} name="remember" />} />
				{/* <MuiLink href="/reset-password" component={Link} variant="body2" color="inherit" underline="always"> */}
				<MuiLink variant="body2" color="inherit" underline="always">
					Forgot password?
				</MuiLink>
			</Stack>

			<LoadingButton
				fullWidth
				color="inherit"
				size="large"
				type="submit"
				variant="contained"
				loading={processing}
				sx={{
					bgcolor: 'text.primary',
					color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
					'&:hover': {
						bgcolor: 'text.primary',
						color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
					},
				}}
			>
				Login
			</LoadingButton>
		</form>
	);
}
