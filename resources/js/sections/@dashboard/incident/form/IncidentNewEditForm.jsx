import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/inertia-react';
import { identity, pickBy } from "lodash";
// form
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Button, Card, Step, StepLabel, Stepper } from '@mui/material';
// components
import FormProvider from '@/Components/hook-form';
import { Box } from '@mui/system';
import { Inertia } from '@inertiajs/inertia';
import { useSwal } from '@/hooks/useSwal';
import GeneralIncident from './GeneralIncident';
import IncidentInformation from './IncidentInformation';
import { format } from 'date-fns';

const steps = ['General Info', 'Incident Information'];

const newIncidentSchema = Yup.object().shape({
	project_code: Yup.string().required('Project Code is required'),
	originator: Yup.string().required('Originator is required'),
	discipline: Yup.string().required('Discipline is required'),
	document_type: Yup.string().required('Project Type is required'),
	location: Yup.string().required('Location is required'),
	lti: Yup.number('LTI must be an number').min(1, "At least 1 day of days loss is required"),
	site: Yup.string().required('Site name is required'),
	injured_id: Yup.string().required('Please select the injured personel'),
	engineer_id: Yup.string().required('Please select an engineer'),
	first_aider_id: Yup.string().required('Please select the first aider personel'),
	incident: Yup.string().required('Please select incident classification'),
	nature: Yup.string().required('Please select the nature of injury'),
	indicator: Yup.string().required('Please select the leading indicator'),
	root_cause: Yup.string().required('Please select the root cause of the incident'),
	mechanism: Yup.string().required('Please select the mechanism of injury'),
	equipment: Yup.string().required('Please select the equipment that involved in the incident'),
	severity: Yup.string().required('Please select the severity of the incident'),
	body_part: Yup.string().required('Please select the affected body part of the injured personel'),
	incident_date: Yup.date("Please enter a valid date.").required("Please enter the date of the incident"),
});

const IncidentNewForm = ({ currentIncident, isEdit = false }) => {
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
		site: currentIncident?.site || '',
		injured_id: currentIncident?.injured_id || '',
		engineer_id: currentIncident?.engineer_id || '',
		first_aider_id: currentIncident?.first_aider_id || '',
		findings: currentIncident?.findings || '',
		first_aid: currentIncident?.first_aid || '',
		lti: currentIncident?.lti || 0,
		incident: currentIncident?.incident || '',
		nature: currentIncident?.nature || '',
		mechanism: currentIncident?.mechanism || '',
		indicator: currentIncident?.indicator || '',
		root_cause: currentIncident?.root_cause || '',
		equipment: currentIncident?.equipment || '',
		severity: currentIncident?.severity || '',
		body_part: currentIncident?.body_part || '',
		remarks: currentIncident?.remarks || '',
		incident_date: currentIncident?.incident_date ? new Date(currentIncident?.incident_date) : new Date()
	};

	const methods = useForm({
		resolver: yupResolver(newIncidentSchema),
		defaultValues,
	});

	const { trigger, handleSubmit, setError, reset, formState: { isDirty } } = methods;

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
		{ id: 1, component: <GeneralIncident personel={employees} /> },
		{ id: 2, component: <IncidentInformation types={types} /> }
	];


	const handleNext = async () => {
		if (activeStep === 1) {
			const result = await trigger(["project_code", "originator", "discipline", "document_type", "location", "site", "injured_id", "engineer_id", "first_aider_id", "incident_date"]);
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
		const cleanData = pickBy(data, identity);
		cleanData.lti = cleanData?.lti || 0;
		cleanData.engineer_id = Number(cleanData.engineer_id);
		cleanData.injured_id = Number(cleanData.injured_id);
		cleanData.first_aider_id = Number(cleanData.first_aider_id);
		cleanData.incident_date = format(cleanData.incident_date, "yyyy-MM-dd").toString();

		const result = await warning("Are you sure you want to save this form?", "Press cancel to undo this action.", "Yes");
		if (result.isConfirmed) {
			Inertia.post(route('incident.management.store'), cleanData, {
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
				<Stepper activeStep={activeStep - 1} sx={{ mb: 3, maxWidth: 600, mr: "auto", ml: "auto" }}>
					{steps.map((label, index) => {
						return (
							<Step key={label} completed={completed[index + 1]}>
								<StepLabel>{label}</StepLabel>
							</Step>
						);
					})}
				</Stepper>
				{STEPS.map((s) => s.id === activeStep && <Box key={s.id}>{s.component}</Box>)}

				<Box sx={{ display: 'flex', flexDirection: 'row', mt: 3 }}>
					<Button
						color="inherit"
						disabled={activeStep === 0 || loading}
						onClick={handleBack}
						sx={{ mr: 1 }}
					>
						Back
					</Button>
					<Box sx={{ flex: '1 1 auto' }} />
					{!isEdit ? (
						<LoadingButton
							loading={loading}
							variant="contained"
							size="large"
							onClick={activeStep === steps.length ? handleSubmit(onSubmit) : handleNext}
						>
							{activeStep === steps.length ? 'Create' : 'Next'}
						</LoadingButton>
					) : (
						<LoadingButton
							loading={loading}
							variant="contained"
							size="large"
							onClick={activeStep === steps.length ? handleSubmit(onUpdate) : handleNext}
							disabled={activeStep === steps.length ? !isDirty : false}
						>
							{activeStep === steps.length ? 'Update' : 'Next'}
						</LoadingButton>
					)}
				</Box>
			</Card>
		</FormProvider>
	)
}

export default IncidentNewForm