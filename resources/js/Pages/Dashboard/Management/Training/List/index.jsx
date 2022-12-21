import DashboardLayout from '@/Layouts/dashboard/DashboardLayout';
import TrainingList from './TrainingList';

const index = ({ trainings, module, url, type }) => {

	return (
		<DashboardLayout>
			<TrainingList trainings={trainings} module={module} url={url} type={type} />
		</DashboardLayout>
	)
}

export default index