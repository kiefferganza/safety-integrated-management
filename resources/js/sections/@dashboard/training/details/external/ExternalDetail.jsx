import { useEffect, useState } from 'react';
import { Box, Card, Typography } from '@mui/material';
import TrainingToolbar from '../TrainingToolbar';
import { getTrainingStatus } from '@/utils/formatDates';
import ExternalDetailHead from './ExternalDetailHeader';
import ExternalDetailBody from './ExternalDetailBody';

const ExternalDetail = ({ training, type = "action" }) => {
	const [trainingData, setTrainingData] = useState({});

	const joinTrainees = () => {
		const newTrainees = training.trainees.map(tr => {
			const file = training.training_files.find(f => f.training_id === tr.pivot.training_id && f.emp_id === tr.employee_id);

			return {
				...tr,
				emp_id: tr.employee_id,
				fullname: `${tr.firstname} ${tr.lastname}`,
				position: tr?.position?.position,
				src: file?.url,
				filename: file?.src ? file?.src && file?.url ? file.src : "Not Found" : null
			};
		});
		return newTrainees;
	}

	useEffect(() => {
		if (training) {
			setTrainingData({
				...training,
				id: training.training_id,
				cms: training?.project_code ? `${training?.project_code}-${training?.originator}-${training?.discipline}-${training?.document_type}-${training?.document_zone ? training?.document_zone + "-" : ""}${training?.document_level ? training?.document_level + "-" : ""}${training?.sequence_no}` : null,
				trainees: joinTrainees(),
				status: getTrainingStatus(training.training_date, training.date_expired),
			});
		}
	}, []);

	return (
		<>
			<TrainingToolbar training={trainingData} module="External" />
			<Card sx={{ pt: { xs: 3, md: 5 }, px: { xs: 3, md: 8 } }}>
				<ExternalDetailHead training={trainingData} />
				<ExternalDetailBody
					external_details={training.external_details}
					external_comments={training.external_comments}
					external_status={training.external_status}
					training_id={training.training_id}
					type={type}
				/>
				<Box sx={{ my: 2 }}>
					<Typography textAlign="center" variant="body2">&copy; FIAFI Group Company, {new Date().getFullYear()}. All Rights Reserved.</Typography>
				</Box>
			</Card>
		</>
	);
}


export default ExternalDetail