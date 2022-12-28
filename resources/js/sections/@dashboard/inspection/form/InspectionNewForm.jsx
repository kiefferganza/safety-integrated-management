import { useState, useMemo, useEffect } from 'react';
import { usePage } from '@inertiajs/inertia-react';
import * as Yup from 'yup';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Button, Card, Stack, Step, StepLabel, Stepper, TextField, Typography, useTheme } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
// components
import FormProvider, { RHFTextField } from '@/Components/hook-form';
import InspectionForm from './InspectionForm';
import { Box } from '@mui/system';
import InspectionCloseoutForm from './InspectionCloseoutForm';
import useResponsive from '@/hooks/useResponsive';
import { format } from 'date-fns';

const steps = ['Inspection Details', 'Closeout Report', 'Date Range', 'Unsatisfactory Items'];

const newInspectionSchema = Yup.object().shape({
	project_code: Yup.string().required('Project Code is required'),
	originator: Yup.string().required('Originator is required'),
	discipline: Yup.string().required('Discipline is required'),
	document_type: Yup.string().required('Project Type is required'),
	location: Yup.string().required('Location is required'),
	accompanied_by: Yup.string().required('Accompanied By is required'),
	inspected_date: Yup.string().required('Inspected Date is required'),
	inspected_time: Yup.string().required('Inspected Time is required'),
	date_due: Yup.string().required('Due date is required'),
	reviewer_id: Yup.string().required('Reviewer is required'),
	verifier_id: Yup.string().required('Verifier is required'),
	sectionA: Yup.array().of(Yup.object().shape({
		score: Yup.string().required()
	})),
	sectionB: Yup.array().of(Yup.object().shape({
		score: Yup.string().required()
	})),
	sectionC: Yup.array().of(Yup.object().shape({
		score: Yup.string().required()
	})),
	sectionC_B: Yup.array().of(Yup.object().shape({
		score: Yup.string().required()
	})),
	sectionD: Yup.array().of(Yup.object().shape({
		score: Yup.string().required()
	})),
});

