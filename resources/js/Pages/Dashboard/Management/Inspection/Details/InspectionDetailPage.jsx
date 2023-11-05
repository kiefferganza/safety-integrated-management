import { useMemo, useState } from 'react';
const { Box, Grid, Stack, Typography, Tab, Tabs } = await import("@mui/material");
import { HeadingTH, TCell, TRow } from "@/sections/@dashboard/inspection/form/styledInspectionForm";
import { getScoreColor } from "@/utils/inspection";
import Image from "@/Components/image";
import Iconify from "@/Components/iconify";
import Findings from '@/sections/@dashboard/inspection/details/Findings';
import { usePage } from '@inertiajs/inertia-react';
import Edit from '@/sections/@dashboard/inspection/edit/Edit';
import Review from '@/sections/@dashboard/inspection/edit/Review';
import Verify from '@/sections/@dashboard/inspection/edit/Verify';
import InspectionToolbar from '@/sections/@dashboard/inspection/details/InspectionToolbar';
import { fDate } from '@/utils/formatTime';

const InspectionDetailPage = ({ inspection, rolloutDate }) => {
	const { auth: { user } } = usePage().props;
	const [currentTab, setCurrentTab] = useState('details');

	const items = useMemo(() => {
		const sections = inspection.report_list.reduce((acc, curr) => {
			if (curr.ref_num >= 1 && curr.ref_num <= 6) {
				acc.sectionA.push(curr);
			} else if (curr.ref_num > 6 && curr.ref_num <= 13) {
				acc.sectionB.push(curr);
			} else if (curr.ref_num > 13 && curr.ref_num <= 21) {
				acc.sectionC.push(curr);
			} else if (curr.ref_num > 21 && curr.ref_num <= 31) {
				acc.sectionC_B.push(curr);
			} else if (curr.ref_num > 31 && curr.ref_num <= 34) {
				acc.sectionD.push(curr);
			} else if (curr.ref_num > 34 && curr.ref_num <= 40) {
				acc.sectionE.push(curr);
			}
			return acc;
		}, {
			sectionA: [],
			sectionB: [],
			sectionC: [],
			sectionC_B: [],
			sectionD: [],
			sectionE: []
		});
		const unsatisfactoryItems = inspection.report_list.filter(report => report.ref_score === 2 || report.ref_score === 3);
		return {
			sections,
			unsatisfactoryItems
		}
	}, [inspection]);

	const getInspectionType = ({ employee_id, reviewer_id, verifier_id, status, rolloutDate }) => {
		if (employee_id === user.emp_id) {
			return <Edit rolloutDate={rolloutDate} inspection={{ ...inspection, report_list: items.unsatisfactoryItems }} />;
		} else if (reviewer_id === user.emp_id && (status === 1 || status === 4)) {
			return <Review rolloutDate={rolloutDate} inspection={{ ...inspection, report_list: items.unsatisfactoryItems }} />;
		} else if (verifier_id === user.emp_id && status === 2) {
			return <Verify rolloutDate={rolloutDate} inspection={{ ...inspection, report_list: items.unsatisfactoryItems }} />;
		} else if (status !== 0) {
			return <Findings rolloutDate={rolloutDate} inspection={{ ...inspection, report_list: items.unsatisfactoryItems }} />;
		}
		return <Findings inspection={{ ...inspection, report_list: items.unsatisfactoryItems }} rolloutDate={rolloutDate} />;
	}
	const InspectionType = getInspectionType({
		employee_id: inspection.employee_id,
		reviewer_id: inspection.reviewer_id,
		verifier_id: inspection.verifier_id,
		status: inspection.status,
		rolloutDate
	});

	const TABS = [
		{
			value: 'details',
			label: 'Details',
			icon: <Iconify icon="heroicons:document-chart-bar" />,
			component: <InspectionDetails inspection={inspection} reports={items.sections} rolloutDate={rolloutDate} />,
		},
		{
			value: 'findings',
			label: 'Findings',
			icon: <Iconify icon="heroicons:document-magnifying-glass" />,
			component: InspectionType
		}
	];

	return (
		<Box>
			<InspectionToolbar rolloutDate={rolloutDate} inspection={inspection} reports={items.sections} findings={items.unsatisfactoryItems} cms={inspection?.form_number} />
			<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
				<Tabs
					value={currentTab}
					onChange={(_event, newValue) => setCurrentTab(newValue)}
					sx={{
						width: 1,
						bgcolor: 'background.paper'
					}}
				>
					{TABS.map((tab) => (
						<Tab key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
					))}
				</Tabs>
				{/* <Stack spacing={1} direction="row" alignItems="center">
					{inspectionType === "submitted" && (inspection.status !== 3 || inspection.status !== 2) && (
						<Button variant="contained" component={Link} href={PATH_DASHBOARD.inspection.edit(inspection.inspection_id)}>Edit</Button>
					)}
					{inspectionType === "review" && (inspection.status === 1 || inspection.status === 0) && (
						<Button variant="contained" component={Link} href={PATH_DASHBOARD.inspection.review(inspection.inspection_id)}>Review</Button>
					)}
					{inspectionType === "verify" && inspection.status === 2 && (
						<Button variant="contained" component={Link} href={PATH_DASHBOARD.inspection.verify(inspection.inspection_id)}>Verify</Button>
					)}
				</Stack> */}
			</Stack>
			{TABS.map((tab) => tab.value === currentTab && <Box key={tab.value}> {tab.component} </Box>)}
		</Box >
	)
}

