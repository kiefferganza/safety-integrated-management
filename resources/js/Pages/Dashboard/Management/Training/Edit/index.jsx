import { useEffect, useState } from "react";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import TrainingEditCreatePage from "../TrainingEditCreatePage";

const index = ({ training, details }) => {
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

	// console.log({ module });

	return (
		<DashboardLayout>
			<TrainingEditCreatePage details={details} isEdit currentTraining={trainingData} />
		</DashboardLayout>
	)
}

export default index