import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/inertia-react';
import { identity, pickBy } from "lodash";
// form
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { format } from 'date-fns';
// @mui
import { LoadingButton } from '@mui/lab';
import { Button, Card, Stack, Step, StepLabel, Stepper } from '@mui/material';
// components
import FormProvider from '@/Components/hook-form';
import { Box } from '@mui/system';
import { Inertia } from '@inertiajs/inertia';
import { useSwal } from '@/hooks/useSwal';
import GeneralIncident from './GeneralIncident';
import IncidentInformation from './IncidentInformation';
import Iconify from '@/Components/iconify/Iconify';

const steps = ['General Info', 'Incident Investigation Report '];

const newIncidentSchema = Yup.object().shape({
	project_code: Yup.string().required('Project Code is required'),
	originator: Yup.string().required('Originator is required'),
	discipline: Yup.string().required('Discipline is required'),
	document_type: Yup.string().required('Project Type is required'),
	location: Yup.string().required('Location is required'),
	day_loss: Yup.number('Days loss must be an number').min(1, "At least 1 day of days loss is required"),
	injured_id: Yup.string().required('Please select the injured personel'),
	supervisor_id: Yup.string().required('Please select an engineer'),
	incident: Yup.string().required('Please select incident classification'),
	nature_other: Yup.string(),
	nature: Yup.string().when("nature_other", (nature_other, schema) => nature_other === "" ? schema.required('Please select the nature of injury') : schema.notRequired()),
	indicator: Yup.string().required('Please select the leading indicator'),
	root_cause_other: Yup.string(),
	root_cause: Yup.string().when("root_cause_other", (root_cause_other, schema) => root_cause_other === "" ? schema.required('Please select the root cause of the incident') : schema.notRequired()),
	mechanism_other: Yup.string(),
	mechanism: Yup.string().when("mechanism_other", (mechanism_other, schema) => mechanism_other === "" ? schema.required('Please select the mechanism of injury') : schema.notRequired()),
	equipment: Yup.string().required('Please select the equipment that involved in the incident'),
	severity: Yup.string().nullable().required('Please select the severity of the incident'),
	body_part: Yup.string().required('Please select the affected body part of the injured personel'),
	incident_date: Yup.date("Please enter a valid date.").required("Please enter the date of the incident"),
	workday: Yup.string().required(),
});

