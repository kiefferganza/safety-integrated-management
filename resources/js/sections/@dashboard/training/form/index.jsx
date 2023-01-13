import PropTypes from 'prop-types';
import { useState, useMemo, useEffect } from 'react';
import { usePage } from '@inertiajs/inertia-react';
import * as Yup from 'yup';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Card, Stack } from '@mui/material';
// components
import FormProvider from '@/Components/hook-form';
//
import TrainingProjectDetails from './TrainingProjectDetails';
import TrainingNewEditDetails from './TrainingNewEditDetails';
import { Inertia } from '@inertiajs/inertia';

// ----------------------------------------------------------------------

TrainingNewEditForm.propTypes = {
	isEdit: PropTypes.bool,
	currentTraining: PropTypes.object,
};

export default function TrainingNewEditForm ({ isEdit, currentTraining }) {
	const { trainings, type } = usePage().props;
	const [loadingSend, setLoadingSend] = useState(false);

	const newTrainingSchema = Yup.object().shape({
		project_code: Yup.string().required('Project Code is required'),
		originator: Yup.string().required('Originator is required'),
		discipline: Yup.string().required('Discipline is required'),
		document_type: Yup.string().required('Project Type is required'),
		title: Yup.string().required('Course title is required'),
		location: Yup.string().required('Location is required'),
		trainer: Yup.string().required('Trainer is required'),
		contract_no: Yup.string().required("Contract no. is required"),
		training_hrs: Yup.string().required('Training hours is required'),
		trainees: Yup.array().min(1, "Please add at least 1 participant"),
		training_date: Yup.string().required("Please add date range"),
		date_expired: Yup.string().required("Please add date range"),
		type: Yup.string().required("Please select course type"),
		// External
		reviewed_by: Yup.string().when("type", (type, schema) => type == "3" ? schema.required("Please select a reviwer") : schema.notRequired()),
		approved_by: Yup.string().when("type", (type, schema) => type == "3" ? schema.required("Please select an approval") : schema.notRequired()),
		currency: Yup.string().when("type", (type, schema) => type == "3" ? schema.required("Please select currency type") : schema.notRequired()),
		course_price: Yup.string().when("type", (type, schema) => type == "3" ? schema.required("Please add a price") : schema.notRequired()),
		training_center: Yup.string().when("type", (type, schema) => type == "3" ? schema.required("Training center is required") : schema.notRequired()),
	});

	const defaultValues = useMemo(() => ({
		sequence_no: currentTraining?.sequence_no || '',
		project_code: currentTraining?.project_code || '',
		originator: currentTraining?.originator || '',
		discipline: currentTraining?.discipline || '',
		document_type: currentTraining?.document_type || '',
		document_zone: currentTraining?.document_zone || '',
		document_level: currentTraining?.document_level || '',
		title: currentTraining?.title || '',
		location: currentTraining?.location || '',
		contract_no: currentTraining?.contract_no || '',
		trainer: currentTraining?.trainer || '',
		training_hrs: currentTraining?.training_hrs || '',
		training_date: currentTraining?.training_date || '',
		date_expired: currentTraining?.date_expired || '',
		trainees: currentTraining?.trainees || [],
		type: currentTraining?.type || type || "2",
		training_center: currentTraining?.training_center || '',
		reviewed_by: currentTraining?.external_details?.reviewed_by || '',
		approved_by: currentTraining?.external_details?.approved_by || '',
		currency: currentTraining?.external_details?.currency || '',
		course_price: currentTraining?.external_details?.course_price || '',
		remarks: currentTraining?.remarks || ''
	}), [currentTraining]);

	const methods = useForm({
		resolver: yupResolver(newTrainingSchema),
		defaultValues,
	});

	const {
		reset,
		handleSubmit,
		setValue,
		formState: { isDirty }
	} = methods;
	const setSequenceNumber = (trType) => {
		if (!currentTraining?.sequence_no && trainings) {
			const trs = trainings.filter(tr => tr.type === trType ? +trType : currentTraining?.type);
			const numOfLen = trs.length.toString().length;
			setValue("sequence_no", "0".repeat(numOfLen === 1 ? 2 : numOfLen) + ((trs.length + 1) + ""));
		}
	}

	useEffect(() => {
		if (isEdit && currentTraining) {
			reset(defaultValues);
			setSequenceNumber(type)
		}
		if (!isEdit) {
			reset(defaultValues);
			setSequenceNumber(type)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isEdit, currentTraining, trainings]);

	const handleCreateAndSend = async (data) => {
		try {
			if (isEdit) {
				Inertia.post(`/dashboard/training/${currentTraining.training_id}/edit`, data, {
					preserveScroll: true,
					resetOnSuccess: false,
					onStart () {
						setLoadingSend(true);
					},
					onSuccess () {
						reset(defaultValues);
					},
					onFinish () {
						setLoadingSend(false);
					}
				});
			} else {
				Inertia.post(route('training.management.store'), data, {
					preserveScroll: true,
					onStart () {
						setLoadingSend(true);
					},
					onSuccess () {
						reset();
					},
					onFinish () {
						setLoadingSend(false);
					}
				});
			}
		} catch (error) {
			console.error(error);
			setLoadingSend(false);
		}
	};

	return (
		<FormProvider methods={methods}>
			<Card>

				<TrainingProjectDetails isEdit={isEdit} updateSequence={setSequenceNumber} />

				<TrainingNewEditDetails isEdit={isEdit} currentTraining={currentTraining} />

			</Card>

			<Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
				<LoadingButton
					size="large"
					variant="contained"
					loading={loadingSend}
					onClick={handleSubmit(handleCreateAndSend)}
					disabled={isEdit ? !isDirty : false}
				>
					{isEdit ? 'Update' : 'Create'}
				</LoadingButton>
			</Stack>
		</FormProvider>
	);
}
