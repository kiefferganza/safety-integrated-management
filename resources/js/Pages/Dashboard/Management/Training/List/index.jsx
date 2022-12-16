import DashboardLayout from '@/Layouts/dashboard/DashboardLayout';
import TrainingList from './TrainingList';

const index = ({ trainings, module }) => {

	return (
		<DashboardLayout>
			<TrainingList trainings={trainings} module={module} />
		</DashboardLayout>
	)
}

export default index