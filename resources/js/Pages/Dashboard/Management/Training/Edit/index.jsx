import { Suspense, useEffect, useState, lazy } from "react";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
const TrainingEditCreatePage = lazy(() => import("../TrainingEditCreatePage"));
import LoadingScreen from "@/Components/loading-screen/LoadingScreen";

const index = ({ training, details, projectDetails }) => {
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
		<Suspense fallback={<LoadingScreen />}>
			<DashboardLayout>
				<TrainingEditCreatePage details={details} isEdit currentTraining={trainingData} projectDetails={projectDetails} />
			</DashboardLayout>
		</Suspense>
	)
}

export default index