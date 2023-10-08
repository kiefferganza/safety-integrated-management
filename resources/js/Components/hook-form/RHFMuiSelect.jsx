import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { FormControl, FormHelperText, InputLabel, MenuItem, Select, Stack } from '@mui/material';

// ----------------------------------------------------------------------

RHFMuiSelect.propTypes = {
	name: PropTypes.string,
};

export default function RHFMuiSelect ({ name, label = "", options = [], selectProp = {}, ...other }) {
	const { control } = useFormContext();

	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState: { error } }) => (
				<Stack sx={{ width: 1 }}>
					<FormControl error={!!error} {...other}>
						<InputLabel id={`select-${label}`}>{label}</InputLabel>
						<Select
							labelId={`select-${label}`}
							id={`select-${label}`}
							value={field.value}
							label={label}
							{...selectProp}
							{...field}
						>
							{options.map((opt, idx) => (
								<MenuItem sx={{ height: 36 }} key={idx} value={opt.value || ''}>{opt?.label || ''}</MenuItem>
							))}
						</Select>
					</FormControl>
					{!!error && <FormHelperText error sx={{ paddingLeft: 1.5 }}>{error?.message}</FormHelperText>}
				</Stack>
			)}
		/>
	);
}
