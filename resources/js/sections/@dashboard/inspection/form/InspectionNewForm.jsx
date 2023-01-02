import { useState } from 'react';
import { usePage } from '@inertiajs/inertia-react';
import * as Yup from 'yup';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Button, Card, Step, StepLabel, Stepper } from '@mui/material';
// components
import FormProvider from '@/Components/hook-form';
import InspectionForm from './InspectionForm';
import { Box } from '@mui/system';
import InspectionCloseoutForm from './InspectionCloseoutForm';
import { format } from 'date-fns';
import UnsatisfactoryItems from './UnsatisfactoryItems';
import { Inertia } from '@inertiajs/inertia';
import { useSwal } from '@/hooks/useSwal';
import TimeFrame from './TimeFrame';

const steps = ['General Info', 'Inspection Report', 'Time Frame', 'Evidence'];

const InspectionNewForm = () => {
	const { warning } = useSwal();
	const { sequence_no, personel, auth: { user } } = usePage().props;
	const [loading, setLoading] = useState(false);
	const [activeStep, setActiveStep] = useState(0);
	const [completed, setCompleted] = useState({
		0: false,
		1: false,
		2: false,
		3: false
	});

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
		date_due: Yup.string().required('Due date is required'),
		reviewer_id: Yup.string().required('Reviewer is required'),
		verifier_id: Yup.string().required('Verifier is required'),
		sectionA: Yup.array().of(Yup.object().shape({
			score: Yup.string().required(),
			findings: Yup.string().when("score", (score, schema) => (score === "2" || score === "3") && activeStep === 3 ? schema.required() : schema.notRequired())
		})),
		sectionB: Yup.array().of(Yup.object().shape({
			score: Yup.string().required(),
			findings: Yup.string().when("score", (score, schema) => (score === "2" || score === "3") && activeStep === 3 ? schema.required() : schema.notRequired())
		})),
		sectionC: Yup.array().of(Yup.object().shape({
			score: Yup.string().required(),
			findings: Yup.string().when("score", (score, schema) => (score === "2" || score === "3") && activeStep === 3 ? schema.required() : schema.notRequired())
		})),
		sectionC_B: Yup.array().of(Yup.object().shape({
			score: Yup.string().required(),
			findings: Yup.string().when("score", (score, schema) => (score === "2" || score === "3") && activeStep === 3 ? schema.required() : schema.notRequired())
		})),
		sectionD: Yup.array().of(Yup.object().shape({
			score: Yup.string().required(),
			findings: Yup.string().when("score", (score, schema) => (score === "2" || score === "3") && activeStep === 3 ? schema.required() : schema.notRequired())
		})),
		sectionE: Yup.array().of(Yup.object().shape({
			title: Yup.string(),
			score: Yup.string().when("title", (title, schema) => title !== "" ? schema.required() : schema.notRequired()),
			findings: Yup.string().when("score", (score, schema) => (score === "2" || score === "3") && activeStep === 3 ? schema.required() : schema.notRequired())
		})),
	});

	const defaultValues = {
		sequence_no: sequence_no || '',
		contract_no: '',
		project_code: '',
		originator: '',
		discipline: '',
		document_type: '',
		document_zone: '',
		document_level: '',
		form_number: '',
		location: '',
		date_issued: format(new Date(), 'yyyy-MM-dd'),
		inspected_date: '',
		inspected_time: '',
		inspected_by: user?.employee?.fullname || '',
		accompanied_by: '',
		reviewer_id: '',
		verifier_id: '',
		avg_score: '1.00',
		date_due: '',
		status: 1,
		sectionA: [
			{
				refNumber: '1',
				title: "Welfare facilities, drinking water, toilets, washing",
				score: '',
				photo_before: "",
				findings: "",
				key: "sectionA",
				index: 0
			},
			{
				refNumber: '2',
				title: "Office Cleanliness",
				score: '',
				photo_before: "",
				findings: "",
				key: "sectionA",
				index: 1
			},
			{
				refNumber: '3',
				title: "Fire Prevention (including electrical testing of installation Extinguishers.",
				score: '',
				photo_before: "",
				findings: "",
				key: "sectionA",
				index: 2
			},
			{
				refNumber: '4',
				title: "START Cards completed for all task taking place?",
				score: '',
				photo_before: "",
				findings: "",
				key: "sectionA",
				index: 3
			},
			{
				refNumber: '5',
				title: "Records of all toolbox talk (Document and signature pages attached)",
				score: '',
				photo_before: "",
				findings: "",
				key: "sectionA",
				index: 4
			},
			{
				refNumber: '6',
				title: "First Aid Cover and Kit Present",
				score: '',
				photo_before: "",
				findings: "",
				key: "sectionA",
				index: 5
			},
		],
		sectionB: [
			{
				refNumber: '7',
				title: "Method statement & TAB in place/Briefings (STARRT)",
				score: '',
				photo_before: "",
				findings: "",
				key: "sectionB",
				index: 0
			},
			{
				refNumber: '8',
				title: "MSDS/COSHH Assessment",
				score: '',
				photo_before: "",
				findings: "",
				key: "sectionB",
				index: 1
			},
			{
				refNumber: '9',
				title: "Permits inc. to enter, shut down, at height etc.",
				score: '',
				photo_before: "",
				findings: "",
				key: "sectionB",
				index: 2
			},
			{
				refNumber: '10',
				title: "Weekly Inspection Registers, Plant, scaffold, nets etc.",
				score: '',
				photo_before: "",
				findings: "",
				key: "sectionB",
				index: 3
			},
			{
				refNumber: '11',
				title: "Toolbox Talks",
				score: '',
				photo_before: "",
				findings: "",
				key: "sectionB",
				index: 4
			},
			{
				refNumber: '12',
				title: "Induction & Training",
				score: '',
				photo_before: "",
				findings: "",
				key: "sectionB",
				index: 5
			},
			{
				refNumber: '13',
				title: "Plant Certification",
				score: '',
				photo_before: "",
				findings: "",
				key: "sectionB",
				index: 6
			},
		],
		sectionC: [
			{
				refNumber: '14',
				title: "Traffic Management",
				score: '',
				photo_before: "",
				findings: "",
				key: "sectionC",
				index: 0
			},
			{
				refNumber: '15',
				title: "Flammable Liquids, LPG/Cylinder storage and use",
				score: '',
				photo_before: "",
				findings: "",
				key: "sectionC",
				index: 1
			},
			{
				refNumber: '16',
				title: "Working at Height & Edge Protection",
				score: '',
				photo_before: "",
				findings: "",
				key: "sectionC",
				index: 2
			},
			{
				refNumber: '17',
				title: "Site Access & Egress, Public Safety, lighting",
				score: '',
				photo_before: "",
				findings: "",
				key: "sectionC",
				index: 3
			},
			{
				refNumber: '18',
				title: "Cranes & Lifting Equipment/Tackle",
				score: '',
				photo_before: "",
				findings: "",
				key: "sectionC",
				index: 4
			},
			{
				refNumber: '19',
				title: "Mobile Plant/ Equipment's",
				score: '',
				photo_before: "",
				findings: "",
				key: "sectionC",
				index: 5
			},
			{
				refNumber: '20',
				title: "Hot Works & Fire Precautions",
				score: '',
				photo_before: "",
				findings: "",
				key: "sectionC",
				index: 6
			},
			{
				refNumber: '21',
				title: "Tidiness/Housekeeping &Storage of Materials",
				score: '',
				photo_before: "",
				findings: "",
				key: "sectionC",
				index: 7
			},
		],
		sectionC_B: [
			{
				refNumber: '22',
				title: "Manual Handling",
				score: '',
				photo_before: "",
				findings: "",
				key: "sectionC_B",
				index: 0
			},
			{
				refNumber: '23',
				title: "Excavation (inc. barriers, access into, shoring etc.)",
				score: '',
				photo_before: "",
				findings: "",
				key: "sectionC_B",
				index: 1
			},
			{
				refNumber: '24',
				title: "Scaffolding, Mobile Towers, Ladders & Stepladders",
				score: '',
				photo_before: "",
				findings: "",
				key: "sectionC_B",
				index: 2
			},
			{
				refNumber: '25',
				title: "Underground & Overhead Services",
				score: '',
				photo_before: "",
				findings: "",
				key: "sectionC_B",
				index: 3
			},
			{
				refNumber: '26',
				title: "Power Tools/ PAT Testing",
				score: '',
				photo_before: "",
				findings: "",
				key: "sectionC_B",
				index: 4
			},
			{
				refNumber: '27',
				title: "Temporary Electrical Supplies/Leads",
				score: '',
				photo_before: "",
				findings: "",
				key: "sectionC_B",
				index: 5
			},
			{
				refNumber: '28',
				title: "Personal Protective Equipment",
				score: '',
				photo_before: "",
				findings: "",
				key: "sectionC_B",
				index: 6
			},
			{
				refNumber: '29',
				title: "Confined Spaces",
				score: '',
				photo_before: "",
				findings: "",
				key: "sectionC_B",
				index: 7
			},
			{
				refNumber: '30',
				title: "Noise",
				score: '',
				photo_before: "",
				findings: "",
				key: "sectionC_B",
				index: 8
			},
			{
				refNumber: '31',
				title: "Security",
				score: '',
				photo_before: "",
				findings: "",
				key: "sectionC_B",
				index: 9
			}
		],
		sectionD: [
			{
				refNumber: '32',
				title: "Fuels and oils in correct containers, with secondary containment and release controls",
				score: '',
				photo_before: "",
				findings: "",
				key: "sectionD",
				index: 0
			},
			{
				refNumber: '33',
				title: "Drip Trays for static plant",
				score: '',
				photo_before: "",
				findings: "",
				key: "sectionD",
				index: 1
			},
			{
				refNumber: '34',
				title: "Dust control",
				score: '',
				photo_before: "",
				findings: "",
				key: "sectionD",
				index: 2
			},
		],
		sectionE: [
			{
				refNumber: "35",
				title: "",
				score: "",
				photo_before: "",
				findings: "",
				key: "sectionE",
				index: 0
			},
			{
				refNumber: "36",
				title: "",
				score: "",
				photo_before: "",
				findings: "",
				key: "sectionE",
				index: 1
			},
			{
				refNumber: "37",
				title: "",
				score: "",
				photo_before: "",
				findings: "",
				key: "sectionE",
				index: 2
			},
			{
				refNumber: "38",
				title: "",
				score: "",
				photo_before: "",
				findings: "",
				key: "sectionE",
				index: 3
			},
			{
				refNumber: "39",
				title: "",
				score: "",
				photo_before: "",
				findings: "",
				key: "sectionE",
				index: 4
			},
			{
				refNumber: "40",
				title: "",
				score: "",
				photo_before: "",
				findings: "",
				key: "sectionE",
				index: 5
			},
		],
	};
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
				result = await trigger(["contract_no", "project_code", "originator", "discipline", "document_type", "location", "accompanied_by", "inspected_date", "inspected_time", "reviewer_id", "verifier_id"]);
				if (result) {
					const formNumber = `${values?.project_code}-${values?.originator}-${values?.discipline}-${values?.document_type}-${values?.document_zone ? values?.document_zone + "-" : ""}${values?.document_level ? values?.document_level + "-" : ""}${values?.sequence_no}`;
					setValue("form_number", formNumber);
				}
				break;
			case 1:
				result = await trigger(["sectionA", "sectionB", "sectionC", "sectionC_B", "sectionD"]);
				break;
			case 2:
				result = await trigger("date_due");
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

	const onSubmit = async (data) => {
		const result = await warning("Are you sure you want to save this form?", "Press cancel to undo this action.", "Yes");
		if (result.isConfirmed) {
			Inertia.post(route('inspection.management.store'), data, {
				preserveState: true,
				onStart () {
					setLoading(true);
				},
				onFinish () {
					setLoading(false);
				}
			});
		}
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
					<InspectionCloseoutForm setCompleted={setCompleted} />
				</Box>

				<Box display={activeStep !== 2 ? "none" : "block"}>
					<TimeFrame />
				</Box>

				<Box display={activeStep !== 3 ? "none" : "block"}>
					<UnsatisfactoryItems />
				</Box>

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
					<LoadingButton loading={loading} variant="contained" size="large" onClick={activeStep === steps.length - 1 || (completed[3] && activeStep === 2) ? handleSubmit(onSubmit) : handleNext}>
						{activeStep === steps.length - 1 || (completed[3] && activeStep === 2) ? 'Create' : 'Next'}
					</LoadingButton>
				</Box>
			</Card>
		</FormProvider>
	)
}

export default InspectionNewForm