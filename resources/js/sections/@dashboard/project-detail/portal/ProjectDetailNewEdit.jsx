import PropTypes from 'prop-types';
import { Stack, Dialog, Button, DialogTitle, DialogContent, DialogActions, Portal } from '@mui/material';
import FormProvider from '@/Components/hook-form/FormProvider';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { RHFMuiSelect, RHFTextField } from '@/Components/hook-form';
import * as Yup from 'yup';
import { Inertia } from '@inertiajs/inertia';
import { useSwal } from '@/hooks/useSwal';


const newProjectDetailSchema = Yup.object().shape({
	title: Yup.string().required('Please select a title'),
	value: Yup.string().required('Please enter a value for the title'),
});


const ProjectDetailNewEdit = ({
	dialogTitle = 'Add Project Detail',
	open,
	onClose,
	//
	isEdit = false,
	//
	title = '',
	value = '',
	titles = [],
	editDetail,
	...other
}) => {
	const { load, stop } = useSwal();
	const methods = useForm({
		defaultValues: {
			title: isEdit ? editDetail.title || '' : title,
			value: isEdit ? editDetail.value || '' : value
		},
		resolver: yupResolver(newProjectDetailSchema)
	});
	const { handleSubmit, reset, formState: { isDirty } } = methods;

	const onCreate = (data) => {
		Inertia.post(route('management.company_information.store'), data, {
			preserveScroll: true,
			onStart: () => {
				reset({
					title: '',
					value: ''
				});
				onClose();
				load("", "Please wait...");
			},
			onFinish: function () {
				stop()
			}
		});
	}

	const onUpdate = (data) => {
		Inertia.post(route('management.company_information.update', editDetail.id), data, {
			preserveScroll: true,
			onStart: () => {
				reset({
					title: '',
					value: ''
				});
				onClose();
				load("Updating " + editDetail.title, "Please wait...");
			},
			onFinish: function () {
				stop()
			}
		});
	}

	return (
		<Portal>
			<Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} {...other}>
				<DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}> {dialogTitle} </DialogTitle>

				<DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none', mb: 3 }}>
					<FormProvider methods={methods}>
						<Stack spacing={1.5}>
							<RHFMuiSelect label="Title" name="title" fullWidth options={titles} />
							<RHFTextField label="Value" name="value" fullWidth />
						</Stack>
					</FormProvider>
				</DialogContent>

				<DialogActions>
					<Stack direction="row" justifyContent="flex-end" flexGrow={1}>
						{isEdit ? (
							<Button variant="soft" onClick={handleSubmit(onUpdate)} disabled={!isDirty}>
								Save
							</Button>
						) : (
							<Button variant="soft" onClick={handleSubmit(onCreate)}>
								Create
							</Button>
						)}
					</Stack>
				</DialogActions>
			</Dialog>
		</Portal>
	)
}

ProjectDetailNewEdit.propTypes = {
	open: PropTypes.bool,
	onClose: PropTypes.func,
	title: PropTypes.string,
	onCreate: PropTypes.func,
	onUpdate: PropTypes.func,
	company: PropTypes.string,
	onCompanyChanged: PropTypes.func,
};

export default ProjectDetailNewEdit