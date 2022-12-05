import { useEffect } from "react";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import EmployeeListPage from "./EmployeeListPage";
import { useDispatch } from "react-redux";
import { setEmployees } from "@/redux/slices/employee";

const index = ({ employees, can_write_employee }) => {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(setEmployees(employees));
	}, [dispatch]);

	return (
		<DashboardLayout>
			<EmployeeListPage employees={employees} canWrite={can_write_employee} />
		</DashboardLayout>
	)
}

export default index