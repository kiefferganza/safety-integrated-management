import PropTypes from 'prop-types';
import { Inertia } from '@inertiajs/inertia';
import { PATH_DASHBOARD } from '@/routes/paths';
import { useSwal } from '@/hooks/useSwal';
// form
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
const { Stack, Dialog, Button, DialogTitle, DialogContent, DialogActions } = await import('@mui/material');
// components
import FormProvider from '@/Components/hook-form/FormProvider';
import { RHFTextField } from '@/Components/hook-form';
import { capitalCase } from 'change-case';

// ----------------------------------------------------------------------

const approveFailSchema = Yup.object().shape({
	remarks: Yup.string().nullable()
});

export const ExternalApproveFailDialog = ({
	title = 'Action',
	open,
	onClose,
	trainingId,
	type,
	statusType,
	onSubmit,
	...other
}) => {
	const { load, stop } = useSwal();
	const methods = useForm({
		resolver: yupResolver(approveFailSchema)
	});
	const { handleSubmit, reset } = methods;

	const saveStatus = (data) => {
		Inertia.post(route('training.management.external.external_approve_or_deny', trainingId), { ...data, type, statusType }, {
			preserveScroll: true,
			onStart () {
				handleClose();
				load("Updating status", "please wait...");
			},
			onFinish () {
				stop();
			}
		});
	}

	const handleClose = () => {
		onClose();
		reset();
	}
	return (
		<Dialog fullWidth maxWidth="sm" open={open} onClose={handleClose} {...other}>
			<Stack direction="row" justifyContent="space-between">
				<DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}>{title}</DialogTitle>
				<DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}>{capitalCase(statusType)}</DialogTitle>
			</Stack>

			<FormProvider methods={methods}>
				<DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
					<Stack spacing={2}>
						<RHFTextField name="remarks" label="Remarks (Optional)" multiline rows={2} />
					</Stack>
				</DialogContent>

				<DialogActions>
					<Stack direction="row" justifyContent="flex-end" flexGrow={1}>
						<Button variant="soft" onClick={handleSubmit(saveStatus)}>
							Save
						</Button>
					</Stack>
				</DialogActions>
			</FormProvider>
		</Dialog>
	);
}

ExternalApproveFailDialog.propTypes = {
	open: PropTypes.bool,
	onClose: PropTypes.func,
	title: PropTypes.string,
	type: PropTypes.string,
	trainingId: PropTypes.number,
	statusType: PropTypes.string
};