const InspectionNewForm = ({ currentInspection }) => {
	const { sequence_no, personel, auth: { user } } = usePage().props;
	const isDesktop = useResponsive('up', 'sm');
	const [dueDate, setDueDate] = useState(null);
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
		form_number: currentInspection?.form_number || '',
		location: currentInspection?.location || '',
		date_issued: currentInspection?.date_issued || format(new Date(), 'MMMM dd, yyyy'),
		inspected_date: currentInspection?.inspected_date || '',
		inspected_time: currentInspection?.inspected_time || '',
		inspected_by: currentInspection?.inspected_by || user?.employee?.fullname || '',
		accompanied_by: currentInspection?.accompanied_by || '',
		reviewer_id: currentInspection?.reviewer_id || '',
		verifier_id: currentInspection?.verifier_id || '',
		avg_score: currentInspection?.avg_score || '1.00',
		date_due: currentInspection?.date_due || '',
		sectionA: [
			{
				refNumber: '1',
				title: "Welfare facilities, drinking water, toilets, washing",
				score: ''
			},
			{
				refNumber: '2',
				title: "Office Cleanliness",
				score: ''
			},
			{
				refNumber: '3',
				title: "Fire Prevention (including electrical testing of installation Extinguishers.",
				score: ''
			},
			{
				refNumber: '4',
				title: "START Cards completed for all task taking place?",
				score: ''
			},
			{
				refNumber: '5',
				title: "Records of all toolbox talk (Document and signature pages attached)",
				score: ''
			},
			{
				refNumber: '6',
				title: "First Aid Cover and Kit Present",
				score: ''
			},
		],
		sectionB: [
			{
				refNumber: '7',
				title: "Method statement & TAB in place/Briefings (STARRT)",
				score: ''
			},
			{
				refNumber: '8',
				title: "MSDS/COSHH Assessment",
				score: ''
			},
			{
				refNumber: '9',
				title: "Permits inc. to enter, shut down, at height etc.",
				score: ''
			},
			{
				refNumber: '10',
				title: "Weekly Inspection Registers, Plant, scaffold, nets etc.",
				score: ''
			},
			{
				refNumber: '11',
				title: "Toolbox Talks",
				score: ''
			},
			{
				refNumber: '12',
				title: "Induction & Training",
				score: ''
			},
			{
				refNumber: '13',
				title: "Plant Certification",
				score: ''
			},
		],
		sectionC: [
			{
				refNumber: '14',
				title: "Traffic Management",
				score: ''
			},
			{
				refNumber: '15',
				title: "Flammable Liquids, LPG/Cylinder storage and use",
				score: ''
			},
			{
				refNumber: '16',
				title: "Working at Height & Edge Protection",
				score: ''
			},
			{
				refNumber: '17',
				title: "Site Access & Egress, Public Safety, lighting",
				score: ''
			},
			{
				refNumber: '18',
				title: "Cranes & Lifting Equipment/Tackle",
				score: ''
			},
			{
				refNumber: '19',
				title: "Mobile Plant/ Equipment's",
				score: ''
			},
			{
				refNumber: '20',
				title: "Hot Works & Fire Precautions",
				score: ''
			},
			{
				refNumber: '21',
				title: "Tidiness/Housekeeping &Storage of Materials",
				score: ''
			},
		],
		sectionC_B: [
			{
				refNumber: '22',
				title: "Manual Handling",
				score: ''
			},
			{
				refNumber: '23',
				title: "Excavation (inc. barriers, access into, shoring etc.)",
				score: ''
			},
			{
				refNumber: '24',
				title: "Scaffolding, Mobile Towers, Ladders & Stepladders",
				score: ''
			},
			{
				refNumber: '25',
				title: "Underground & Overhead Services",
				score: ''
			},
			{
				refNumber: '26',
				title: "Power Tools/ PAT Testing",
				score: ''
			},
			{
				refNumber: '27',
				title: "Temporary Electrical Supplies/Leads",
				score: ''
			},
			{
				refNumber: '28',
				title: "Personal Protective Equipment",
				score: ''
			},
			{
				refNumber: '29',
				title: "Confined Spaces",
				score: ''
			},
			{
				refNumber: '30',
				title: "Noise",
				score: ''
			},
			{
				refNumber: '31',
				title: "Security",
				score: ''
			}
		],
		sectionD: [
			{
				refNumber: '32',
				title: "Fuels and oils in correct containers, with secondary containment and release controls",
				score: ''
			},
			{
				refNumber: '33',
				title: "Drip Trays for static plant",
				score: ''
			},
			{
				refNumber: '34',
				title: "Dust control",
				score: ''
			},
		],
		sectionE: [
			{
				refNumber: "35",
				title: "",
				score: ""
			},
			{
				refNumber: "36",
				title: "",
				score: ""
			},
			{
				refNumber: "37",
				title: "",
				score: ""
			},
			{
				refNumber: "38",
				title: "",
				score: ""
			},
			{
				refNumber: "39",
				title: "",
				score: ""
			},
			{
				refNumber: "40",
				title: "",
				score: ""
			},
		],
	}), [currentInspection]);
	const methods = useForm({
		resolver: yupResolver(newInspectionSchema),
		defaultValues,
	});

	const { watch, trigger, handleSubmit, setValue, formState: { errors } } = methods;
	const values = watch();

	const handleNext = async () => {
		let result = null;
		switch (activeStep) {
			case 0:
				result = await trigger(["project_code", "originator", "discipline", "document_type", "location", "accompanied_by", "inspected_date", "inspected_time", "reviewer_id", "verifier_id"]);
				if (result) {
					const formNumber = `${values?.project_code}-${values?.originator}-${values?.discipline}-${values?.document_type}-${values?.document_zone ? values?.document_zone + "-" : ""}${values?.document_level ? values?.document_level + "-" : ""}${values?.sequence_no}`;
					setValue("form_number", formNumber);
				}
				break;
			case 1:
				result = await trigger(["sectionA", "sectionB", "sectionC", "sectionC_B", "sectionD"]);
				break;
			case 2:
				result = await trigger(["date_due"]);
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

	const handleChangeDate = (val) => {
		setValue('date_due', format(val, "yyyy-MM-dd"), { shouldDirty: true, shouldValidate: true });
		setDueDate(val);
	}

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
					<InspectionForm personel={personel} isDesktop={isDesktop} />
				</Box>

				<Box display={activeStep !== 1 ? "none" : "block"}>
					<InspectionCloseoutForm />
				</Box>

				<Box display={activeStep !== 2 ? "none" : "block"}>
					<Box sx={{ width: theme => theme.breakpoints.values.sm, margin: 'auto' }}>
						<Typography textAlign="center" variant="h4">Please choose a preferred date.</Typography>
						<Stack spacing={5} sx={{ mt: 3 }}>
							<RHFTextField name="date_issued" disabled />
							{isDesktop ? (
								<DesktopDatePicker
									label="Inspected Date"
									inputFormat="MM/dd/yyyy"
									value={dueDate}
									onChange={handleChangeDate}
									renderInput={(params) => <TextField {...params} fullWidth error={!!errors?.date_due?.message} helperText={errors?.date_due?.message} />}
								/>
							) : (
								<MobileDatePicker
									label="Inspected Date"
									inputFormat="MM/dd/yyyy"
									value={dueDate}
									onChange={handleChangeDate}
									renderInput={(params) => <TextField {...params} fullWidth error={!!errors?.date_due?.message} helperText={errors?.date_due?.message} />}
								/>
							)}
						</Stack>
					</Box>
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