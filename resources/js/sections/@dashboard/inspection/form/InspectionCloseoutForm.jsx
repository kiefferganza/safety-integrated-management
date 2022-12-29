import { Box, Grid, Stack, Typography } from "@mui/material";
import { HeadingTH, ScoreSelect, TCell, TRow } from "./styledInspectionForm";
import { format } from "date-fns";
import { useFieldArray, useFormContext, Controller } from "react-hook-form";
import { getScoreColor } from "@/utils/inspection";
import Image from "@/Components/image";

const sectionE_arr = [
	"Oil spillage",
	"Traffic control",
	"Parking",
	"Site control",
	"Health hazard",
	"Utilities",
	"Waste collection/disposal",
	"Smoking",
	"Environmental issue",
	"Stability of structure/materials",
	"Communication",
	"Exclusion zone",
	"Impalement",
	"Flying objects/debris",
	"Grinding/cutting discs",
	"Lonely working",
	"Gas monitoring",
	"Spillage (bio-hazard)",
	"Voids un-protected",
	"Emergency procedure",
	"Task Lighting",
	"Handtools",
	"Supervision",
	"Working on live traffic",
	"Utilities",
	"Trip slip fall",
	"Rotating Parts"
]

const InspectionCloseoutForm = ({ setCompleted }) => {
	const { watch, control, setValue } = useFormContext();
	const { fields: sectionAFields } = useFieldArray({
		control,
		name: 'sectionA',
	});
	const { fields: sectionBFields } = useFieldArray({
		control,
		name: 'sectionB',
	});
	const { fields: sectionCFields } = useFieldArray({
		control,
		name: 'sectionC',
	});
	const { fields: sectionC_BFields } = useFieldArray({
		control,
		name: 'sectionC_B',
	});
	const { fields: sectionDFields } = useFieldArray({
		control,
		name: 'sectionD',
	});
	const { fields: sectionEFields } = useFieldArray({
		control,
		name: 'sectionE',
	});

	const values = watch();

	const handleChangeSecETitle = (e, name) => {
		setValue(name, e.target.value);
	}

	return (
		<Box>
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
						<Typography variant="body1" sx={{ textTransform: 'uppercase' }}>{values?.form_number}</Typography>
					</Box>
				</Stack>

				<Stack alignItems="center" flex={1}>
					<Box>
						<Typography variant="body2" fontWeight={700} textAlign="center">Revision:</Typography>
					</Box>
					<Box>
						<Typography variant="body1" >{values?.revision_no || 0}</Typography>
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

			<Grid container spacing={2} sx={{ px: 3 }}>
				<Grid item sm={12} md={6}>
					<Stack justifyContent="space-between" height={1}>
						<Stack direction="row">
							<Box width={.5} height={1} display="flex" flexDirection="column" justifyContent="space-between" sx={{ px: 1 }}>
								<Typography sx={{ mb: 1 }}>Contract No.:</Typography>
								<Typography fontWeight={700} borderBottom={1} textTransform="uppercase">{values?.contract_no}</Typography>
							</Box>
							<Box width={.5} height={1} display="flex" flexDirection="column" justifyContent="space-between" sx={{ px: 1 }}>
								<Typography sx={{ mb: 1 }}>Location: </Typography>
								<Typography fontWeight={700} borderBottom={1}>{values?.location}</Typography>
							</Box>
						</Stack>
						<Box sx={{ px: 1 }}>
							<Typography sx={{ mb: 1 }}>Inspected</Typography>
							<Typography fontWeight={700} borderBottom={1}>{values?.inspected_by}</Typography>
						</Box>
						<Box sx={{ px: 1 }}>
							<Typography sx={{ mb: 1 }}>Accompanied</Typography>
							<Typography fontWeight={700} borderBottom={1}>{values?.accompanied_by}</Typography>
						</Box>
					</Stack>
				</Grid>
				<Grid item sm={12} md={6}>
					<Stack direction="row" sx={{ mb: 1 }}>
						<Stack direction="row" width={.5} justifyContent="center">
							<Typography sx={{ mr: 1 }}>Date:</Typography>
							<Typography fontWeight={700} borderBottom={1} width="50%" textAlign="center">{format(new Date(), 'dd-MMM-yyyy')}</Typography>
						</Stack>
						<Stack direction="row" width={.5} justifyContent="center">
							<Typography sx={{ mr: 1 }}>Time</Typography>
							<Typography fontWeight={700} borderBottom={1} width="50%" textAlign="center">{values?.inspected_time}</Typography>
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
						{sectionAFields.map((sec, index) => {
							return (
								<TRow key={sec.refNumber}>
									<TCell borderRight={1} borderBottom={1}>
										<Typography fontWeight={700} variant="subtitle2">{sec.refNumber}</Typography>
									</TCell>
									<TCell borderRight={1} borderBottom={1}>
										<Typography variant="body2" width={1} color="#000">{sec.title}</Typography>
									</TCell>
									<TCell borderBottom={1} sx={{ padding: 0, backgroundColor: values["sectionA"][index]?.score ? getScoreColor(values["sectionA"][index]?.score) : "#fff" }}>
										<SSelect setCompleted={setCompleted} name={`sectionA[${index}].score`} />
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
						{sectionBFields.map((sec, index) => (
							<TRow key={sec.refNumber}>
								<TCell borderRight={1} borderBottom={1}>
									<Typography fontWeight={700} variant="subtitle2">{sec.refNumber}</Typography>
								</TCell>
								<TCell borderRight={1} borderBottom={1}>
									<Typography variant="body2" width={1} color="#000">{sec.title}</Typography>
								</TCell>
								<TCell borderBottom={1} sx={{ padding: 0, backgroundColor: values["sectionB"][index]?.score ? getScoreColor(values["sectionB"][index]?.score) : "#fff" }}>
									<SSelect setCompleted={setCompleted} name={`sectionB[${index}].score`} />
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
						{sectionCFields.map((sec, index) => (
							<TRow key={sec.refNumber}>
								<TCell borderRight={1} borderBottom={1}>
									<Typography fontWeight={700} variant="subtitle2">{sec.refNumber}</Typography>
								</TCell>
								<TCell borderRight={1} borderBottom={1}>
									<Typography variant="body2" width={1} color="#000">{sec.title}</Typography>
								</TCell>
								<TCell borderBottom={1} sx={{ padding: 0, backgroundColor: values["sectionC"][index]?.score ? getScoreColor(values["sectionC"][index]?.score) : "#fff" }}>
									<SSelect setCompleted={setCompleted} name={`sectionC[${index}].score`} />
								</TCell>
							</TRow>
						))}
					</Stack>
				</Grid>
				<Grid item sm={12} md={6}>
					<Stack borderBottom={1} borderTop={1}>
						{sectionC_BFields.map((sec, index) => (
							<TRow key={sec.refNumber}>
								<TCell borderRight={1} borderBottom={1}>
									<Typography fontWeight={700} variant="subtitle2">{sec.refNumber}</Typography>
								</TCell>
								<TCell borderRight={1} borderBottom={1}>
									<Typography variant="body2" width={1} color="#000">{sec.title}</Typography>
								</TCell>
								<TCell borderBottom={1} sx={{ padding: 0, backgroundColor: values["sectionC_B"][index]?.score ? getScoreColor(values["sectionC_B"][index]?.score) : "#fff" }}>
									<SSelect setCompleted={setCompleted} name={`sectionC_B[${index}].score`} />
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
						{sectionDFields.map((sec, index) => (
							<TRow key={sec.refNumber}>
								<TCell borderRight={1} borderBottom={1}>
									<Typography fontWeight={700} variant="subtitle2">{sec.refNumber}</Typography>
								</TCell>
								<TCell borderRight={1} borderBottom={1}>
									<Typography variant="body2" width={1} color="#000">{sec.title}</Typography>
								</TCell>
								<TCell borderBottom={1} sx={{ padding: 0, backgroundColor: values["sectionD"][index]?.score ? getScoreColor(values["sectionD"][index]?.score) : "#fff" }}>
									<SSelect setCompleted={setCompleted} name={`sectionD[${index}].score`} />
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
							{sectionEFields.map((item, index) => (
								<TRow key={item.refNumber}>
									<TCell borderRight={1} borderBottom={1}>
										<Typography fontWeight={700} variant="subtitle2">{item.refNumber}</Typography>
									</TCell>
									<TCell borderRight={1} borderBottom={1} sx={{ py: 0 }}>
										<select value={values["sectionE"][index]?.title} onChange={(e) => handleChangeSecETitle(e, `sectionE.${index}.title`)} style={{ width: '100%', height: '100%', outline: 0, border: 0 }}>
											<option></option>
											{sectionE_arr.map((sec, index) => (
												<option key={index}>{sec}</option>
											))}
										</select>
									</TCell>
									<TCell borderBottom={1} sx={{ padding: 0, backgroundColor: values["sectionE"][index]?.score ? getScoreColor(values["sectionE"][index]?.score) : "#fff" }}>
										<SSelect setCompleted={setCompleted} name={`sectionE[${index}].score`} disabled={!values["sectionE"][index]?.title} />
									</TCell>
								</TRow>
							))}
						</Box>

						<Box sx={{ mt: 3 }} borderLeft={1} borderRight={1} borderTop={1}>
							<Box display="grid" gridTemplateColumns="1fr 130px 90px" borderBottom={1}>
								<Box sx={{ p: '5px' }} borderRight={1}>
									<Typography variant="body2" width={1} color="#000">Average Score (TS ÷ TNIM)</Typography>
								</Box>
								<Box sx={{ p: '5px' }} borderRight={1}>
									<Typography textAlign="center" variant="body2" width={1}>TS</Typography>
								</Box>
								<Box sx={{ p: '5px' }}>
									<Typography textAlign="center" variant="body2" width={1}>{values.avg_score}</Typography>
								</Box>
							</Box>
							<Box display="grid" gridTemplateColumns="1fr 130px 90px" borderBottom={1}>
								<Box sx={{ p: '5px' }} borderRight={1}>
									<Typography variant="body2" width={1} color="#000">The Average Score Must Range Between</Typography>
								</Box>
								<Box sx={{ p: '5px' }} borderRight={1}>
									<Typography textAlign="center" variant="body2" width={1}>1.00 - 1.25</Typography>
								</Box>
								<Box sx={{ p: '5px' }}>
									<Typography textAlign="center" variant="body2" width={1}>Passed</Typography>
								</Box>
							</Box>
							<Box display="grid" gridTemplateColumns="1fr 130px 90px">
								<Box sx={{ p: '5px' }} borderRight={1}></Box>
								<Box sx={{ p: '5px' }} borderRight={1}>
									<Typography textAlign="center" variant="body2" width={1}>{">1.25"}</Typography>
								</Box>
								<Box sx={{ p: '5px' }}>
									<Typography textAlign="center" variant="body2" width={1}>Failed</Typography>
								</Box>
							</Box>
						</Box>

					</Stack>
					<Stack sx={{ mt: 3 }} spacing={1}>
						<Typography variant="body1" fontWeight={700} color="error">Legend: Total Score (TS), Total Number of Items Marked</Typography>
					</Stack>
				</Grid>
			</Grid>
		</Box >
	)
}


function SSelect ({ name, setCompleted, ...other }) {
	const { control, setValue, watch, clearErrors } = useFormContext();
	const { sectionA, sectionB, sectionC, sectionC_B, sectionD, sectionE } = watch();

	const handleChange = (e, onChange) => {
		clearErrors(e.target.name.split("[")[0]);
		onChange(e);
		const sectionEScored = sectionE.filter(secE => secE.score !== "");
		const sections = [...sectionA, ...sectionB, ...sectionC, ...sectionC_B, ...sectionD, ...sectionEScored];
		const sectionScores = sections.filter(sec => (parseInt(sec.score) && parseInt(sec.score) !== 4));
		const scores = sectionScores.reduce((acc, curr) => {
			if (curr.score !== "") {
				acc += parseInt(curr.score);
				return acc
			}
			return acc;
		}, 0);
		const isAllPassed = sections.every(sec => sec.score === "1");
		if (isAllPassed) {
			setCompleted(curr => ({
				...curr,
				2: true
			}));
			setValue("status", 2);
		} else {
			setCompleted(curr => ({
				...curr,
				2: false
			}));
			setValue("status", 1);
		}
		const avg = scores / sectionScores.length;
		setValue("avg_score", avg.toFixed(2));
	}

	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState: { error } }) => (
				<ScoreSelect {...field} onChange={(e) => handleChange(e, field.onChange)} sx={{ color: field.value !== "4" ? "#fff" : "#000", backgroundColor: !!error ? "#ab003c" : "inherit" }} {...other}>
					<option value="" style={{ backgroundColor: "#fff", color: "#000" }}></option>
					<option value="1" style={{ backgroundColor: "#fff", color: "#000" }}>1</option>
					<option value="2" style={{ backgroundColor: "#fff", color: "#000" }}>2</option>
					<option value="3" style={{ backgroundColor: "#fff", color: "#000" }}>3</option>
					<option value="4" style={{ backgroundColor: "#fff", color: "#000" }}>4</option>
				</ScoreSelect>
			)}
		/>
	)
}

export default InspectionCloseoutForm