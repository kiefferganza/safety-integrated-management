import { useState } from "react";
import useResponsive from "@/hooks/useResponsive";
import { Box, Stack, TextField, Typography } from "@mui/material";
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { format } from "date-fns";
import { useFormContext } from "react-hook-form";

const TimeFrame = () => {
	const { setValue, formState: { errors } } = useFormContext();
	const isDesktop = useResponsive('up', 'sm');
	const [dueDate, setDueDate] = useState(null);
	const handleChangeDueDate = (val) => {
		setValue('date_due', format(val, "yyyy-MM-dd"), { shouldDirty: true, shouldValidate: true });
		setDueDate(val);
	}


	return (
		<Box>
			<Typography variant="h5" textAlign="center">Please choose a preferred date.</Typography>
			<Stack gap={3} sx={{ width: "460px", my: 3, mx: 'auto' }}>
				<TextField value={format(new Date(), 'MMMM dd, yyyy')} fullWidth label="From" disabled />
				{isDesktop ? (
					<DesktopDatePicker
						label="To"
						inputFormat="yyyy-MM-dd"
						value={dueDate}
						disablePast
						onChange={handleChangeDueDate}
						renderInput={(params) => <TextField {...params} fullWidth error={!!errors?.date_due?.message} helperText={errors?.date_due?.message} />}
					/>
				) : (
					<MobileDatePicker
						label="To"
						inputFormat="yyyy-MM-dd"
						value={dueDate}
						onChange={handleChangeDueDate}
						renderInput={(params) => <TextField {...params} fullWidth error={!!errors?.date_due?.message} helperText={errors?.date_due?.message} />}
					/>
				)}
			</Stack>
		</Box>
	)
}

export default TimeFrame