const IncidentNewForm = ({ currentIncident, isEdit = false, projectDetails }) => {
	const { warning, load, stop } = useSwal();
	const { sequence_no, employees, types, errors: resErrors } = usePage().props;
	const [loading, setLoading] = useState(false);
	const [activeStep, setActiveStep] = useState(1);
	const [completed, setCompleted] = useState({
		1: false,
		2: false,
	});

	const defaultValues = {
		sequence_no: currentIncident?.sequence_no || sequence_no || '',
		project_code: currentIncident?.project_code || '',
		originator: currentIncident?.originator || '',
		discipline: currentIncident?.discipline || '',
		document_type: currentIncident?.document_type || '',
		document_zone: currentIncident?.document_zone || '',
		document_level: currentIncident?.document_level || '',
		location: currentIncident?.location || '',
		injured_id: currentIncident?.injured_id || '',
		supervisor_id: currentIncident?.supervisor_id || '',
		day_loss: currentIncident?.day_loss || 0,
		incident: currentIncident?.incident || '',
		nature: currentIncident?.nature || '',
		nature_other: currentIncident?.nature_other || '',
		mechanism: currentIncident?.mechanism || '',
		mechanism_other: currentIncident?.mechanism_other || '',
		indicator: currentIncident?.indicator || '',
		root_cause: currentIncident?.root_cause || '',
		root_cause_other: currentIncident?.root_cause_other || '',
		equipment: currentIncident?.equipment || '',
		severity: currentIncident?.severity || '',
		body_part: currentIncident?.body_part || '',
		remarks: currentIncident?.remarks || '',
		incident_date: currentIncident?.incident_date ? new Date(currentIncident?.incident_date) : new Date(),
		similar_incident: currentIncident?.similar_incident || 'No',
		prevention: currentIncident?.prevention || '',
		workday: currentIncident?.workday || '',
		witnesses: currentIncident?.witnesses || '',
		step_by_step: currentIncident?.step_by_step || '',
		unsafe_workplace: currentIncident?.unsafe_workplace || '',
		unsafe_workplace_reason: currentIncident?.unsafe_workplace_reason || '',
		unsafe_workplace_other: currentIncident?.unsafe_workplace_other || '',
		unsafe_act: currentIncident?.unsafe_act || '',
		unsafe_act_reason: currentIncident?.unsafe_act_reason || '',
		unsafe_act_other: currentIncident?.unsafe_act_other || '',
		employee_signiture: currentIncident?.employee_signiture || '',
	};

	const methods = useForm({
		resolver: yupResolver(newIncidentSchema),
		defaultValues,
	});

	const { trigger, handleSubmit, setError, reset, formState: { isDirty, errors } } = methods;

	useEffect(() => {
		if (Object.keys(resErrors).length !== 0) {
			for (const key in resErrors) {
				setError(key, { type: "custom", message: resErrors[key] });
			}
		} else {
			reset(defaultValues);
			setActiveStep(1);
			setCompleted({
				1: isEdit,
				2: isEdit
			});
		}
	}, [resErrors]);

	const STEPS = [
		{ id: 1, component: <GeneralIncident personel={employees} projectDetails={projectDetails} /> },
		{ id: 2, component: <IncidentInformation types={types} /> }
	];


	const handleNext = async () => {
		if (activeStep === 1) {
			const result = await trigger(["project_code", "originator", "discipline", "document_type", "location", "injured_id", "supervisor_id", "incident_date"]);
			if (result) {
				const newCompleted = completed;
				newCompleted[activeStep] = true;
				setCompleted(newCompleted);
				setActiveStep((prevActiveStep) => prevActiveStep + 1);
			}
		}
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	const onSubmit = async (data) => {
		data.incident_date = format(data.incident_date, "yyyy-MM-dd hh:mm:ss").toString();

		const result = await warning("Are you sure you want to save this form?", "Press cancel to undo this action.", "Yes");
		if (result.isConfirmed) {
			Inertia.post(route('incident.management.store'), data, {
				preserveState: true,
				onStart () {
					load("Submitting form", "please wait...");
					setLoading(true);
				},
				onFinish () {
					stop();
					setLoading(false);
				}
			});
		}
	}

	const onUpdate = async (data) => {
		const result = await warning("Are you sure you want to update this form?", "Press cancel to undo this action.", "Yes");
		if (result.isConfirmed) {
			data.incident_date = format(data.incident_date, "yyyy-MM-dd").toString();
			Inertia.put(route('incident.management.update', currentIncident?.id), data, {
				preserveState: true,
				onStart () {
					load("Updating form", "please wait...");
					setLoading(true);
				},
				onFinish () {
					stop();
					setLoading(false);
				}
			});
		}
	}

	return (
		<FormProvider methods={methods}>
			<Card sx={{ p: 3 }}>
				<Stack direction={{ xs: 'column', md: 'row' }} sx={{ mb: 5 }}>
					<Box flex={.3}>
						<Button
							color="inherit"
							disabled={activeStep === 1 || loading}
							onClick={handleBack}
							sx={{ mr: 1 }}
						>
							Back
						</Button>
					</Box>
					<Stepper activeStep={activeStep - 1} sx={{ flex: 1 }}>
						{steps.map((label, index) => {
							return (
								<Step key={label} completed={completed[index + 1]}>
									<StepLabel>{label}</StepLabel>
								</Step>
							);
						})}
					</Stepper>
					<Box flex={.3} display="flex" justifyContent="flex-end">
						{!isEdit ? (
							<LoadingButton
								loading={loading}
								onClick={activeStep === steps.length ? handleSubmit(onSubmit) : handleNext}
								endIcon={<Iconify icon="material-symbols:chevron-right" />}
							>
								{activeStep === steps.length ? 'Create' : 'Next'}
							</LoadingButton>
						) : (
							<LoadingButton
								loading={loading}
								onClick={activeStep === steps.length ? handleSubmit(onUpdate) : handleNext}
								disabled={activeStep === steps.length ? !isDirty : false}
								endIcon={activeStep === steps.length ? null : <Iconify icon="material-symbols:chevron-right" />}
							>
								{activeStep === steps.length ? 'Update' : 'Next'}
							</LoadingButton>
						)}
					</Box>
				</Stack>
				{STEPS.map((s) => s.id === activeStep && <Box key={s.id}>{s.component}</Box>)}
				<Stack direction={{ xs: 'column', md: 'row' }} sx={{ mt: 5 }}>
					<Box flex={.3}>
						<Button
							color="inherit"
							disabled={activeStep === 1 || loading}
							onClick={handleBack}
							sx={{ mr: 1 }}
						>
							Back
						</Button>
					</Box>
					<Stepper activeStep={activeStep - 1} sx={{ flex: 1 }}>
						{steps.map((label, index) => {
							return (
								<Step key={label} completed={completed[index + 1]}>
									<StepLabel>{label}</StepLabel>
								</Step>
							);
						})}
					</Stepper>
					<Box flex={.3} display="flex" justifyContent="flex-end">
						<Box>
							{!isEdit ? (
								<LoadingButton
									loading={loading}
									onClick={activeStep === steps.length ? handleSubmit(onSubmit) : handleNext}
									endIcon={<Iconify icon="material-symbols:chevron-right" />}
								>
									{activeStep === steps.length ? 'Create' : 'Next'}
								</LoadingButton>
							) : (
								<LoadingButton
									loading={loading}
									onClick={activeStep === steps.length ? handleSubmit(onUpdate) : handleNext}
									disabled={activeStep === steps.length ? !isDirty : false}
									endIcon={activeStep === steps.length ? null : <Iconify icon="material-symbols:chevron-right" />}
								>
									{activeStep === steps.length ? 'Update' : 'Next'}
								</LoadingButton>
							)}
						</Box>
					</Box>
				</Stack>
			</Card>
		</FormProvider>
	)
}

export default IncidentNewForm