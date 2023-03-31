import { useState } from "react";
import { Link, usePage } from "@inertiajs/inertia-react"
import { Inertia } from '@inertiajs/inertia';
import capitalize from "lodash/capitalize";
import startCase from "lodash/startCase";
// @mui
import {
	Card,
	Typography,
	Stack,
	List,
	ListItem,
	ListItemText,
	Switch,
	Grid,
	FormControlLabel,
	ListItemButton,
	Collapse,
	CircularProgress,
	Backdrop,
	Button,
	CardHeader,
	TableContainer,
	TableCell,
	TableHead,
	TableRow,
	Table,
	Avatar,
	TableBody
} from '@mui/material';
// components
import Iconify from '@/Components/iconify';
import Label from '@/Components/label';
import ProfileAbout from "./home/ProfileAbout";
import Scrollbar from "@/Components/scrollbar";
import { TableNoData, TablePaginationCustom, useTable } from "@/Components/table";
import usePermission from "@/hooks/usePermission";


const TABLE_HEAD = [
	{ id: 'index', label: '#' },
	{ id: 'fullname', label: 'Name', align: 'left' },
	{ id: 'email', label: 'Email', align: 'left' },
	{ id: 'status', label: 'Status', align: 'left' },
	{ id: '' },
];



const ProfilePermissions = () => {
	const { permissions, userRole, user } = usePage().props;
	const [hasPermission] = usePermission();
	const {
		dense,
		page,
		rowsPerPage,
		//
		onChangeDense,
		onChangePage,
		onChangeRowsPerPage,
	} = useTable();

	const [expanded, setExpanded] = useState(() => {
		const titles = Object.keys(permissions).reduce((acc, curr) => ({ ...acc, [curr]: false }), {});
		titles.User = true;
		titles.Employee = true;
		titles.Training = true;
		return titles;
	});
	const [openBackdrop, setOpenBackdrop] = useState(false);

	const handleTogglePermission = (event) => {
		const { name, checked } = event.target;
		Inertia.put(route("management.user.updateUserPermission", user.user_id), { name, isAllowed: checked }, {
			preserveScroll: true,
			preserveState: true,
			onStart () {
				setOpenBackdrop(true);
			},
			onFinish () {
				setOpenBackdrop(false);
			}
		});
	};

	const handleUpdateUserStatus = () => {
		const newRoute = user.status === 1 ? "management.user.deactivate" : "management.user.activate";
		Inertia.put(route(newRoute, user.user_id), {}, {
			preserveScroll: true,
			preserveState: true,
			onStart () {
				setOpenBackdrop(true);
			},
			onFinish () {
				setOpenBackdrop(false);
			}
		})
	}

	const hasUserAccessPermission = hasPermission("user_access");

	return (
		<>
			<Stack direction="row" alignItems="center" justifyContent="space-between">
				<Typography variant="h4" sx={{ my: 5 }}>
					Permissions
				</Typography>
				<Label
					color={(userRole === "User" && 'warning') || (userRole === "Moderator" && "info") || 'success'}
				>
					{userRole}
				</Label>
			</Stack>
			<Grid container spacing={2}>
				<Grid item xs={12} md={6}>
					<Card sx={{ position: "relative" }}>
						{Object.entries(permissions).map(([title, permissionList], idx) => (
							<List
								key={idx}
								sx={{ width: '100%' }}
							>
								<ListItemButton
									onClick={() => {
										setExpanded((currState) => ({
											...currState,
											[title]: !currState[title]
										}));
									}}
									alignItems="flex-start"
									sx={{
										py: 2.5,
									}}
									divider
								>
									<ListItemText
										primary={title}
										primaryTypographyProps={{
											fontSize: 14,
											fontWeight: 'medium',
											lineHeight: '20px',
											mb: '2px',
											color: "text.secondary"
										}}
										sx={{ my: 0 }}
									/>
									<Iconify
										icon="material-symbols:keyboard-arrow-down"
										sx={{
											color: "text.secondary",
											transform: expanded[title] ? 'rotate(-180deg)' : 'rotate(0)',
											transition: '0.2s',
										}}
									/>
								</ListItemButton>
								<Collapse in={expanded[title]} timeout="auto" unmountOnExit>
									{permissionList.map((permission) => (
										<ListItem dense disableGutters divider key={permission.value}>
											<ListItemButton>
												<FormControlLabel
													sx={{
														width: 1,
														ml: 0,
														"& .MuiFormControlLabel-label": {
															width: 1
														}
													}}
													control={
														<Switch
															edge="end"
															name={permission.value}
															onChange={handleTogglePermission}
															checked={permission.hasPermission}
															inputProps={{ 'aria-label': 'controlled' }}
														/>
													}
													label={
														<ListItemText
															primaryTypographyProps={{
																fontSize: 16,
																fontWeight: 'medium'
															}}
															primary={permission.name}
															secondary={permission.detail}
															secondaryTypographyProps={{
																fontSize: 12,
																fontWeight: 'medium'
															}}
														/>
													}
													labelPlacement="start"
												/>
											</ListItemButton>
										</ListItem>
									))}
								</Collapse>
							</List>
						))}
						{!hasUserAccessPermission && (
							<Backdrop
								open={true}
								sx={{
									color: "#FFFFFF",
									position: "absolute",
									backdropFilter: "blur(.5px)",
									backgroundColor: "rgba(245, 245, 245, 0.8)"
								}}>
								<Stack alignItems="center">
									<Iconify icon="material-symbols:lock" width={32} sx={{ color: "text.secondary" }} />
									<Typography variant="h6" sx={{ fontWeight: 'medium', color: "text.secondary" }}>No access</Typography>
								</Stack>
							</Backdrop>
						)}
					</Card>
				</Grid>
				<Grid item xs={12} md={6}>
					<Stack spacing={2}>
						<ProfileAbout
							quote={user?.employee?.about}
							country={capitalize(user?.employee?.country)}
							email={user.email}
							role={capitalize(user?.employee?.position?.position)}
							company={capitalize(user?.employee?.company?.company_name)}
							department={startCase(user?.employee?.department?.department?.toLowerCase())}
							name={user?.fullname}
							action={
								<Stack direction="row" spacing={2} sx={{ pt: 1.5 }}>
									<Button
										href={route("management.user.edit", user.username)}
										component={Link}
										preserveScroll
										variant="contained"
										startIcon={<Iconify icon="material-symbols:edit" />}
										color="info"
									>
										Edit
									</Button>
									{hasUserAccessPermission && (
										<Button
											variant="contained"
											startIcon={<Iconify icon={user.status === 1 ? "ic:baseline-warning" : "carbon:checkmark-filled-warning"} />}
											color={user.status === 1 ? "error" : "success"}
											onClick={handleUpdateUserStatus}
										>
											{user.status === 1 ? "Deactivate" : "Activate"} Account
										</Button>
									)}
								</Stack>
							}
						/>
						<Card>
							<CardHeader title="Created Employees" />
							<TableContainer>
								<Scrollbar>
									<Table size={dense ? 'small' : 'medium'}>
										<TableHead>
											<TableRow>
												{TABLE_HEAD.map((headCell) => (
													<TableCell
														key={headCell.id}
														align={headCell.align || 'left'}
													>
														{headCell.label}
													</TableCell>
												))}
											</TableRow>
										</TableHead>
										<TableBody>
											{user.created_employees.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, idx) => (
												<TableRow key={row.employee_id}>
													<TableCell>{idx + 1}</TableCell>
													<TableCell>
														<Stack direction="row" alignItems="center" spacing={2}>
															<Avatar alt={row.fullname} src={row?.img_src ? `/storage/media/photos/employee/${row.img_src}` : null} />

															<Typography variant="subtitle2" noWrap>
																{row.fullname}
															</Typography>
														</Stack>
													</TableCell>
													<TableCell>{row.email}</TableCell>
													<TableCell>
														<Label color={row.is_active === 0 ? "success" : "error"}>
															{row.is_active === 0 ? "active" : "inactive"}
														</Label>
													</TableCell>
												</TableRow>
											))}
											<TableNoData />
										</TableBody>
									</Table>
								</Scrollbar>
							</TableContainer>
							<TablePaginationCustom
								count={user.created_employees.length}
								page={page}
								rowsPerPage={rowsPerPage}
								onPageChange={onChangePage}
								onRowsPerPageChange={onChangeRowsPerPage}
								//
								dense={dense}
								onChangeDense={onChangeDense}
							/>
						</Card>
					</Stack>
				</Grid>
			</Grid>
			<Backdrop open={openBackdrop}>
				<CircularProgress />
			</Backdrop>
		</>
	)
}

export default ProfilePermissions