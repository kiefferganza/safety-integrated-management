import { lazy, Suspense } from 'react';
import LoadingScreen from '@/Components/loading-screen/LoadingScreen';
import { useEffect } from "react";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { useDispatch } from "react-redux";
import { setEmployees } from "@/redux/slices/employee";
const EmployeeListPage = lazy(() => import("./EmployeeListPage"));

const index = ({ employees, unassignedUsers }) => {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(setEmployees(employees));
	}, [dispatch]);

	return (
		<Suspense fallback={<LoadingScreen />}>
			<DashboardLayout>
				<EmployeeListPage employees={employees} unassignedUsers={unassignedUsers} />
			</DashboardLayout>
		</Suspense>
	)
}

export default index