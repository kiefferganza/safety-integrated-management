import DashboardLayout from '@/Layouts/dashboard/DashboardLayout';
import TrainingClientList from './TrainingClientList';

const index = ({ trainings }) => {

	return (
		<DashboardLayout>
			<TrainingClientList trainings={trainings} />
		</DashboardLayout>
	)
}

export default index