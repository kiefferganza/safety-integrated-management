import { Box, Card, Divider, Grid, Stack, Typography } from "@mui/material";
import Scrollbar from '@/Components/scrollbar';
import Label from "@/Components/label";
import { HeadingTH, ScoreSelect, TCell, TRow } from "./styledInspectionForm";
import { format } from "date-fns";
import { useFormContext } from "react-hook-form";
import { getScoreColor } from "@/utils/inspection";

const tips = [
	{
		id: 1,
		type: "success",
		message: "Satisfactory"
	},
	{
		id: 2,
		type: "warning",
		message: "Below standard, action required within 24hrs"
	},
	{
		id: 3,
		type: "error",
		message: "Dangerous, immediate action required"
	},
	{
		id: 4,
		type: "default",
		message: "Not Applicable"
	},
];

const sectionA = [
	{
		refNumber: 1,
		title: "Welfare facilities, drinking water, toilets, washing",
	},
	{
		refNumber: 2,
		title: "Office Cleanliness",
	},
	{
		refNumber: 3,
		title: "Fire Prevention (including electrical testing of installation Extinguishers.",
	},
	{
		refNumber: 4,
		title: "START Cards completed for all task taking place?",
	},
	{
		refNumber: 5,
		title: "Records of all toolbox talk (Document and signature pages attached)",
	},
	{
		refNumber: 6,
		title: "First Aid Cover and Kit Present"
	},
];

const sectionB = [
	{
		refNumber: 7,
		title: "Method statement & TAB in place/Briefings (STARRT)",
	},
	{
		refNumber: 8,
		title: "MSDS/COSHH Assessment",
	},
	{
		refNumber: 9,
		title: "Permits inc. to enter, shut down, at height etc.",
	},
	{
		refNumber: 10,
		title: "Weekly Inspection Registers, Plant, scaffold, nets etc.",
	},
	{
		refNumber: 11,
		title: "Toolbox Talks",
	},
	{
		refNumber: 12,
		title: "Induction & Training",
	},
	{
		refNumber: 13,
		title: "Plant Certification"
	},
];

const sectionC = [
	{
		refNumber: 14,
		title: "Traffic Management",
	},
	{
		refNumber: 15,
		title: "Flammable Liquids, LPG/Cylinder storage and use",
	},
	{
		refNumber: 16,
		title: "Working at Height & Edge Protection",
	},
	{
		refNumber: 17,
		title: "Site Access & Egress, Public Safety, lighting",
	},
	{
		refNumber: 18,
		title: "Cranes & Lifting Equipment/Tackle",
	},
	{
		refNumber: 19,
		title: "Mobile Plant/ Equipment's",
	},
	{
		refNumber: 20,
		title: "Hot Works & Fire Precautions",
	},
	{
		refNumber: 21,
		title: "Tidiness/Housekeeping &Storage of Materials",
	},
];

const sectionC_B = [
	{
		refNumber: 22,
		title: "Manual Handling",
	},
	{
		refNumber: 23,
		title: "Excavation (inc. barriers, access into, shoring etc.)",
	},
	{
		refNumber: 24,
		title: "Scaffolding, Mobile Towers, Ladders & Stepladders",
	},
	{
		refNumber: 25,
		title: "Underground & Overhead Services",
	},
	{
		refNumber: 26,
		title: "Power Tools/ PAT Testing",
	},
	{
		refNumber: 27,
		title: "Temporary Electrical Supplies/Leads",
	},
	{
		refNumber: 28,
		title: "Personal Protective Equipment",
	},
	{
		refNumber: 29,
		title: "Confined Spaces",
	},
	{
		refNumber: 30,
		title: "Noise",
	},
	{
		refNumber: 31,
		title: "Security",
	}
];

const sectionD = [
	{
		refNumber: 32,
		title: "Fuels and oils in correct containers, with secondary containment and release controls",
	},
	{
		refNumber: 33,
		title: "Drip Trays for static plant",
	},
	{
		refNumber: 34,
		title: "Dust control"
	},
];

