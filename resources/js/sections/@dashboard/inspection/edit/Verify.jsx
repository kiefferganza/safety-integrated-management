import { Fragment, useMemo, useRef, useState } from 'react';
import { Box, Card, Grid, Stack, TextField, Tooltip, Typography } from '@mui/material';
import Image from '@/Components/image';
import { format } from 'date-fns';
// form
import { Controller, useForm, useFormContext } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import FormProvider from '@/Components/hook-form/FormProvider';
import { LoadingButton } from '@mui/lab';
import { Inertia } from '@inertiajs/inertia';
import Iconify from '@/Components/iconify';
import { RHFSelect } from '@/Components/hook-form';
import { useSwal } from '@/hooks/useSwal';

const Verify = ({ inspection }) => {
	const { load, stop, warning } = useSwal();
	const [loading, setLoading] = useState(false);
	const defaultValues = useMemo(() => ({
		reports: inspection?.report_list.map(sec => ({
			photo_after: sec?.photo_after ? `/storage/media/inspection/${sec.photo_after}` : "/storage/media/inspection/blank.png",
			action_taken: sec?.action_taken || "",
			list_id: sec?.list_id,
			photo_before: sec?.photo_before ? `/storage/media/inspection/${sec.photo_before}` : "/storage/media/inspection/blank.png",
			findings: sec?.findings || "",
			ref_num: sec?.ref_num,
			item_status: sec?.item_status ? sec?.item_status + "" : ""
		}))
	}), [inspection]);

	// const reportResolver = Yup.

	const methods = useForm({
		defaultValues,
	});

	const { watch, handleSubmit, formState: { isDirty } } = methods;
	const reports = watch("reports");


	const handleSave = (data) => {

		Inertia.post(`/dashboard/inspection/${inspection.inspection_id}/verify`, { ...data, fails: true }, {
			preserveScroll: true,
			onStart () {
				load("Please wait");
				setLoading(true);
			},
			onFinish () {
				stop();
				setLoading(false);
			}
		});
	}

	const handleCloseout = async () => {
		const newData = reports.map(rep => ({
			list_id: rep.list_id,
			item_status: 1
		}));

		const result = await warning("Are you sure you want to close this report?", "Press cancel to undo this action.", "Yes");
		if (result.isConfirmed) {
			Inertia.post(`/dashboard/inspection/${inspection.inspection_id}/verify`, { reports: newData }, {
				preserveScroll: true,
				onStart () {
					load("Please wait");
					setLoading(true);
				},
				onFinish () {
					stop();
					setLoading(false);
				}
			});
		}

	}


	const getItemStatus = (status) => {
		switch (status) {
			case 1:
			case "1":
				return {
					text: "Approved",
					start: "A",
					icon: "material-symbols:check-small-rounded",
					statusClass: "success"
				}
			case 2:
			case "2":
				return {
					text: "Failed",
					start: "F",
					icon: "ci:close-small",
					statusClass: "error"
				}
			default:
				return {
					text: "Pending",
					start: "P",
					icon: "mdi:clock-time-three-outline",
					statusClass: "info"
				}
		}
	}

	return (
		<FormProvider methods={methods}>
			<Card sx={{ p: 5 }}>
				<Box sx={{ mb: 2, px: 3 }}>
					<Box sx={{ mb: { xs: 0, md: -1 } }}>
						<Image disabledEffect alt="logo" src="/logo/Fiafi-logo.png" sx={{ maxWidth: 160, margin: { xs: '0px auto 8px auto', md: 0 } }} />
					</Box>
					<Box sx={{ mb: 3 }}>
						<Typography variant="h5" textAlign="center">Details of Unsatisfactory Items</Typography>
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
								<Typography></Typography>
							</Box>
						</Stack>
					</Stack>
					<Grid container>
						<Grid item sm={12} md={6}>
							<Box display="flex" alignItems="center" justifyContent="center">
								<Typography borderBottom={1} display="inline-block" fontWeight={700}>Nature of Defect, Risk, Hazard</Typography>
							</Box>
						</Grid>
						<Grid item sm={12} md={6}>
							<Box display="flex" alignItems="center" justifyContent="center">
								<Typography borderBottom={1} display="inline-block" fontWeight={700}>Actioned</Typography>
							</Box>
						</Grid>
					</Grid>
				</Box>

				<Grid container spacing={5}>
					{reports?.map((sec, index) => {
						const itemStatus = getItemStatus(reports[index].item_status);
						return (
							<Fragment key={sec.list_id}>
								<Grid item sm={12} md={6} height={1}>
									<Stack direction="row" gap={5} width={1}>
										<Stack flex={.4}>
											<Typography variant="body1">Ref #</Typography>
											<Typography sx={{ pl: 1 }} borderBottom={1} variant="body1" fontWeight={700}>{sec.ref_num}</Typography>
										</Stack>
										<Stack flex={1}>
											<Typography variant="body1">Location</Typography>
											<Typography sx={{ pl: 1 }} borderBottom={1} variant="body1" fontWeight={700}>{inspection?.location || "N/A"}</Typography>
										</Stack>
									</Stack>
									<Stack height={1} width={1} sx={{ mt: 2 }} border={1}>
										<Box borderBottom={1} borderColor="#000" sx={{ p: "5px", bgcolor: "#d9d9d9", color: "#c00000" }}>
											<Typography sx={{ pl: 1 }} fontWeight={700}>Photo (Before)</Typography>
										</Box>
										<Box height="340px" borderBottom={1} display="flex">
											<Image sx={{ width: "100%", "&>span>img": { objectFit: "fill" } }} src={sec?.photo_before} />
										</Box>
										<Box height={1} sx={{ px: 1, pt: 1, minHeight: '140px' }}>
											<Stack justifyContent="space-between" direction="row" sx={{ color: "#c00000", mb: 2 }}>
												<Box width={1}>
													<Typography fontWeight={700}>Findings:</Typography>
												</Box>
												<Box width={1}>
													<Typography fontWeight={700}>Date Submitted: <span style={{ textDecoration: 'underline', paddingLeft: '4px' }} >{format(new Date(inspection?.date_issued), "dd-MMM-yyyy")}</span></Typography>
												</Box>
											</Stack>
											{sec?.findings && (
												<Typography>{sec.findings}</Typography>
											)}
										</Box>
									</Stack>
								</Grid>
								<Grid item sm={12} md={6} height={1}>
									<Stack flex={1}>
										<Typography variant="body1">Company</Typography>
										<Typography sx={{ pl: 1 }} borderBottom={1} variant="body1" fontWeight={700}>FIAFI Group</Typography>
									</Stack>
									<Stack height={1} width={1} sx={{ mt: 2 }} border={1}>
										<Box borderBottom={1} borderColor="#000" sx={{ p: "5px", bgcolor: "#d9d9d9", color: "#385623" }}>
											<Typography sx={{ pl: 1 }} fontWeight={700}>Photo (After)</Typography>
										</Box>
										<Box height="340px" borderBottom={1} display="flex">
											<Image sx={{ width: "100%", "&>span>img": { objectFit: "fill" } }} src={sec?.photo_after} />
										</Box>
										<Box height={1} sx={{ px: 1, pt: 1, minHeight: '140px' }}>
											<Stack justifyContent="space-between" direction="row">
												<Box width={1}>
													<Typography fontWeight={700} sx={{ color: "#385623", mb: 2 }}>Action Taken:</Typography>
												</Box>
												<Box position="relative" sx={{ cursor: "pointer" }}>
													<Tooltip title={itemStatus.text}>
														<Box display="flex" alignItems="center" sx={{ color: itemStatus.statusClass + ".main" }}>
															<Iconify icon={itemStatus.icon} sx={{ mr: "2px" }} />
															<Typography fontWeight="600" variant="caption">{itemStatus.start}</Typography>
														</Box>
													</Tooltip>
													<RHFSelect name={`reports.${index}.item_status`} sx={{ position: "absolute", top: 0, "opacity": 0, "& select": { p: 0 } }}>
														<option value=""></option>
														<option value="1">&#10003;</option>
														<option value="2">&#10005;</option>
													</RHFSelect>
												</Box>
											</Stack>
											{sec?.action_taken && (
												<Typography>{sec.action_taken}</Typography>
											)}
										</Box>
									</Stack>
								</Grid>
							</Fragment>
						)
					})
					}
				</Grid >
			</Card >
			<Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
				<LoadingButton
					size="large"
					variant="contained"
					loading={loading}
					onClick={handleSubmit(handleSave)}
					disabled={!isDirty}
				>
					Save
				</LoadingButton>
				<LoadingButton
					size="large"
					variant="contained"
					loading={loading}
					onClick={handleCloseout}
				>
					Closeout
				</LoadingButton>
			</Stack>
		</FormProvider >
	)
}

export default Verify