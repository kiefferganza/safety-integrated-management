import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { TextField } from '@mui/material';

// ----------------------------------------------------------------------

RHFPhone.propTypes = {
	name: PropTypes.string,
};

function formatPhoneNumber (phoneNumberString) {
	// var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
	// var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
	// if (match) {
	// 	return match[1] + '-' + match[2] + '-' + match[3];
	// }
	// return cleaned;
	return phoneNumberString.replace(/^(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
}

export default function RHFPhone ({ name, ...other }) {
	const { control } = useFormContext();

	const isNumericInput = (event) => {
		const key = event.keyCode;
		return ((key >= 48 && key <= 57) || // Allow number line
			(key >= 96 && key <= 105) // Allow number pad
		);
	};

	const isModifierKey = (event) => {
		const key = event.keyCode;
		return (event.shiftKey === true || key === 35 || key === 36) || // Allow Shift, Home, End
			(key === 8 || key === 9 || key === 13 || key === 46) || // Allow Backspace, Tab, Enter, Delete
			(key > 36 && key < 41) || // Allow left, up, right, down
			(
				// Allow Ctrl/Command + A,C,V,X,Z
				(event.ctrlKey === true || event.metaKey === true) &&
				(key === 65 || key === 67 || key === 86 || key === 88 || key === 90)
			)
	};

	const enforceFormat = (event) => {
		// Input must be of a valid number format or a modifier key, and not longer than ten digits
		if (!isNumericInput(event) && !isModifierKey(event)) {
			event.preventDefault();
		}
	};

	const formatToPhone = (event) => {
		if (isModifierKey(event)) { return; }

		const input = event.target.value.replace(/\D/g, '').substring(0, 10); // First ten digits of input only
		const areaCode = input.substring(0, 3);
		const middle = input.substring(3, 6);
		const last = input.substring(6, 10);

		if (input.length > 6) { event.target.value = `${areaCode}-${middle}-${last}`; }
		else if (input.length > 3) { event.target.value = `${areaCode}-${middle}`; }
	};


	const changeHandler = (e) => formatPhoneNumber(e.target.value);

	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState: { error } }) => {
				// console.log({ field });
				return (
					<TextField
						{...field}
						// onChange={(e) => {
						// 	const formatNum = changeHandler(e);
						// 	console.log(formatNum);
						// 	field.onChange(formatNum);
						// }}
						onKeyUp={formatToPhone}
						onKeyDown={enforceFormat}
						fullWidth
						value={field.value}
						error={!!error}
						helperText={error?.message}
						{...other}
					/>
				)
			}}
		/>
	);
}
