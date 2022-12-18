import DashboardLayout from '@/Layouts/dashboard/DashboardLayout';
import TrainingList from './TrainingList';

const index = ({ trainings, module, url }) => {

	return (
		<DashboardLayout>
			<TrainingList trainings={trainings} module={module} url={url} />
		</DashboardLayout>
	)
}

export default index