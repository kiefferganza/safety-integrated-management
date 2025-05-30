import PropTypes from 'prop-types';
// @mui
import {
	Paper,
	Stack,
	Dialog,
	Button,
	TextField,
	DialogTitle,
	DialogActions,
	DialogContent,
	FormHelperText,
} from '@mui/material';
import { DatePicker, CalendarPicker } from '@mui/x-date-pickers';
// hooks
import useResponsive from '@/hooks/useResponsive';

// ----------------------------------------------------------------------

DateRangePicker.propTypes = {
	open: PropTypes.bool,
	isError: PropTypes.bool,
	onClose: PropTypes.func,
	title: PropTypes.string,
	onChangeEndDate: PropTypes.func,
	onChangeStartDate: PropTypes.func,
	variant: PropTypes.oneOf(['input', 'calendar']),
	startDate: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]),
	endDate: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]),
	StartDateProps: PropTypes.object,
	EndDateProps: PropTypes.object,
};

export default function DateRangePicker ({
	title = 'Select date range',
	variant = 'input',
	//
	startDate,
	endDate,
	//
	StartDateProps,
	EndDateProps,
	//
	onChangeStartDate,
	onChangeEndDate,
	//
	open,
	onClose,
	onApply,
	//
	isError,
}) {
	const isDesktop = useResponsive('up', 'md');

	const isCalendarView = variant === 'calendar';

	return (
		<Dialog
			fullWidth
			maxWidth={isCalendarView ? false : 'xs'}
			open={open}
			onClose={isError ? null : onClose}
			PaperProps={{
				sx: {
					...(isCalendarView && {
						maxWidth: 720,
					}),
				},
			}}
		>
			<DialogTitle sx={{ pb: 2 }}>{title}</DialogTitle>

			<DialogContent
				sx={{
					...(isCalendarView &&
						isDesktop && {
						overflow: 'unset',
					}),
				}}
			>
				<Stack
					spacing={isCalendarView ? 3 : 2}
					direction={isCalendarView && isDesktop ? 'row' : 'column'}
					justifyContent="center"
					sx={{
						pt: 1,
						'& .MuiCalendarPicker-root': {
							...(!isDesktop && {
								width: 'auto',
							}),
						},
					}}
				>
					{isCalendarView ? (
						<>
							<Paper variant="outlined" sx={{ borderRadius: 2, borderColor: 'divider', borderStyle: 'dashed' }}>
								<CalendarPicker {...StartDateProps} date={startDate} onChange={onChangeStartDate} />
							</Paper>

							<Paper variant="outlined" sx={{ borderRadius: 2, borderColor: 'divider', borderStyle: 'dashed' }}>
								<CalendarPicker {...EndDateProps} date={endDate} onChange={onChangeEndDate} />
							</Paper>
						</>
					) : (
						<>
							<DatePicker
								label="Start date"
								value={startDate}
								onChange={onChangeStartDate}
								{...StartDateProps}
								renderInput={(params) => <TextField {...params} />}
							/>

							<DatePicker
								label="End date"
								value={endDate}
								onChange={onChangeEndDate}
								{...EndDateProps}
								renderInput={(params) => <TextField {...params} />}
							/>
						</>
					)}
				</Stack>

				{isError && (
					<FormHelperText sx={{ color: 'error.main', px: 2 }}>End date must be later than start date</FormHelperText>
				)}
			</DialogContent>

			<DialogActions>
				<Button disabled={isError} variant="outlined" color="inherit" onClick={onClose}>
					Cancel
				</Button>

				<Button disabled={isError} variant="contained" onClick={onApply || onClose}>
					Apply
				</Button>
			</DialogActions>
		</Dialog>
	);
}