function InspectionDetails ({ inspection, reports, rolloutDate }) {
	return (
		<>
			<Box sx={{ mb: 2 }}>
				<Box sx={{ mb: { xs: 0, md: -1 } }}>
					<Image disabledEffect alt="logo" src="/logo/Fiafi-logo.png" sx={{ maxWidth: 160, margin: { xs: '0px auto 8px auto', md: 0 } }} />
				</Box>
				<Box>
					<Typography variant="h4" textAlign="center">HSE Inspection & Closeout Report</Typography>
				</Box>
			</Box>

			<Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 3, md: 0 }} justifyContent="space-between" sx={{ mb: 5 }}>
				<Stack alignItems="center" flex={1}>
					<Box>
						<Typography variant="body2" fontWeight={700}>CMS Number:</Typography>
					</Box>
					<Box>
						<Typography variant="body1" sx={{ textTransform: 'uppercase' }}>{inspection?.form_number}</Typography>
					</Box>
				</Stack>

				<Stack alignItems="center" flex={1}>
					<Box>
						<Typography variant="body2" fontWeight={700} textAlign="center">Revision:</Typography>
					</Box>
					<Box>
						<Typography variant="body1" >{inspection?.revision_no || 0}</Typography>
					</Box>
				</Stack>

				<Stack alignItems="center" flex={1}>
					<Box>
						<Typography variant="body2" fontWeight={700}>Rollout Date:</Typography>
					</Box>
					<Box>
						<Typography>{fDate(rolloutDate)}</Typography>
					</Box>
				</Stack>
			</Stack>

			<Grid container spacing={2} sx={{ px: 3 }}>
				<Grid item sm={12} md={6}>
					<Stack justifyContent="space-between" height={1}>
						<Stack direction="row">
							<Box width={.5} height={1} display="flex" flexDirection="column" justifyContent="space-between" sx={{ px: 1 }}>
								<Typography sx={{ mb: 1 }}>Contract No.:</Typography>
								<Typography fontWeight={700} borderBottom={1} textTransform="uppercase">{inspection?.contract_no}</Typography>
							</Box>
							<Box width={.5} height={1} display="flex" flexDirection="column" justifyContent="space-between" sx={{ px: 1 }}>
								<Typography sx={{ mb: 1 }}>Location: </Typography>
								<Typography fontWeight={700} borderBottom={1}>{inspection?.location}</Typography>
							</Box>
						</Stack>
						<Box sx={{ px: 1 }}>
							<Typography sx={{ mb: 1 }}>Inspected</Typography>
							<Typography fontWeight={700} borderBottom={1}>{inspection?.inspected_by}</Typography>
						</Box>
						<Box sx={{ px: 1 }}>
							<Typography sx={{ mb: 1 }}>Accompanied</Typography>
							<Typography fontWeight={700} borderBottom={1}>{inspection?.accompanied_by}</Typography>
						</Box>
					</Stack>
				</Grid>
				<Grid item sm={12} md={6}>
					<Stack direction="row" sx={{ mb: 1 }}>
						<Stack direction="row" width={.5} justifyContent="center">
							<Typography sx={{ mr: 1 }}>Date:</Typography>
							<Typography fontWeight={700} borderBottom={1} width="50%" textAlign="center">{inspection?.inspected_date}</Typography>
						</Stack>
						<Stack direction="row" width={.5} justifyContent="center">
							<Typography sx={{ mr: 1 }}>Time</Typography>
							<Typography fontWeight={700} borderBottom={1} width="50%" textAlign="center">{inspection?.inspected_time}</Typography>
						</Stack>
					</Stack>
					<Box border={1}>
						<Box sx={{ backgroundColor: "#d9d9d9", p: 1 }}>
							<Typography fontWeight={700}>Key:</Typography>
						</Box>
						<Stack direction="row" borderTop={1} sx={{ backgroundColor: "#d9e2f3" }}>
							<Box width={1} borderRight={1}>
								<Typography fontWeight={700} textAlign="center" variant="subtitle2">1</Typography>
							</Box>
							<Box width={1} borderRight={1}>
								<Typography fontWeight={700} textAlign="center" variant="subtitle2">2</Typography>
							</Box>
							<Box width={1} borderRight={1}>
								<Typography fontWeight={700} textAlign="center" variant="subtitle2">3</Typography>
							</Box>
							<Box width={1}>
								<Typography fontWeight={700} textAlign="center" variant="subtitle2">4</Typography>
							</Box>
						</Stack>
						<Stack direction="row" borderTop={1} >
							<Box sx={{ backgroundColor: getScoreColor(1) }} width={1} borderRight={1}>
								<Typography fontWeight={700} variant="caption" textAlign="center" sx={{ display: 'flex', color: '#fff', alignItems: 'center', justifyContent: 'center', height: '100%', p: 1 }}>Satisfactory</Typography>
							</Box>
							<Box sx={{ backgroundColor: getScoreColor(2) }} width={1} borderRight={1}>
								<Typography fontWeight={700} variant="caption" textAlign="center" sx={{ display: 'flex', color: '#fff', alignItems: 'center', justifyContent: 'center', height: '100%', p: 1 }}>Below standard, action required within 24hrs</Typography>
							</Box>
							<Box sx={{ backgroundColor: getScoreColor(3) }} width={1} borderRight={1}>
								<Typography fontWeight={700} variant="caption" textAlign="center" sx={{ display: 'flex', color: '#fff', alignItems: 'center', justifyContent: 'center', height: '100%', p: 1 }}>Dangerous, immediate action required</Typography>
							</Box>
							<Box sx={{ backgroundColor: getScoreColor(4) }} width={1}>
								<Typography fontWeight={700} variant="caption" textAlign="center" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', p: 1 }}>Not Applicable</Typography>
							</Box>
						</Stack>
					</Box>
					<Box>
						<Typography variant="caption"><b>NOTE:</b> This checklist is to identify minimum of safety & health condition and should not limit awareness to other safety and health hazards at the jobsite</Typography>
					</Box>
				</Grid>
			</Grid >

			<Grid container spacing={4} sx={{ p: 3 }}>
				<Grid item sm={12} md={6}>
					<Stack borderBottom={1}>
						<Box>
							<HeadingTH>Section A</HeadingTH>
							<TRow>
								<TCell borderRight={1} borderBottom={1}>
									<Typography variant="body2" fontWeight={700}>Ref #</Typography>
								</TCell>
								<Stack borderRight={1}>
									<TCell sx={{ justifyContent: "left" }} borderBottom={1}>
										<Typography variant="body2" fontWeight={700}>Inspected Item</Typography>
									</TCell>
									<TCell borderBottom={1} sx={{ justifyContent: "left" }}>
										<Typography variant="body2" fontWeight={700}>Offices/Welfare Facilities</Typography>
									</TCell>
								</Stack>
								<TCell borderBottom={1} fontWeight={700}><Typography variant="body2" fontWeight={700}>SCORE</Typography></TCell>
							</TRow>
						</Box>
						{reports?.sectionA.map((sec) => {
							return (
								<TRow key={sec.list_id}>
									<TCell borderRight={1} borderBottom={1}>
										<Typography fontWeight={700} variant="subtitle2">{sec.ref_num}</Typography>
									</TCell>
									<TCell borderRight={1} borderBottom={1}>
										<Typography variant="body2" width={1} color="#000">{sec.section_title}</Typography>
									</TCell>
									<TCell borderBottom={1} sx={{ padding: 0, backgroundColor: sec.ref_score ? getScoreColor(sec.ref_score) : "#fff" }}>
										<Typography variant="subtitle2" color={sec.ref_score !== 4 ? "#fff" : "#000"}>{sec.ref_score}</Typography>
									</TCell>
								</TRow>
							)
						})}

						<Box>
							<HeadingTH>Section B</HeadingTH>
							<TRow>
								<TCell borderRight={1} borderBottom={1}>
									<Typography variant="body2" fontWeight={700}>Ref #</Typography>
								</TCell>
								<Stack borderRight={1}>
									<TCell sx={{ justifyContent: "left" }} borderBottom={1}>
										<Typography variant="body2" fontWeight={700}>Inspected Item</Typography>
									</TCell>
									<TCell borderBottom={1} sx={{ justifyContent: "left" }}>
										<Typography variant="body2" fontWeight={700}>Monitoring/Control</Typography>
									</TCell>
								</Stack>
								<TCell borderBottom={1}><Typography variant="body2" fontWeight={700}>SCORE</Typography></TCell>
							</TRow>
						</Box>
						{reports?.sectionB.map((sec) => (
							<TRow key={sec.list_id}>
								<TCell borderRight={1} borderBottom={1}>
									<Typography fontWeight={700} variant="subtitle2">{sec.ref_num}</Typography>
								</TCell>
								<TCell borderRight={1} borderBottom={1}>
									<Typography variant="body2" width={1} color="#000">{sec.section_title}</Typography>
								</TCell>
								<TCell borderBottom={1} sx={{ padding: 0, backgroundColor: sec.ref_score ? getScoreColor(sec.ref_score) : "#fff" }}>
									<Typography variant="subtitle2" color={sec.ref_score !== 4 ? "#fff" : "#000"}>{sec.ref_score}</Typography>
								</TCell>
							</TRow>
						))}

						<Box>
							<HeadingTH>Section C</HeadingTH>
							<TRow>
								<TCell borderRight={1} borderBottom={1}>
									<Typography variant="body2" fontWeight={700}>Ref #</Typography>
								</TCell>
								<Stack borderRight={1}>
									<TCell sx={{ justifyContent: "left" }} borderBottom={1}>
										<Typography variant="body2" fontWeight={700}>Inspected Item</Typography>
									</TCell>
									<TCell borderBottom={1} sx={{ justifyContent: "left" }}>
										<Typography variant="body2" fontWeight={700}>Site Operations</Typography>
									</TCell>
								</Stack>
								<TCell borderBottom={1}><Typography variant="body2" fontWeight={700}>SCORE</Typography></TCell>
							</TRow>
						</Box>
						{reports?.sectionC.map((sec) => (
							<TRow key={sec.list_id}>
								<TCell borderRight={1} borderBottom={1}>
									<Typography fontWeight={700} variant="subtitle2">{sec.ref_num}</Typography>
								</TCell>
								<TCell borderRight={1} borderBottom={1}>
									<Typography variant="body2" width={1} color="#000">{sec.section_title}</Typography>
								</TCell>
								<TCell borderBottom={1} sx={{ padding: 0, backgroundColor: sec.ref_score ? getScoreColor(sec.ref_score) : "#fff" }}>
									<Typography variant="subtitle2" color={sec.ref_score !== 4 ? "#fff" : "#000"}>{sec.ref_score}</Typography>
								</TCell>
							</TRow>
						))}
					</Stack>
				</Grid>
				<Grid item sm={12} md={6}>
					<Stack borderBottom={1} borderTop={1}>
						{reports?.sectionC_B.map((sec) => (
							<TRow key={sec.list_id}>
								<TCell borderRight={1} borderBottom={1}>
									<Typography fontWeight={700} variant="subtitle2">{sec.ref_num}</Typography>
								</TCell>
								<TCell borderRight={1} borderBottom={1}>
									<Typography variant="body2" width={1} color="#000">{sec.section_title}</Typography>
								</TCell>
								<TCell borderBottom={1} sx={{ padding: 0, backgroundColor: sec.ref_score ? getScoreColor(sec.ref_score) : "#fff" }}>
									<Typography variant="subtitle2" color={sec.ref_score !== 4 ? "#fff" : "#000"}>{sec.ref_score}</Typography>
								</TCell>
							</TRow>
						))}

						<Box>
							<HeadingTH>Section D</HeadingTH>
							<TRow>
								<TCell borderRight={1} borderBottom={1}>
									<Typography variant="body2" fontWeight={700}>Ref #</Typography>
								</TCell>
								<Stack borderRight={1}>
									<TCell sx={{ justifyContent: "left" }} borderBottom={1}>
										<Typography variant="body2" fontWeight={700}>Inspected Item</Typography>
									</TCell>
									<TCell borderBottom={1} sx={{ justifyContent: "left" }}>
										<Typography variant="body2" fontWeight={700}>Environmental</Typography>
									</TCell>
								</Stack>
								<TCell borderBottom={1}><Typography variant="body2" fontWeight={700}>SCORE</Typography></TCell>
							</TRow>
						</Box>
						{reports?.sectionD.map((sec) => (
							<TRow key={sec.list_id}>
								<TCell borderRight={1} borderBottom={1}>
									<Typography fontWeight={700} variant="subtitle2">{sec.ref_num}</Typography>
								</TCell>
								<TCell borderRight={1} borderBottom={1}>
									<Typography variant="body2" width={1} color="#000">{sec.section_title}</Typography>
								</TCell>
								<TCell borderBottom={1} sx={{ padding: 0, backgroundColor: sec.ref_score ? getScoreColor(sec.ref_score) : "#fff" }}>
									<Typography variant="subtitle2" color={sec.ref_score !== 4 ? "#fff" : "#000"}>{sec.ref_score}</Typography>
								</TCell>
							</TRow>
						))}



						<Box borderBottom={1}>
							<Box>
								<HeadingTH>Section E</HeadingTH>
								<TRow>
									<TCell borderRight={1} borderBottom={1}>
										<Typography variant="body2" fontWeight={700}>Ref #</Typography>
									</TCell>
									<Stack borderRight={1}>
										<TCell sx={{ justifyContent: "left" }} borderBottom={1}>
											<Typography variant="body2" fontWeight={700}>Inspected Item</Typography>
										</TCell>
										<TCell borderBottom={1} sx={{ justifyContent: "left" }}>
											<Typography variant="body2" fontWeight={700}>Others, please Specify</Typography>
										</TCell>
									</Stack>
									<TCell borderBottom={1}><Typography variant="body2" fontWeight={700}>SCORE</Typography></TCell>
								</TRow>
							</Box>
							{reports?.sectionE.map((sec) => (
								<TRow key={sec.list_id}>
									<TCell borderRight={1} borderBottom={1}>
										<Typography fontWeight={700} variant="subtitle2">{sec.ref_num}</Typography>
									</TCell>
									<TCell borderRight={1} borderBottom={1}>
										{sec.section_title && <Typography variant="body2" width={1} color="#000">{sec.section_title}</Typography>}
									</TCell>
									<TCell borderBottom={1} sx={{ padding: 0, backgroundColor: sec.ref_score ? getScoreColor(sec.ref_score) : "#fff" }}>
										<Typography variant="subtitle2" color={sec.ref_score !== 4 ? "#fff" : "#000"}>{sec.ref_score}</Typography>
									</TCell>
								</TRow>
							))}
						</Box>

						<Box sx={{ mt: 3 }} borderLeft={1} borderRight={1} borderTop={1}>
							<Box display="grid" gridTemplateColumns="1fr 110px 100px" borderBottom={1}>
								<Box sx={{ p: '5px' }} borderRight={1}>
									<Typography variant="body2" width={1} color="#000" fontWeight="700">Average Score (TS ÷ TNIM)</Typography>
								</Box>
								<Box sx={{ p: '5px' }} borderRight={1}>
									<Typography textAlign="center" variant="body2" width={1} fontWeight="700">TS</Typography>
								</Box>
								<Box sx={{ p: '5px' }}>
									<Typography textAlign="center" variant="body2" width={1} fontWeight="700">{inspection.avg_score}</Typography>
								</Box>
							</Box>
							<Box display="grid" gridTemplateColumns="1fr 110px 100px" borderBottom={1}>
								<Box sx={{ p: '5px' }} borderRight={1}>
									<Typography variant="body2" width={1} color="#000">The Average Score Must Range Between</Typography>
								</Box>
								<Box sx={{ p: '5px' }} borderRight={1}>
									<Typography textAlign="center" variant="body2" width={1}>1.00 - 1.25</Typography>
								</Box>
								<Box display="grid" gridTemplateColumns="1fr 32px">
									<Box borderRight={1} sx={{ p: '5px' }}>
										<Typography textAlign="center" variant="body2" width={1}>Passed</Typography>
									</Box>
									<Box display="flex" alignItems="center" justifyContent="center">
										{parseFloat(inspection.avg_score) <= 1.25 && (
											<Iconify icon="material-symbols:check-small" sx={{ color: "success.main" }} />
										)}
									</Box>
								</Box>
							</Box>
							<Box display="grid" gridTemplateColumns="1fr 110px 100px">
								<Box sx={{ p: '5px' }} borderRight={1}></Box>
								<Box sx={{ p: '5px' }} borderRight={1}>
									<Typography textAlign="center" variant="body2" width={1}>{">1.25"}</Typography>
								</Box>
								<Box display="grid" gridTemplateColumns="1fr 32px">
									<Box borderRight={1} sx={{ p: '5px' }}>
										<Typography textAlign="center" variant="body2" width={1}>Failed</Typography>
									</Box>
									<Box display="flex" alignItems="center" justifyContent="center">
										{parseFloat(inspection.avg_score) > 1.25 && (
											<Iconify icon="material-symbols:check-small" sx={{ color: "error.main" }} />
										)}
									</Box>
								</Box>
							</Box>
						</Box>

					</Stack>
					<Stack sx={{ mt: 3 }} spacing={1}>
						<Typography variant="body1" fontWeight={700} color="error">Legend: Total Score (TS), Total Number of Items Marked</Typography>
					</Stack>
				</Grid>
			</Grid>
		</>
	)
}

export default InspectionDetailPage