const sectionE = [
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

const InspectionCloseoutForm = () => {
	const { setValue, watch, formState: { errors } } = useFormContext();
	const values = watch();

	return (
		<Box>
			<Scrollbar>
				<Stack
					direction="row"
					divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
					justifyContent="space-evenly"
				>
					{tips.map(tip => (
						<Box key={tip.id} sx={{ p: 3 }}>
							<Typography textAlign="center" variant="button" display="block">{tip.id}</Typography>
							<Label
								varian="filled"
								color={tip.type}
							>
								{tip.message}
							</Label>
						</Box>
					))}
				</Stack>
			</Scrollbar>
			<Grid container spacing={4} sx={{ p: 3 }}>
				<Grid item sm={12} md={6}>
					<Stack borderBottom={1}>
						<Box>
							<HeadingTH>Section A</HeadingTH>
							<TRow>
								<TCell borderRight={1} borderBottom={1}>
									<Typography variant="body1">REF #</Typography>
								</TCell>
								<Stack borderRight={1}>
									<TCell borderBottom={1}>
										<Typography variant="body2">Inspected Item</Typography>
									</TCell>
									<TCell borderBottom={1}>
										<Typography variant="body2">Offices/Welfare Facilities</Typography>
									</TCell>
								</Stack>
								<TCell borderBottom={1}>SCORE</TCell>
							</TRow>
						</Box>
						{sectionA.map(sec => (
							<TRow key={sec.refNumber}>
								<TCell borderRight={1} borderBottom={1}>
									<Typography fontWeight={600} variant="body1">{sec.refNumber}</Typography>
								</TCell>
								<TCell borderRight={1} borderBottom={1}>
									<Typography variant="body2" width={1}>{sec.title}</Typography>
								</TCell>
								<TCell borderBottom={1} sx={{ padding: 0, backgroundColor: values[sec.refNumber] ? getScoreColor(values[sec.refNumber]) : "#fff" }}>
									<SSelect name={sec.refNumber + ""} />
								</TCell>
							</TRow>
						))}

						<Box>
							<HeadingTH>Section B</HeadingTH>
							<TRow>
								<TCell borderRight={1} borderBottom={1}>
									<Typography variant="body1">REF #</Typography>
								</TCell>
								<Stack borderRight={1}>
									<TCell borderBottom={1}>
										<Typography variant="body2">Inspected Item</Typography>
									</TCell>
									<TCell borderBottom={1}>
										<Typography variant="body2">Monitoring/Control</Typography>
									</TCell>
								</Stack>
								<TCell borderBottom={1}>SCORE</TCell>
							</TRow>
						</Box>
						{sectionB.map(sec => (
							<TRow key={sec.refNumber}>
								<TCell borderRight={1} borderBottom={1}>
									<Typography fontWeight={600} variant="body1">{sec.refNumber}</Typography>
								</TCell>
								<TCell borderRight={1} borderBottom={1}>
									<Typography variant="body2" width={1}>{sec.title}</Typography>
								</TCell>
								<TCell borderBottom={1} sx={{ padding: 0, backgroundColor: values[sec.refNumber] ? getScoreColor(values[sec.refNumber]) : "#fff" }}>
									<SSelect name={sec.refNumber + ""} />
								</TCell>
							</TRow>
						))}

						<Box>
							<HeadingTH>Section C</HeadingTH>
							<TRow>
								<TCell borderRight={1} borderBottom={1}>
									<Typography variant="body1">REF #</Typography>
								</TCell>
								<Stack borderRight={1}>
									<TCell borderBottom={1}>
										<Typography variant="body2">Inspected Item</Typography>
									</TCell>
									<TCell borderBottom={1}>
										<Typography variant="body2">Site Operations</Typography>
									</TCell>
								</Stack>
								<TCell borderBottom={1}>SCORE</TCell>
							</TRow>
						</Box>
						{sectionC.map(sec => (
							<TRow key={sec.refNumber}>
								<TCell borderRight={1} borderBottom={1}>
									<Typography fontWeight={600} variant="body1">{sec.refNumber}</Typography>
								</TCell>
								<TCell borderRight={1} borderBottom={1}>
									<Typography variant="body2" width={1}>{sec.title}</Typography>
								</TCell>
								<TCell borderBottom={1} sx={{ padding: 0, backgroundColor: values[sec.refNumber] ? getScoreColor(values[sec.refNumber]) : "#fff" }}>
									<SSelect name={sec.refNumber + ""} />
								</TCell>
							</TRow>
						))}
					</Stack>
				</Grid>
				<Grid item sm={12} md={6}>
					<Stack borderBottom={1} borderTop={1}>
						{sectionC_B.map(sec => (
							<TRow key={sec.refNumber}>
								<TCell borderRight={1} borderBottom={1}>
									<Typography fontWeight={600} variant="body1">{sec.refNumber}</Typography>
								</TCell>
								<TCell borderRight={1} borderBottom={1}>
									<Typography variant="body2" width={1}>{sec.title}</Typography>
								</TCell>
								<TCell borderBottom={1} sx={{ padding: 0, backgroundColor: values[sec.refNumber] ? getScoreColor(values[sec.refNumber]) : "#fff" }}>
									<SSelect name={sec.refNumber + ""} />
								</TCell>
							</TRow>
						))}

						<Box>
							<HeadingTH>Section D</HeadingTH>
							<TRow>
								<TCell borderRight={1} borderBottom={1}>
									<Typography variant="body1">REF #</Typography>
								</TCell>
								<Stack borderRight={1}>
									<TCell borderBottom={1}>
										<Typography variant="body2">Inspected Item</Typography>
									</TCell>
									<TCell borderBottom={1}>
										<Typography variant="body2">Environmental</Typography>
									</TCell>
								</Stack>
								<TCell borderBottom={1}>SCORE</TCell>
							</TRow>
						</Box>
						{sectionD.map(sec => (
							<TRow key={sec.refNumber}>
								<TCell borderRight={1} borderBottom={1}>
									<Typography fontWeight={600} variant="body1">{sec.refNumber}</Typography>
								</TCell>
								<TCell borderRight={1} borderBottom={1}>
									<Typography variant="body2" width={1}>{sec.title}</Typography>
								</TCell>
								<TCell borderBottom={1} sx={{ padding: 0, backgroundColor: values[sec.refNumber] ? getScoreColor(values[sec.refNumber]) : "#fff" }}>
									<SSelect name={sec.refNumber + ""} />
								</TCell>
							</TRow>
						))}



						<Box>
							<HeadingTH>Section E</HeadingTH>
							<TRow>
								<TCell borderRight={1} borderBottom={1}>
									<Typography variant="body1">REF #</Typography>
								</TCell>
								<Stack borderRight={1}>
									<TCell borderBottom={1}>
										<Typography variant="body2">Inspected Item</Typography>
									</TCell>
									<TCell borderBottom={1}>
										<Typography variant="body2">Others, please Specify</Typography>
									</TCell>
								</Stack>
								<TCell borderBottom={1}>SCORE</TCell>
							</TRow>
						</Box>
						<TRow>
							<TCell borderRight={1} borderBottom={1}>
								<Typography fontWeight={600} variant="body1">35</Typography>
							</TCell>
							<TCell borderRight={1} borderBottom={1}>
								<Typography variant="body2" width={1}></Typography>
							</TCell>
							<TCell borderBottom={1}></TCell>
						</TRow>
						<TRow>
							<TCell borderRight={1} borderBottom={1}>
								<Typography fontWeight={600} variant="body1">36</Typography>
							</TCell>
							<TCell borderRight={1} borderBottom={1}>
								<Typography variant="body2" width={1}></Typography>
							</TCell>
							<TCell borderBottom={1}></TCell>
						</TRow>
						<TRow>
							<TCell borderRight={1} borderBottom={1}>
								<Typography fontWeight={600} variant="body1">37</Typography>
							</TCell>
							<TCell borderRight={1} borderBottom={1}>
								<Typography variant="body2" width={1}></Typography>
							</TCell>
							<TCell borderBottom={1}></TCell>
						</TRow>
						<TRow>
							<TCell borderRight={1} borderBottom={1}>
								<Typography fontWeight={600} variant="body1">38</Typography>
							</TCell>
							<TCell borderRight={1} borderBottom={1}>
								<Typography variant="body2" width={1}></Typography>
							</TCell>
							<TCell borderBottom={1}></TCell>
						</TRow>
						<TRow>
							<TCell borderRight={1} borderBottom={1}>
								<Typography fontWeight={600} variant="body1">39</Typography>
							</TCell>
							<TCell borderRight={1} borderBottom={1}>
								<Typography variant="body2" width={1}></Typography>
							</TCell>
							<TCell borderBottom={1}></TCell>
						</TRow>
						<TRow borderBottom={1}>
							<TCell borderRight={1} borderBottom={1}>
								<Typography fontWeight={600} variant="body1">40</Typography>
							</TCell>
							<TCell borderRight={1} borderBottom={1}>
								<Typography variant="body2" width={1}></Typography>
							</TCell>
							<TCell borderBottom={1}></TCell>
						</TRow>

						<Box sx={{ mt: 3 }} borderLeft={1} borderRight={1} borderTop={1}>
							<Box display="grid" gridTemplateColumns="1fr 130px 90px" borderBottom={1}>
								<Box sx={{ p: '5px' }} borderRight={1}>
									<Typography variant="body2" width={1}>Average Score (TS ÷ TNIM)</Typography>
								</Box>
								<Box sx={{ p: '5px' }} borderRight={1}>
									<Typography textAlign="center" variant="body2" width={1}>TS</Typography>
								</Box>
								<Box sx={{ p: '5px' }}>
									<Typography textAlign="center" variant="body2" width={1}>1.06</Typography>
								</Box>
							</Box>
							<Box display="grid" gridTemplateColumns="1fr 130px 90px" borderBottom={1}>
								<Box sx={{ p: '5px' }} borderRight={1}>
									<Typography variant="body2" width={1}>The Average Score Must Range Between</Typography>
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
					<Stack sx={{ mt: 1 }} spacing={1}>
						<Typography variant="body1" fontWeight={600} color="error">Legend: Total Score (TS), Total Number of Items Marked</Typography>
						<Stack direction="row" spacing={1}>
							<Typography variant="body2" fontWeight={600}>
								Issued for Use:
							</Typography>
							<Typography variant="body2">
								{format(new Date(), "MMMM dd, yyyy")}
							</Typography>
						</Stack>
					</Stack>
				</Grid>
			</Grid>
		</Box>
	)
}


function SSelect ({ name }) {
	const { setValue, watch, formState: { errors } } = useFormContext();
	const values = watch();

	const handleChange = (e) => {
		setValue(name, e.target.value, { shouldValidate: true });
	}

	return (
		<ScoreSelect sx={{ backgroundColor: errors[name]?.message ? "red" : "inherit" }} name={name} value={values[name] || ""} onChange={handleChange}>
			<option value="" style={{ backgroundColor: "#fff" }}></option>
			<option value="1" style={{ backgroundColor: "#fff" }}>1</option>
			<option value="2" style={{ backgroundColor: "#fff" }}>2</option>
			<option value="3" style={{ backgroundColor: "#fff" }}>3</option>
			<option value="4" style={{ backgroundColor: "#fff" }}>4</option>
		</ScoreSelect>
	)
}

export default InspectionCloseoutForm