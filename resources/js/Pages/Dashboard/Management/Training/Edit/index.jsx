import { useEffect, useState } from "react";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import TrainingCreatePage from "../Create/TrainingCreatePage";

const index = ({ training }) => {
	const [trainingData, setTrainingData] = useState({});

	const joinTrainees = () => {
		const newTrainees = training.trainees.map(tr => {
			const file = training.training_files.find(f => f.training_id === tr.pivot.training_id && f.emp_id === tr.employee_id);
			return {
				...tr,
				emp_id: tr.employee_id,
				fullname: `${tr.firstname} ${tr.lastname}`,
				position: tr?.position?.position,
				src: file ? file.src : null
			};
		});
		return newTrainees;
	}

	useEffect(() => {
		if (training) {
			setTrainingData({
				...training,
				trainees: joinTrainees(),
			});
		}
	}, [training]);

	return (
		<DashboardLayout>
			<TrainingCreatePage isEdit currentTraining={trainingData} />
		</DashboardLayout>
	)
}

export default index