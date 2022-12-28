import { useState, useMemo, useEffect } from 'react';
import { usePage } from '@inertiajs/inertia-react';
import * as Yup from 'yup';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Button, Card, Stack, Step, StepLabel, Stepper } from '@mui/material';
// components
import FormProvider from '@/Components/hook-form';
import InspectionForm from './InspectionForm';
import { Box } from '@mui/system';
import InspectionCloseoutForm from './InspectionCloseoutForm';

const steps = ['Inspection Details', 'Closeout Report'];

const newInspectionSchema = Yup.object().shape({
	project_code: Yup.string().required('Project Code is required'),
	originator: Yup.string().required('Originator is required'),
	discipline: Yup.string().required('Discipline is required'),
	document_type: Yup.string().required('Project Type is required'),
	location: Yup.string().required('Location is required'),
	accompanied_by: Yup.string().required('Accompanied By is required'),
	inspected_date: Yup.string().required('Inspected Date is required'),
	inspected_time: Yup.string().required('Inspected Time is required'),
	reviewer_id: Yup.string().required('Reviewer is required'),
	verifier_id: Yup.string().required('Verifier is required'),
	'1': Yup.string().required(),
	'2': Yup.string().required(),
	'3': Yup.string().required(),
	'4': Yup.string().required(),
	'5': Yup.string().required(),
	'6': Yup.string().required(),
	'7': Yup.string().required(),
	'8': Yup.string().required(),
	'9': Yup.string().required(),
	'10': Yup.string().required(),
	'11': Yup.string().required(),
	'12': Yup.string().required(),
	'13': Yup.string().required(),
	'14': Yup.string().required(),
	'15': Yup.string().required(),
	'16': Yup.string().required(),
	'17': Yup.string().required(),
	'18': Yup.string().required(),
	'19': Yup.string().required(),
	'20': Yup.string().required(),
	'21': Yup.string().required(),
	'22': Yup.string().required(),
	'23': Yup.string().required(),
	'24': Yup.string().required(),
	'25': Yup.string().required(),
	'26': Yup.string().required(),
	'27': Yup.string().required(),
	'28': Yup.string().required(),
	'29': Yup.string().required(),
	'30': Yup.string().required(),
	'31': Yup.string().required(),
	'32': Yup.string().required(),
	'33': Yup.string().required(),
	'34': Yup.string().required(),
});

const InspectionNewForm = ({ currentInspection }) => {
	const { sequence_no, personel, auth: { user } } = usePage().props;
	const [loading, setLoading] = useState(false);
	const [activeStep, setActiveStep] = useState(0);
	const [completed, setCompleted] = useState({});

	const defaultValues = useMemo(() => ({
		sequence_no: currentInspection?.sequence_no || sequence_no || '',
		project_code: currentInspection?.project_code || '',
		originator: currentInspection?.originator || '',
		discipline: currentInspection?.discipline || '',
		document_type: currentInspection?.document_type || '',
		document_zone: currentInspection?.document_zone || '',
		document_level: currentInspection?.document_level || '',
		location: currentInspection?.location || '',
		inspected_date: currentInspection?.inspected_date || '',
		inspected_time: currentInspection?.inspected_time || '',
		inspected_by: currentInspection?.inspected_by || user?.employee?.fullname || '',
		accompanied_by: currentInspection?.accompanied_by || '',
		reviewer_id: currentInspection?.reviewer_id || '',
		verifier_id: currentInspection?.verifier_id || '',
	}), [currentInspection]);
	const methods = useForm({
		resolver: yupResolver(newInspectionSchema),
		defaultValues,
	});

	const { trigger, handleSubmit } = methods;

	const handleNext = async () => {
		let result = null;
		switch (activeStep) {
			case 0:
				result = await trigger(["project_code", "originator", "discipline", "document_type", "location", "accompanied_by", "inspected_date", "inspected_time", "reviewer_id", "verifier_id"]);
				break;
			case 1:
				// result = await trigger(["title", "location", "contract_no", "trainer"]);
				break;
			default:
				break;
		}
		if (result) {
			const newCompleted = completed;
			newCompleted[activeStep] = true;
			setCompleted(newCompleted);
			setActiveStep((prevActiveStep) => prevActiveStep + 1);
		}
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	const onSubmit = (data) => {
		console.log(data);
	}

	return (
		<FormProvider methods={methods}>
			<Card sx={{ p: 3 }}>
				<Stepper activeStep={activeStep} sx={{ mb: 3 }}>
					{steps.map((label, index) => {
						return (
							<Step key={label} completed={completed[index]}>
								<StepLabel>{label}</StepLabel>
							</Step>
						);
					})}
				</Stepper>
				<Box display={activeStep !== 0 ? "none" : "block"}>
					<InspectionForm personel={personel} />
				</Box>

				<Box display={activeStep !== 1 ? "none" : "block"}>
					<InspectionCloseoutForm />
				</Box>

				<Box sx={{ display: 'flex', flexDirection: 'row', mt: 3 }}>
					<Button
						color="inherit"
						disabled={activeStep === 0}
						onClick={handleBack}
						sx={{ mr: 1 }}
					>
						Back
					</Button>
					<Box sx={{ flex: '1 1 auto' }} />
					<LoadingButton loading={loading} variant="contained" size="large" onClick={activeStep === steps.length - 1 ? handleSubmit(onSubmit) : handleNext}>
						{activeStep === steps.length - 1 ? 'Save' : 'Next'}
					</LoadingButton>
				</Box>
			</Card>
		</FormProvider>
	)
}

export default InspectionNewForm