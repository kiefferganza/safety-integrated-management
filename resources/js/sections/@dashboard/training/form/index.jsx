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
// routes
import { PATH_DASHBOARD } from '@/routes/paths';
// mock
import { _invoiceAddressFrom } from '../../../../_mock/arrays';
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
	const { sequence_no } = usePage().props;
	const [loadingSend, setLoadingSend] = useState(false);

	const NewUserSchema = Yup.object().shape({
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
		type: Yup.string().required("Please select course type")
	});

	const defaultValues = useMemo(
		() => ({
			sequence_no: currentTraining?.invoiceNumber || sequence_no || '',
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
			src: currentTraining?.src || null,
			training_hrs: '',
			training_date: '',
			date_expired: '',
			trainees: [],
			type: "2"
		}),
		[currentTraining]
	);

	const methods = useForm({
		resolver: yupResolver(NewUserSchema),
		defaultValues,
	});

	const {
		reset,
		handleSubmit
	} = methods;

	useEffect(() => {
		if (isEdit && currentTraining) {
			reset(defaultValues);
		}
		if (!isEdit) {
			reset(defaultValues);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isEdit, currentTraining]);

	const handleCreateAndSend = async (data) => {
		try {
			Inertia.post(route('training.management.store'), data, {
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
			setLoadingSend(false);
		} catch (error) {
			console.error(error);
			setLoadingSend(false);
		}
	};

	return (
		<FormProvider methods={methods}>
			<Card>

				<TrainingProjectDetails />

				<TrainingNewEditDetails />

			</Card>

			<Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
				<LoadingButton
					size="large"
					variant="contained"
					loading={loadingSend}
					onClick={handleSubmit(handleCreateAndSend)}
				>
					{isEdit ? 'Update' : 'Create'}
				</LoadingButton>
			</Stack>
		</FormProvider>
	);
}
