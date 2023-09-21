import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Inertia } from '@inertiajs/inertia';
import { useSwal } from '@/hooks/useSwal';
// form
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
const { Stack, Dialog, Button, DialogTitle, DialogContent, DialogActions, FormHelperText } = await import('@mui/material');
// components
import FormProvider from '@/Components/hook-form/FormProvider';
import { RHFSelect, RHFTextField } from '@/Components/hook-form';



// ----------------------------------------------------------------------

ExternalReplyDialog.propTypes = {
	open: PropTypes.bool,
	onClose: PropTypes.func,
	title: PropTypes.string,
};

const newReplySchema = Yup.object().shape({
	reply_code: Yup.string().required('Comment code is required.'),
	reply: Yup.string().required('Please select atleast one page.').max(255)
});

export function ExternalReplyDialog ({
	title = 'Reply',
	open,
	onClose,
	response_id,
	...other
}) {
	const { load, stop } = useSwal();
	const methods = useForm({
		resolver: yupResolver(newReplySchema)
	});
	const { handleSubmit, reset } = methods;

	const postReply = (data) => {
		Inertia.post(route('training.management.external.external_reply', response_id), data, {
			preserveScroll: true,
			onStart () {
				handleClose();
				load("Posting reply.", "please wait...");
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
			<DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}> {title} </DialogTitle>

			<FormProvider methods={methods}>
				<DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
					<Stack spacing={2}>
						<RHFSelect name="reply_code" label="Reply Code">
							<option value=""></option>
							<option value="i">i</option>
							<option value="ii">ii</option>
						</RHFSelect>
						<FormHelperText sx={{ marginLeft: "16px !important", marginTop: "0 !important" }}>i = Incorporated, ii = Evaluated and not incorporated for reason stated</FormHelperText>
						<RHFTextField name="reply" label="Reply" multiline rows={2} />
					</Stack>
				</DialogContent>

				<DialogActions>
					<Stack direction="row" justifyContent="flex-end" flexGrow={1}>
						<Button variant="soft" onClick={handleSubmit(postReply)}>
							Reply
						</Button>
					</Stack>
				</DialogActions>
			</FormProvider>
		</Dialog>
	);
}
