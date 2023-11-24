import { useState } from 'react';
import useResponsive from '@/hooks/useResponsive';
import { RHFMuiSelect, RHFTextField } from '@/Components/hook-form';
import FormProvider from '@/Components/hook-form/FormProvider';
import { Box, Button, Divider, Stack, TextField, Typography } from '@mui/material';
import { DesktopDatePicker, MobileDatePicker, TimePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useSwal } from '@/hooks/useSwal';
import { Inertia } from '@inertiajs/inertia';

const newInspectionSchema = Yup.object().shape({
	project_code: Yup.string().required('Project Code is required'),
	contract_no: Yup.string().required('Contract number is required'),
	originator: Yup.string().required('Originator is required'),
	discipline: Yup.string().required('Discipline is required'),
	document_type: Yup.string().required('Project Type is required'),
	location: Yup.string().required('Location is required'),
	accompanied_by: Yup.string().required('Accompanied By is required'),
	inspected_date: Yup.string().required('Inspected Date is required'),
	inspected_time: Yup.string().required('Inspected Time is required'),
});

export default function EditDetails ({ inspection, projectDetails }) {
	const { load, stop } = useSwal();
	const isDesktop = useResponsive('up', 'sm');
	const [time, setTime] = useState(() => {
		if (!inspection?.inspected_time) return null;
		const [hours, minutes] = inspection.inspected_time.split(":");
		const hoursAsNumber = parseInt(hours, 10);
		const minutesAsNumber = parseInt(minutes, 10);
		const currentDate = new Date();
		currentDate.setHours(hoursAsNumber);
		currentDate.setMinutes(minutesAsNumber);
		return currentDate;
	});
	const [inspDate, setInspDate] = useState(() => new Date(inspection?.inspected_date) || null);
	// const [dueDate, setDueDate] = useState(null);

	const formNumber = (inspection?.form_number || [])?.split('-');

	const defaultValues = {
		contract_no: inspection?.contract_no || '',
		project_code: inspection?.project_code || '',
		originator: formNumber[1] || '',
		discipline: formNumber[2] || '',
		document_type: formNumber[3] || '',
		document_zone: inspection?.document_zone || '',
		document_level: inspection?.document_level || '',
		form_number: inspection?.form_number || '',
		location: inspection?.location || '',
		inspected_date: inspection?.inspected_date || '',
		inspected_time: inspection?.inspected_time || '',
		accompanied_by: inspection?.accompanied_by || ''
	};

	const methods = useForm({
		resolver: yupResolver(newInspectionSchema),
		defaultValues,
	});

	const { watch, handleSubmit, setValue, formState: { errors, isDirty } } = methods;
	const values = watch();

	const handleChangeTime = (val) => {
		setTime(val);
		setValue('inspected_time', format(val, "d-MMM-yyyy HH:mm").split(" ")[1], { shouldDirty: true, shouldValidate: true });
	}

	const handleChangeDate = (val) => {
		setInspDate(val);
		setValue('inspected_date', format(val, "d-MMM-yyyy"), { shouldDirty: true, shouldValidate: true });
	}


	// const handleChangeDueDate = (val) => {
	// 	setValue('date_due', format(val, "yyyy-MM-dd"), { shouldDirty: true, shouldValidate: true });
	// 	setDueDate(val);
	// }




	const onSubmit = (data) => {
		data.form_number = `${values?.project_code}-${values?.originator}-${values?.discipline}-${values?.document_type}-${values?.document_zone ? values?.document_zone + "-" : ""}${values?.document_level ? values?.document_level + "-" : ""}${inspection?.sequence_no}`;
		Inertia.post(route('inspection.management.updateDetails', inspection.inspection_id), data, {
			preserveScroll: true,
			onStart () {
				load("Updating inspection", "please wait...");
			},
			onFinish () {
				stop();
			}
		});
	}

	return (
		<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
			<Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>
				<Stack spacing={3}>
					<Typography variant="h6" sx={{ color: 'text.disabled' }}>
						Project Detail
					</Typography>
					<Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: 1 }}>

						<RHFMuiSelect
							label="Project Code"
							name="project_code"
							fullWidth
							options={projectDetails['Project Code'] ? [{ label: '', value: '' }, ...projectDetails['Project Code'].map((d) => ({ label: d.value + (d.name ? ` (${d.name})` : ""), value: d.value }))] : []}
						/>

						<RHFMuiSelect
							label="Originator"
							name="originator"
							fullWidth
							options={projectDetails['Originator'] ? [{ label: '', value: '' }, ...projectDetails['Originator'].map((d) => ({ label: d.value + (d.name ? ` (${d.name})` : ""), value: d.value }))] : []}
						/>

						<RHFMuiSelect
							label="Discipline"
							name="discipline"
							fullWidth
							options={projectDetails['Discipline'] ? [{ label: '', value: '' }, ...projectDetails['Discipline'].map((d) => ({ label: d.value + (d.name ? ` (${d.name})` : ""), value: d.value }))] : []}
						/>

					</Stack>
					<Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: 1 }}>

						<RHFMuiSelect
							label="Type"
							name="document_type"
							fullWidth
							options={projectDetails['Type'] ? [{ label: '', value: '' }, ...projectDetails['Type'].map((d) => ({ label: d.value + (d.name ? ` (${d.name})` : ""), value: d.value }))] : []}
						/>

						<RHFMuiSelect
							label="Zone (Optional)"
							name="document_zone"
							fullWidth
							options={projectDetails['Zone'] ? [{ label: '', value: '' }, ...projectDetails['Zone'].map((d) => ({ label: d.value + (d.name ? ` (${d.name})` : ""), value: d.value }))] : []}
						/>

						<RHFMuiSelect
							label="Level (Optional)"
							name="document_level"
							fullWidth
							options={projectDetails['Level'] ? [{ label: '', value: '' }, ...projectDetails['Level'].map((d) => ({ label: d.value + (d.name ? ` (${d.name})` : ""), value: d.value }))] : []}
						/>

					</Stack>
					<Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: 1 }}>

						<TextField label="Sequence No." disabled fullWidth value={inspection.sequence_no} />

						<Box width={1} />
						<Box width={1} />

					</Stack>
				</Stack>

				<Stack spacing={3}>
					<Typography variant="h6" sx={{ color: 'text.disabled' }}>
						Inspection Detail
					</Typography>

					<Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: 1 }}>

						<RHFTextField name="contract_no" label="Contract No." />

						<TextField disabled value={inspection?.inspected_by || ''} label="Inspected By" fullWidth />

						<RHFTextField name="accompanied_by" label="Accompanied By" />


					</Stack>

					<Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: 1 }}>

						<RHFTextField name="location" label="Location" />

						{isDesktop ? (
							<DesktopDatePicker
								label="Inspected Date"
								inputFormat="d-MMM-yyyy"
								disableMaskedInput
								value={inspDate}
								onChange={handleChangeDate}
								renderInput={(params) => <TextField {...params} fullWidth error={!!errors?.inspected_date?.message} helperText={errors?.inspected_date?.message} />}
							/>
						) : (
							<MobileDatePicker
								label="Inspected Date"
								inputFormat="d-MMM-yyyy"
								value={inspDate}
								disableMaskedInput
								onChange={handleChangeDate}
								renderInput={(params) => <TextField {...params} fullWidth error={!!errors?.inspected_date?.message} helperText={errors?.inspected_date?.message} />}
							/>
						)}

						<TimePicker
							label="Inspected Time"
							value={time}
							disableMaskedInput
							onChange={handleChangeTime}
							renderInput={(params) => <TextField {...params} readOnly fullWidth error={!!errors?.inspected_time?.message} helperText={errors?.inspected_time?.message} />}
						/>

					</Stack>
				</Stack>

				{/* <Stack spacing={3}>
					<Typography variant="h6" sx={{ color: 'text.disabled' }}>
						Time Frame
					</Typography>

					<Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: 1 }}>
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
				</Stack> */}
			</Stack>

			<Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
				<Button
					size="large"
					variant="contained"
					disabled={!isDirty}
					type="submit"
				>
					Save
				</Button>
			</Stack>
		</FormProvider>
	)
}
