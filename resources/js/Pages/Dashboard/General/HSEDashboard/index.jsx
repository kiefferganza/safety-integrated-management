import { lazy, Suspense, useEffect, useState } from 'react';
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from "@inertiajs/inertia-react";
const GeneralHSEDasboardPage = lazy(() => import("./GeneralHSEDasboardPage"));
import LoadingScreen from '@/Components/loading-screen/LoadingScreen';
import { convertTbtByYear } from '@/utils/convertTBt';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
// import { dispatch, useSelector } from '@/redux/store';
// import { getTbts } from '@/redux/slices/toolboxtalk';

const index = ({ auth: { user }, inspections, toolboxtalks, trainings, tbtStatistics, incidents, from, to }) => {
	const [loading, setLoading] = useState(false);
	const [totalTbtByYear, setTotalTbtByYear] = useState({});

	useEffect(() => {
		setLoading(true);
		setTotalTbtByYear(convertTbtByYear({ tbt: toolboxtalks }).totalTbtByYear);
		setLoading(false);
	}, [from, to, toolboxtalks]);

	return (
		<>
			<Head>
				<title> General: Analytics</title>
			</Head>
			<Backdrop open={loading} sx={{ overflow: "hidden" }}>
				<CircularProgress color="primary" />
			</Backdrop>
			<Suspense fallback={<LoadingScreen />}>
				<DashboardLayout>
					<GeneralHSEDasboardPage
						user={user}
						totalTbtByYear={totalTbtByYear}
						trainings={trainings}
						tbtStatistics={tbtStatistics}
						inspections={inspections}
						incidents={incidents}
						from={from}
						to={to}
						setLoading={setLoading}
					/>
				</DashboardLayout>
			</Suspense>
		</>
	)
}

export default index