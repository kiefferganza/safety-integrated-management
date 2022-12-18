import { useEffect, useState } from "react";
import { Container } from "@mui/material";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
// components
import { useSettingsContext } from '@/Components/settings';
import CustomBreadcrumbs from '@/Components/custom-breadcrumbs';
// sections
import TrainingDetails from '@/sections/@dashboard/training/details';
import { Head } from '@inertiajs/inertia-react';
import { PATH_DASHBOARD } from "@/routes/paths";

import { getTrainingStatus } from "@/utils/formatDates";
import { capitalCase } from "change-case";

const index = ({ training, module, url }) => {
	const { themeStretch } = useSettingsContext();
	const [trainingData, setTrainingData] = useState({});

	const joinTrainees = () => {
		const newTrainees = training.trainees.map(tr => {
			const file = training.training_files.find(f => f.training_id === tr.pivot.training_id && f.emp_id === tr.employee_id);
			return {
				...tr,
				emp_id: tr.employee_id,
				fullname: `${tr.firstname} ${tr.lastname}`,
				position: tr?.position?.position,
				src: file ? `/storage/media/training/${file.src}` : null,
				filename: file?.src || null
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
			<Head>
				<title>{capitalCase(module)}</title>
			</Head>
			<DashboardLayout>
				<Container maxWidth={themeStretch ? false : 'lg'}>
					<CustomBreadcrumbs
						heading="Course Details"
						links={[
							{ name: 'Dashboard', href: PATH_DASHBOARD.root },
							{
								name: `${module} List`,
								href: PATH_DASHBOARD.training[url],
							},
							{ name: capitalCase(module) },
						]}
					/>

					<TrainingDetails training={trainingData} module={module} />
				</Container>
			</DashboardLayout>
		</>
	)
}

export default index