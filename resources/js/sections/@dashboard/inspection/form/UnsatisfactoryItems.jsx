import { Fragment, useCallback } from "react";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { Upload } from "@/Components/upload";
import Image from "@/Components/image";

const UnsatisfactoryItems = () => {
	const { watch, setValue, formState: { errors } } = useFormContext();
	const values = watch();

	const handleDropSingleFile = useCallback((acceptedFiles, name) => {
		const file = acceptedFiles[0];
		setValue(name, Object.assign(file, {
			preview: URL.createObjectURL(file),
		}));
	}, []);

	return (
		<Box sx={{ p: 3 }}>
			<Box sx={{ mb: 2, px: 3 }}>
				<Box sx={{ mb: { xs: 0, md: -1 } }}>
					<Image disabledEffect alt="logo" src="/logo/Fiafi-logo.png" sx={{ maxWidth: 160, margin: { xs: '0px auto 8px auto', md: 0 } }} />
				</Box>
				<Box sx={{ mb: 3 }}>
					<Typography variant="h5" textAlign="center">Details of Unsatisfactory Items</Typography>
				</Box>
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
				{values.sectionA.filter(sec => sec.score !== "" && sec.score !== "4" && sec.score !== "1").map((sec) => (
					<Fragment key={sec.refNumber}>
						<Grid item sm={12} md={6}>
							<Stack direction="row" gap={5} width={1}>
								<Stack flex={.4}>
									<Typography variant="body1">Ref #</Typography>
									<Typography sx={{ pl: 1 }} borderBottom={1} variant="body1" fontWeight={700}>{sec.refNumber}</Typography>
								</Stack>
								<Stack flex={1}>
									<Typography variant="body1">Location</Typography>
									<Typography sx={{ pl: 1 }} borderBottom={1} variant="body1" fontWeight={700}>{values?.location || "N/A"}</Typography>
								</Stack>
							</Stack>
							<Stack height={500} width={1} sx={{ mt: 2 }} border={1} borderColor={errors?.sectionA?.length > 0 && !values.sectionA[sec.index]?.findings ? "red" : "#000"}>
								<Box borderBottom={1} height="7%" borderColor="#000" sx={{ p: "5px", bgcolor: "#d9d9d9", color: "#c00000" }}>
									<Typography sx={{ pl: 1 }} fontWeight={700}>Photo (Before)</Typography>
								</Box>
								<Box height="65%" borderBottom={1}>
									<Upload sx={{ height: "100%", "&>div": { height: "100%", "& img": { objectFit: "fill" } } }} file={values.sectionA[sec.index]?.photo_before || "/storage/media/inspection/blank.png"} onDrop={(file) => handleDropSingleFile(file, `sectionA.${sec.index}.photo_before`)} />
								</Box>
								<Box height="28%" sx={{ p: 1 }}>
									<Typography fontWeight={700} sx={{ color: "#c00000", mb: 2 }}>Findings:</Typography>
									<FindingComment name={`sectionA.${sec.index}.findings`} />
								</Box>
							</Stack>
						</Grid>
						<Grid item sm={12} md={6}>
							<Stack flex={1}>
								<Typography variant="body1">Company</Typography>
								<Typography sx={{ pl: 1 }} borderBottom={1} variant="body1" fontWeight={700}>FIAFI Group</Typography>
							</Stack>
							<Stack height={500} width={1} sx={{ mt: 2 }} border={1}>
								<Box borderBottom={1} height="7%" borderColor="#000" sx={{ p: "5px", bgcolor: "#d9d9d9", color: "#385623" }}>
									<Typography sx={{ pl: 1 }} fontWeight={700}>Photo (After)</Typography>
								</Box>
								<Box height="65%" borderBottom={1} display="flex" alignItems="center" justifyContent="center">
									<Typography variant="h4" fontWeight={400}>For Reviewer Response</Typography>
								</Box>
								<Box height="28%" sx={{ p: 1 }}>
									<Stack justifyContent="space-between" direction="row">
										<Box width={1}>
											<Typography fontWeight={700} sx={{ color: "#385623", mb: 2 }}>Action Taken:</Typography>
										</Box>
										<Box width={1}>
											<Typography fontWeight={700} sx={{ color: "#385623", mb: 2 }}>Close on:</Typography>
										</Box>
									</Stack>
								</Box>
							</Stack>
						</Grid>
					</Fragment>
				))}
				{values.sectionB.filter(sec => sec.score !== "" && sec.score !== "4" && sec.score !== "1").map((sec) => (
					<Fragment key={sec.refNumber}>
						<Grid item sm={12} md={6}>
							<Stack direction="row" gap={5} width={1}>
								<Stack flex={.4}>
									<Typography variant="body1">Ref #</Typography>
									<Typography sx={{ pl: 1 }} borderBottom={1} variant="body1" fontWeight={700}>{sec.refNumber}</Typography>
								</Stack>
								<Stack flex={1}>
									<Typography variant="body1">Location</Typography>
									<Typography sx={{ pl: 1 }} borderBottom={1} variant="body1" fontWeight={700}>{values?.location || "N/A"}</Typography>
								</Stack>
							</Stack>
							<Stack height={500} width={1} sx={{ mt: 2 }} border={1} borderColor={errors?.sectionB?.length > 0 && !values.sectionB[sec.index]?.findings ? "red" : "#000"}>
								<Box borderBottom={1} height="7%" borderColor="#000" sx={{ p: "5px", bgcolor: "#d9d9d9", color: "#c00000" }}>
									<Typography sx={{ pl: 1 }} fontWeight={700}>Photo (Before)</Typography>
								</Box>
								<Box height="65%" borderBottom={1}>
									<Upload sx={{ height: "100%", "&>div": { height: "100%", "& img": { objectFit: "fill" } } }} file={values.sectionB[sec.index]?.photo_before || "/storage/media/inspection/blank.png"} onDrop={(file) => handleDropSingleFile(file, `sectionB.${sec.index}.photo_before`)} />
								</Box>
								<Box height="28%" sx={{ p: 1 }}>
									<Typography fontWeight={700} sx={{ color: "#c00000", mb: 2 }}>Findings:</Typography>
									<FindingComment name={`sectionB.${sec.index}.findings`} />
								</Box>
							</Stack>
						</Grid>
						<Grid item sm={12} md={6}>
							<Stack flex={1}>
								<Typography variant="body1">Company</Typography>
								<Typography sx={{ pl: 1 }} borderBottom={1} variant="body1" fontWeight={700}>FIAFI Group</Typography>
							</Stack>
							<Stack height={500} width={1} sx={{ mt: 2 }} border={1}>
								<Box borderBottom={1} height="7%" borderColor="#000" sx={{ p: "5px", bgcolor: "#d9d9d9", color: "#385623" }}>
									<Typography sx={{ pl: 1 }} fontWeight={700}>Photo (After)</Typography>
								</Box>
								<Box height="65%" borderBottom={1} display="flex" alignItems="center" justifyContent="center">
									<Typography variant="h4" fontWeight={400}>For Reviewer Response</Typography>
								</Box>
								<Box height="28%" sx={{ p: 1 }}>
									<Stack justifyContent="space-between" direction="row">
										<Box width={1}>
											<Typography fontWeight={700} sx={{ color: "#385623", mb: 2 }}>Action Taken:</Typography>
										</Box>
										<Box width={1}>
											<Typography fontWeight={700} sx={{ color: "#385623", mb: 2 }}>Close on:</Typography>
										</Box>
									</Stack>
								</Box>
							</Stack>
						</Grid>
					</Fragment>
				))}
				{values.sectionC.filter(sec => sec.score !== "" && sec.score !== "4" && sec.score !== "1").map((sec) => (
					<Fragment key={sec.refNumber}>
						<Grid item sm={12} md={6}>
							<Stack direction="row" gap={5} width={1}>
								<Stack flex={.4}>
									<Typography variant="body1">Ref #</Typography>
									<Typography sx={{ pl: 1 }} borderBottom={1} variant="body1" fontWeight={700}>{sec.refNumber}</Typography>
								</Stack>
								<Stack flex={1}>
									<Typography variant="body1">Location</Typography>
									<Typography sx={{ pl: 1 }} borderBottom={1} variant="body1" fontWeight={700}>{values?.location || "N/A"}</Typography>
								</Stack>
							</Stack>
							<Stack height={500} width={1} sx={{ mt: 2 }} border={1} borderColor={errors?.sectionC?.length > 0 && !values.sectionC[sec.index]?.findings ? "red" : "#000"}>
								<Box borderBottom={1} height="7%" borderColor="#000" sx={{ p: "5px", bgcolor: "#d9d9d9", color: "#c00000" }}>
									<Typography sx={{ pl: 1 }} fontWeight={700}>Photo (Before)</Typography>
								</Box>
								<Box height="65%" borderBottom={1}>
									<Upload sx={{ height: "100%", "&>div": { height: "100%", "& img": { objectFit: "fill" } } }} file={values.sectionC[sec.index]?.photo_before || "/storage/media/inspection/blank.png"} onDrop={(file) => handleDropSingleFile(file, `sectionC.${sec.index}.photo_before`)} />
								</Box>
								<Box height="28%" sx={{ p: 1 }}>
									<Typography fontWeight={700} sx={{ color: "#c00000", mb: 2 }}>Findings:</Typography>
									<FindingComment name={`sectionC.${sec.index}.findings`} />
								</Box>
							</Stack>
						</Grid>
						<Grid item sm={12} md={6}>
							<Stack flex={1}>
								<Typography variant="body1">Company</Typography>
								<Typography sx={{ pl: 1 }} borderBottom={1} variant="body1" fontWeight={700}>FIAFI Group</Typography>
							</Stack>
							<Stack height={500} width={1} sx={{ mt: 2 }} border={1}>
								<Box borderBottom={1} height="7%" borderColor="#000" sx={{ p: "5px", bgcolor: "#d9d9d9", color: "#385623" }}>
									<Typography sx={{ pl: 1 }} fontWeight={700}>Photo (After)</Typography>
								</Box>
								<Box height="65%" borderBottom={1} display="flex" alignItems="center" justifyContent="center">
									<Typography variant="h4" fontWeight={400}>For Reviewer Response</Typography>
								</Box>
								<Box height="28%" sx={{ p: 1 }}>
									<Stack justifyContent="space-between" direction="row">
										<Box width={1}>
											<Typography fontWeight={700} sx={{ color: "#385623", mb: 2 }}>Action Taken:</Typography>
										</Box>
										<Box width={1}>
											<Typography fontWeight={700} sx={{ color: "#385623", mb: 2 }}>Close on:</Typography>
										</Box>
									</Stack>
								</Box>
							</Stack>
						</Grid>
					</Fragment>
				))}
				{values.sectionC_B.filter(sec => sec.score !== "" && sec.score !== "4" && sec.score !== "1").map((sec) => (
					<Fragment key={sec.refNumber}>
						<Grid item sm={12} md={6}>
							<Stack direction="row" gap={5} width={1}>
								<Stack flex={.4}>
									<Typography variant="body1">Ref #</Typography>
									<Typography sx={{ pl: 1 }} borderBottom={1} variant="body1" fontWeight={700}>{sec.refNumber}</Typography>
								</Stack>
								<Stack flex={1}>
									<Typography variant="body1">Location</Typography>
									<Typography sx={{ pl: 1 }} borderBottom={1} variant="body1" fontWeight={700}>{values?.location || "N/A"}</Typography>
								</Stack>
							</Stack>
							<Stack height={500} width={1} sx={{ mt: 2 }} border={1} borderColor={errors?.sectionC_B?.length > 0 && !values.sectionC_B[sec.index]?.findings ? "red" : "#000"}>
								<Box borderBottom={1} height="7%" borderColor="#000" sx={{ p: "5px", bgcolor: "#d9d9d9", color: "#c00000" }}>
									<Typography sx={{ pl: 1 }} fontWeight={700}>Photo (Before)</Typography>
								</Box>
								<Box height="65%" borderBottom={1}>
									<Upload sx={{ height: "100%", "&>div": { height: "100%", "& img": { objectFit: "fill" } } }} file={values.sectionC_B[sec.index]?.photo_before || "/storage/media/inspection/blank.png"} onDrop={(file) => handleDropSingleFile(file, `sectionC_B.${sec.index}.photo_before`)} />
								</Box>
								<Box height="28%" sx={{ p: 1 }}>
									<Typography fontWeight={700} sx={{ color: "#c00000", mb: 2 }}>Findings:</Typography>
									<FindingComment name={`sectionC_B.${sec.index}.findings`} />
								</Box>
							</Stack>
						</Grid>
						<Grid item sm={12} md={6}>
							<Stack flex={1}>
								<Typography variant="body1">Company</Typography>
								<Typography sx={{ pl: 1 }} borderBottom={1} variant="body1" fontWeight={700}>FIAFI Group</Typography>
							</Stack>
							<Stack height={500} width={1} sx={{ mt: 2 }} border={1}>
								<Box borderBottom={1} height="7%" borderColor="#000" sx={{ p: "5px", bgcolor: "#d9d9d9", color: "#385623" }}>
									<Typography sx={{ pl: 1 }} fontWeight={700}>Photo (After)</Typography>
								</Box>
								<Box height="65%" borderBottom={1} display="flex" alignItems="center" justifyContent="center">
									<Typography variant="h4" fontWeight={400}>For Reviewer Response</Typography>
								</Box>
								<Box height="28%" sx={{ p: 1 }}>
									<Stack justifyContent="space-between" direction="row">
										<Box width={1}>
											<Typography fontWeight={700} sx={{ color: "#385623", mb: 2 }}>Action Taken:</Typography>
										</Box>
										<Box width={1}>
											<Typography fontWeight={700} sx={{ color: "#385623", mb: 2 }}>Close on:</Typography>
										</Box>
									</Stack>
								</Box>
							</Stack>
						</Grid>
					</Fragment>
				))}
				{values.sectionD.filter(sec => sec.score !== "" && sec.score !== "4" && sec.score !== "1").map((sec) => (
					<Fragment key={sec.refNumber}>
						<Grid item sm={12} md={6}>
							<Stack direction="row" gap={5} width={1}>
								<Stack flex={.4}>
									<Typography variant="body1">Ref #</Typography>
									<Typography sx={{ pl: 1 }} borderBottom={1} variant="body1" fontWeight={700}>{sec.refNumber}</Typography>
								</Stack>
								<Stack flex={1}>
									<Typography variant="body1">Location</Typography>
									<Typography sx={{ pl: 1 }} borderBottom={1} variant="body1" fontWeight={700}>{values?.location || "N/A"}</Typography>
								</Stack>
							</Stack>
							<Stack height={500} width={1} sx={{ mt: 2 }} border={1} borderColor={errors?.sectionD?.length > 0 && !values.sectionD[sec.index]?.findings ? "red" : "#000"}>
								<Box borderBottom={1} height="7%" borderColor="#000" sx={{ p: "5px", bgcolor: "#d9d9d9", color: "#c00000" }}>
									<Typography sx={{ pl: 1 }} fontWeight={700}>Photo (Before)</Typography>
								</Box>
								<Box height="65%" borderBottom={1}>
									<Upload sx={{ height: "100%", "&>div": { height: "100%", "& img": { objectFit: "fill" } } }} file={values.sectionD[sec.index]?.photo_before || "/storage/media/inspection/blank.png"} onDrop={(file) => handleDropSingleFile(file, `sectionD.${sec.index}.photo_before`)} />
								</Box>
								<Box height="28%" sx={{ p: 1 }}>
									<Typography fontWeight={700} sx={{ color: "#c00000", mb: 2 }}>Findings:</Typography>
									<FindingComment name={`sectionD.${sec.index}.findings`} />
								</Box>
							</Stack>
						</Grid>
						<Grid item sm={12} md={6}>
							<Stack flex={1}>
								<Typography variant="body1">Company</Typography>
								<Typography sx={{ pl: 1 }} borderBottom={1} variant="body1" fontWeight={700}>FIAFI Group</Typography>
							</Stack>
							<Stack height={500} width={1} sx={{ mt: 2 }} border={1}>
								<Box borderBottom={1} height="7%" borderColor="#000" sx={{ p: "5px", bgcolor: "#d9d9d9", color: "#385623" }}>
									<Typography sx={{ pl: 1 }} fontWeight={700}>Photo (After)</Typography>
								</Box>
								<Box height="65%" borderBottom={1} display="flex" alignItems="center" justifyContent="center">
									<Typography variant="h4" fontWeight={400}>For Reviewer Response</Typography>
								</Box>
								<Box height="28%" sx={{ p: 1 }}>
									<Stack justifyContent="space-between" direction="row">
										<Box width={1}>
											<Typography fontWeight={700} sx={{ color: "#385623", mb: 2 }}>Action Taken:</Typography>
										</Box>
										<Box width={1}>
											<Typography fontWeight={700} sx={{ color: "#385623", mb: 2 }}>Close on:</Typography>
										</Box>
									</Stack>
								</Box>
							</Stack>
						</Grid>
					</Fragment>
				))}
				{values.sectionE.filter(sec => sec.score !== "" && sec.score !== "4" && sec.score !== "1").map((sec) => (
					<Fragment key={sec.refNumber}>
						<Grid item sm={12} md={6}>
							<Stack direction="row" gap={5} width={1}>
								<Stack flex={.4}>
									<Typography variant="body1">Ref #</Typography>
									<Typography sx={{ pl: 1 }} borderBottom={1} variant="body1" fontWeight={700}>{sec.refNumber}</Typography>
								</Stack>
								<Stack flex={1}>
									<Typography variant="body1">Location</Typography>
									<Typography sx={{ pl: 1 }} borderBottom={1} variant="body1" fontWeight={700}>{values?.location || "N/A"}</Typography>
								</Stack>
							</Stack>
							<Stack height={500} width={1} sx={{ mt: 2 }} border={1} borderColor={errors?.sectionE?.length > 0 && !values.sectionE[sec.index]?.findings ? "red" : "#000"}>
								<Box borderBottom={1} height="7%" borderColor="#000" sx={{ p: "5px", bgcolor: "#d9d9d9", color: "#c00000" }}>
									<Typography sx={{ pl: 1 }} fontWeight={700}>Photo (Before)</Typography>
								</Box>
								<Box height="65%" borderBottom={1}>
									<Upload sx={{ height: "100%", "&>div": { height: "100%", "& img": { objectFit: "fill" } } }} file={values.sectionE[sec.index]?.photo_before || "/storage/media/inspection/blank.png"} onDrop={(file) => handleDropSingleFile(file, `sectionE.${sec.index}.photo_before`)} />
								</Box>
								<Box height="28%" sx={{ p: 1 }}>
									<Typography fontWeight={700} sx={{ color: "#c00000", mb: 2 }}>Findings:</Typography>
									<FindingComment name={`sectionE.${sec.index}.findings`} />
								</Box>
							</Stack>
						</Grid>
						<Grid item sm={12} md={6}>
							<Stack flex={1}>
								<Typography variant="body1">Company</Typography>
								<Typography sx={{ pl: 1 }} borderBottom={1} variant="body1" fontWeight={700}>FIAFI Group</Typography>
							</Stack>
							<Stack height={500} width={1} sx={{ mt: 2 }} border={1}>
								<Box borderBottom={1} height="7%" borderColor="#000" sx={{ p: "5px", bgcolor: "#d9d9d9", color: "#385623" }}>
									<Typography sx={{ pl: 1 }} fontWeight={700}>Photo (After)</Typography>
								</Box>
								<Box height="65%" borderBottom={1} display="flex" alignItems="center" justifyContent="center">
									<Typography variant="h4" fontWeight={400}>For Reviewer Response</Typography>
								</Box>
								<Box height="28%" sx={{ p: 1 }}>
									<Stack justifyContent="space-between" direction="row">
										<Box width={1}>
											<Typography fontWeight={700} sx={{ color: "#385623", mb: 2 }}>Action Taken:</Typography>
										</Box>
										<Box width={1}>
											<Typography fontWeight={700} sx={{ color: "#385623", mb: 2 }}>Close on:</Typography>
										</Box>
									</Stack>
								</Box>
							</Stack>
						</Grid>
					</Fragment>
				))}
			</Grid>

		</Box>
	)
}

function FindingComment ({ name }) {
	const { control } = useFormContext();
	return (
		<Controller
			name={name}
			control={control}
			render={({ field }) => (
				<textarea {...field} style={{ display: 'block', width: '100%', outline: 0, border: 0, fontFamily: 'Public Sans,sans-serif' }} rows={5}></textarea>
			)}
		/>
	)
}

export default UnsatisfactoryItems