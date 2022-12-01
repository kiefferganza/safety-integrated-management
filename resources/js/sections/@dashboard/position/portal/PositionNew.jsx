import PropTypes from 'prop-types';
import { Stack, Dialog, Button, DialogTitle, DialogContent, DialogActions, Box } from '@mui/material';
import Iconify from '@/Components/iconify';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { RHFTextField } from '@/Components/hook-form';

const PositionNew = ({
	title = 'Add Position',
	open,
	onClose,
	//
	onCreate,
	onUpdate,
	...other
}) => {

	const { control, setValue, watch, resetField, handleSubmit } = useFormContext();
	const { fields, append, remove } = useFieldArray({
		control,
		name: 'positionItems',
	});

	const handleAdd = () => append({ position: "" });

	const handleRemove = (index) => {
		remove(index);
	};

	return (
		<Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} {...other}>
			<DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}> {title} </DialogTitle>

			<DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
				<Stack spacing={1}>
					{(onCreate || onUpdate) && (
						fields.map((item, index) => (
							<Stack key={item.id} alignItems="flex-end" spacing={1.5}>
								<RHFTextField
									key={item.id}
									name={`positionItems[${index}].position`}
									label="Position"
									fullWidth
								/>
								<Button
									size="small"
									color="error"
									startIcon={<Iconify icon="eva:trash-2-outline" />}
									onClick={() => handleRemove(index)}
								>
									Remove
								</Button>
							</Stack>
						))
					)}
					{(onCreate) && (
						<Box display="flex" alignItems="center" justifyContent="center">
							<Button size="small" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleAdd}>
								Add Item
							</Button>
						</Box>
					)}
				</Stack>
			</DialogContent>


			<DialogActions>
				{(onCreate || onUpdate) && (
					<Stack direction="row" justifyContent="flex-end" flexGrow={1}>
						<Button variant="soft" onClick={handleSubmit(onCreate || onUpdate)}>
							{onUpdate ? 'Save' : 'Create'}
						</Button>
					</Stack>
				)}
			</DialogActions>
		</Dialog>
	)
}

PositionNew.propTypes = {
	open: PropTypes.bool,
	onClose: PropTypes.func,
	title: PropTypes.string,
	onCreate: PropTypes.func,
	onUpdate: PropTypes.func,
};

export default PositionNew