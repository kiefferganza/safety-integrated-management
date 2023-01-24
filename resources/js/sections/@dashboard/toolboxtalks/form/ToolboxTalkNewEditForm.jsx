import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Inertia } from '@inertiajs/inertia';
// @mui
import { LoadingButton } from '@mui/lab';
import { Card, Stack } from '@mui/material';
// utils
import { PATH_DASHBOARD } from '@/routes/paths';
// components
import FormProvider from '@/Components/hook-form';
import { usePage } from '@inertiajs/inertia-react';
import ToolboxTalkProjectDetails from './ToolboxTalkProjectDetails';
import ToolboxTalkDetails from './ToolboxTalkDetails';
import { format, formatISO } from 'date-fns';

// ----------------------------------------------------------------------

ToolboxTalkNewEditForm.propTypes = {
	tbt: PropTypes.object,
	isEdit: PropTypes.bool,
};

export default function ToolboxTalkNewEditForm ({ isEdit = false, tbt = {} }) {
	const [loading, setLoading] = useState(false);
	const { sequences, participants, tbt_type, errors: resErrors } = usePage().props;

	const NewTBTSchema = Yup.object().shape({
		project_code: Yup.string().required('Project Code is required'),
		originator: Yup.string().required('Originator is required'),
		discipline: Yup.string().required('Discipline is required'),
		document_type: Yup.string().required('Project Type is required'),
		title: Yup.string().required('Course title is required'),
		location: Yup.string().required('Station/Location is required'),
		contract_no: Yup.string().required("Contract no. is required"),
		tbt_type: Yup.string().required("Please select toolboxtalks type"),
		conducted_by: Yup.string().required("Please select a personel"),
		date_conducted: Yup.string().nullable().required("Conducted Date is required"),
		time_conducted: Yup.string().nullable().required("Time conducted is required"),
		description: Yup.string().required("Job description is required"),
		moc_wo_no: Yup.string().required("MOC/WO is required"),
		site: Yup.string().required("Site/Shop in charge is required"),
		participants: Yup.array().of(Yup.object().shape({
			employee_id: Yup.string().required(),
			selected: Yup.boolean(),
			time: Yup.string().when("selected", (selected, schema) => selected ? schema.nullable().required("Time is required") : schema.notRequired())
		})).test({
			name: 'participants_required',
			message: 'Please add at least 1 participant',
			test: (val) => val.some(v => v.selected),
		}),
	});

	const defaultValues = useMemo(() => ({
		sequence_no: tbt?.sequence_no || isEdit ? sequences[tbt?.tbt_type] : sequences[tbt_type] || '',
		project_code: tbt?.project_code || '',
		originator: tbt?.originator || '',
		discipline: tbt?.discipline || '',
		document_type: tbt?.document_type || '',
		document_zone: tbt?.document_zone || '',
		document_level: tbt?.document_level || '',
		title: tbt?.title || '',
		location: tbt?.location || '',
		contract_no: tbt?.contract_no || '',
		tbt_type: tbt?.tbt_type || tbt_type,
		conducted_by: tbt?.conducted_by || '',
		moc_wo_no: tbt?.moc_wo_no || '',
		site: tbt?.site || '',
		date_conducted: tbt?.date_conducted || null,
		time_conducted: tbt?.time_conducted ? formatISO(new Date(1999, 1, 1, tbt?.time_conducted.split(":")[0], tbt?.time_conducted.split(":")[1], 0), { representation: 'complete' }) : null,
		description: tbt?.description || "",
		participants: getParticipants(),
		img_src: [],
		status: tbt?.status || "0",
		remarks: tbt?.remarks || ""
	}), [tbt]);

	function getParticipants () {
		const date = new Date();

		const p = participants.map(p => {
			let isSelected = null;
			if (tbt?.participants) {
				isSelected = tbt.participants.find(participant => participant.employee_id === p.employee_id);
			}

			return {
				...p,
				selected: isSelected ? true : false,
				time: isSelected ? isSelected?.pivot?.time : "",
				timeRaw: isSelected ? date.setHours(isSelected.pivot.time == 24 ? 0 : +isSelected.pivot.time) : null
			}
		});
		return p;
	}


	const methods = useForm({
		resolver: yupResolver(NewTBTSchema),
		defaultValues,
	});

	const {
		handleSubmit,
		reset,
		setError,
		setValue,
		formState: { isDirty }
	} = methods;

	useEffect(() => {
		if (isEdit && tbt) {
			reset(defaultValues);
			const files = tbt?.file?.map((f) => (
				{
					path: `/storage/media/toolboxtalks/${f.img_src}`,
					name: f.img_src.split('/').at(-1),
					preview: `/storage/media/toolboxtalks/${f.img_src}`,
					id: f.tbt_img_id,
					lastModified: new Date().getTime(),
					lastModifiedDate: new Date()
				}
			))

			setValue("img_src", files);
		}
		if (!isEdit) {
			reset(defaultValues);
		}
		if (Object.keys(resErrors).length !== 0) {
			for (const key in resErrors) {
				setError(key, { type: "custom", message: resErrors[key] });
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isEdit, tbt, resErrors]);


	const onSubmit = async (data) => {
		let newData = {
			...data,
			time_conducted: format(new Date(data.time_conducted), 'HH:mm'),
			participants: data.participants.filter(p => p.selected),
			status: data.img_src.length > 0 ? 1 : 0
		};

		if (isEdit && tbt) {
			const removed_files = tbt.file.filter((prevFile) => data.img_src.findIndex(f => f.id == prevFile.tbt_img_id
			) === -1);
			newData.removed_files = removed_files;

			const files = data.img_src.filter(f => f instanceof File);
			newData.img_src = files;
		}

		Inertia.post(isEdit && tbt ? PATH_DASHBOARD.toolboxTalks.edit(tbt.tbt_id) : route("toolboxtalk.management.store"), newData,
			{
				preserveScroll: true,
				preserveState: true,
				onStart () {
					setLoading(true);
				},
				onFinish () {
					setLoading(false);
				}
			}
		);
	};

	return (
		<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
			<Card>

				<ToolboxTalkProjectDetails isEdit={isEdit} />

				<ToolboxTalkDetails participants={participants} sequences={sequences} isEdit={isEdit} />

			</Card>

			<Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
				<LoadingButton
					size="large"
					variant="contained"
					loading={loading}
					onClick={handleSubmit(onSubmit)}
					disabled={isEdit ? !isDirty : false}
				>
					{isEdit ? 'Update' : 'Create'}
				</LoadingButton>
			</Stack>
		</FormProvider>
	);
}
