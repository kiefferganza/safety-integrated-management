import PropTypes from 'prop-types';
import { useState } from 'react';
import { usePage } from '@inertiajs/inertia-react';
// @mui
import { Box, Card, Button, Typography, Stack, useTheme, Divider } from '@mui/material';
// components
import Iconify from '@/Components/iconify';
import Scrollbar from '@/Components/scrollbar';
import TrainingAnalitic from '../../training/TrainingAnalitic';
import Label from '@/Components/label';
import { getTrainingStatus } from '@/utils/formatDates';

// ----------------------------------------------------------------------

EmployeeTrainings.propTypes = {
	trainings: PropTypes.array,
};

export default function EmployeeTrainings ({ trainings }) {
	const theme = useTheme();
	const { trainingTypes } = usePage().props;

	const getTrainingByType = (type) => trainings.filter((item) => item.type === type);
	const getPercentByType = (type) => (getTrainingByType(type).length / trainings.length) * 100;

	const getTotalHours = (trainings_arr) => trainings_arr.reduce((acc, curr) => acc += curr.training_hrs, 0);

	return (
		<>
			<Typography variant="h4" sx={{ my: 5 }}>
				Trainings
			</Typography>

			<Card sx={{ mb: 5 }}>
				<Scrollbar>
					<Stack
						direction="row"
						divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
						sx={{ py: 2 }}
					>

						<TrainingAnalitic
							title="Total"
							total={trainings.length}
							hours={getTotalHours(trainings)}
							percent={100}
							icon="mingcute:certificate-2-fill"
							color={theme.palette.primary.main}
						/>

						{trainingTypes.map(type => (
							<TrainingAnalitic
								key={type.training_type_id}
								title={type.title}
								total={getTrainingByType(type.training_type_id).length}
								hours={getTotalHours(getTrainingByType(type.training_type_id))}
								percent={getPercentByType(type.training_type_id)}
								icon="mingcute:certificate-2-fill"
								color={theme.palette.primary.main}
							/>
						))}
					</Stack>
				</Scrollbar>
			</Card>

			<Box
				gap={3}
				display="grid"
				gridTemplateColumns={{
					xs: 'repeat(1, 1fr)',
					sm: 'repeat(2, 1fr)',
					md: 'repeat(3, 1fr)',
				}}
			>
				{trainings.map((training) => (
					<TrainingCard key={training.training_id} training={training} trainingTypes={trainingTypes} />
				))}
			</Box>
		</>
	);
}


// ----------------------------------------------------------------------

TrainingCard.propTypes = {
	training: PropTypes.shape({
		title: PropTypes.string,
		date_expired: PropTypes.string,
		training_hrs: PropTypes.number,
		type: PropTypes.number,
	}),
	trainingTypes: PropTypes.array
};

function TrainingCard ({ training, trainingTypes }) {
	const { title, training_hrs, date_expired, type } = training;

	const status = getTrainingStatus(date_expired);

	return (
		<Card
			sx={{
				p: 3,
				display: 'flex',
				alignItems: 'center',
			}}
		>
			<Box
				sx={{
					pl: 2,
					pr: 1,
					flexGrow: 1,
					minWidth: 0,
				}}
			>
				<Stack spacing={0.5} direction="row" alignItems="center" sx={{ color: 'text.secondary', mb: 1 }}>
					<Iconify icon="mingcute:certificate-2-fill" width={16} sx={{ flexShrink: 0 }} />

					<Typography variant="body2" component="span" noWrap>
						{trainingTypes.find(tt => tt.training_type_id === type)?.title}
					</Typography>
				</Stack>
				<Typography variant="subtitle2" noWrap>
					{title}
				</Typography>

				<Typography variant="body2" component="span" noWrap>
					{training_hrs} hours
				</Typography>
			</Box>

			<Label
				variant="soft"
				sx={{ textTransform: "capitalize" }}
				color={status.color}
			>
				{status.text}
			</Label>
		</Card>
	);
}
