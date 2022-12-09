import { useEffect } from "react";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import EmployeeListPage from "./EmployeeListPage";
import { useDispatch } from "react-redux";
import { setEmployees } from "@/redux/slices/employee";

const index = ({ employees, unassignedUsers }) => {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(setEmployees(employees));
	}, [dispatch]);

	return (
		<DashboardLayout>
			<EmployeeListPage employees={employees} unassignedUsers={unassignedUsers} canWrite={true} />
		</DashboardLayout>
	)
}

export default index