import { getEmails } from '@/utils/axios';
import { usePage } from '@inertiajs/inertia-react';
import { useQuery } from '@tanstack/react-query';
import { Controller, useFormContext } from 'react-hook-form';
// mui
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';

const filter = createFilterOptions();

export default function CarbonCopy ({ name, ...other }) {
	const { auth: { user } } = usePage().props;

	const { data, isLoading } = useQuery({
		queryKey: ['emails', user.subscriber_id],
		queryFn: getEmails,
		refetchOnWindowFocus: false
	});

	const { control, setValue } = useFormContext();

	const hanldeSelectEmail = (_e, newVal) => {
		const val = newVal.map(v => {
			if (typeof v === 'string') {
				return {
					email: v,
					user_id: null,
					emp_id: null
				}
			}
			return {
				email: v.email,
				user_id: v?.user_id,
				emp_id: v?.emp_id
			}
		});
		setValue(name, val, { shouldValidate: true, shouldDirty: true });
	}

	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState: { error } }) => {
				return (
					<Autocomplete
						isOptionEqualToValue={(option, value) => option.email === value.email}
						getOptionLabel={(option) => {
							// Value selected with enter, right from the input
							if (typeof option === 'string') {
								return option;
							}
							// Add "xxx" option created dynamically
							if (option.inputValue) {
								return option.inputValue;
							}
							// Regular option
							return option.email;
						}}
						groupBy={(option) => option?.type}
						options={data ? data.filter(d => !d.email.toLowerCase().includes('tba') && !d.email.toLowerCase().includes('tbc')) : []}
						loading={isLoading}
						limitTags={1}
						multiple
						freeSolo
						clearOnBlur
						selectOnFocus
						renderTags={(value, getTagProps) => {
							return value.map((option, index) => (
								<Chip
									{...getTagProps({ index })}
									key={index}
									size="small"
									label={option.email}
									color={error && error[index] ? 'error' : 'default'}
								/>
							))
						}}
						filterOptions={(options, params) => {
							const filtered = filter(options, params);

							const { inputValue } = params;
							// Suggest the creation of a new value
							const isExisting = options.some((option) => inputValue === option.email);
							if (inputValue !== '' && !isExisting) {
								filtered.push({
									inputValue: `Add "${inputValue}"`,
									email: inputValue,
								});
							}

							return filtered;
						}}
						renderInput={(params) => (
							<TextField
								{...params}
								label="Add CC"
								InputProps={{
									...params.InputProps,
									endAdornment: (
										<>
											{isLoading ? <CircularProgress color="inherit" size={20} /> : null}
											{params.InputProps.endAdornment}
										</>
									),
								}}
								error={!!error}
								helperText={error ? error.filter(e => e)[0].message : ""}
							/>
						)}
						{...other}
						value={field.value}
						onBlur={field.onBlur}
						onChange={hanldeSelectEmail}
					/>
				)
			}}
		/>
	)
}
