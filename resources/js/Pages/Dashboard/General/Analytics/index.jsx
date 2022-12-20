import { useEffect, useState } from 'react';
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from "@inertiajs/inertia-react";
import GeneralAnalyticsPage from "./GeneralAnalyticsPage";

const index = ({ auth: { user }, toolboxtalks, trainees }) => {
	const [data, setData] = useState({
		mainContractors: 0,
		manHoursWorks: 0,
		trainingHours: 0,
		tbt: 0
	});

	useEffect(() => {
		const { mainContractors, manHoursWorks } = toolboxtalks.reduce((acc, curr) => {
			const { contractors, hours } = curr.participants.reduce((a, c) => {
				if (c.company_type === 'main contractor') {
					a.contractors++;
				}
				a.hours += c.pivot.time;
				return a;
			}, {
				contractors: 0,
				hours: 0
			});

			acc.mainContractors += contractors;
			acc.manHoursWorks += hours;
			return acc;
		}, {
			mainContractors: 0,
			manHoursWorks: 0
		});
		setData({
			mainContractors,
			manHoursWorks,
			trainingHours: parseInt(trainees?.total_hours || 0),
			tbt: toolboxtalks.length
		});
	}, []);

	return (
		<>
			<Head>
				<title> General: Analytics</title>
			</Head>
			<DashboardLayout>
				<GeneralAnalyticsPage user={user} data={data} />
			</DashboardLayout>
		</>
	)
}

export default index