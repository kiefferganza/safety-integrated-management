import { useCallback, useEffect, memo } from "react";
// form
import { useForm } from "react-hook-form";
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { Inertia } from "@inertiajs/inertia";
import { useSwal } from "@/hooks/useSwal";
// mui
const { Button, Dialog, DialogContent, DialogTitle, Divider, Grid, Stack, TextField, Typography } = await import("@mui/material");
const { MobileDatePicker } = await import('@mui/x-date-pickers');
// Components
import { RHFTextField } from "@/Components/hook-form";
import { MultiFilePreview, Upload } from "@/Components/upload";
import FormProvider from "@/Components/hook-form/FormProvider";
import Iconify from "@/Components/iconify";
import { PATH_DASHBOARD } from "@/routes/paths";

const MONTHS_HALF = [
	{ month_code: 1, label: "January" },
	{ month_code: 3, label: "March" },
	{ month_code: 5, label: "May" },
	{ month_code: 7, label: "July" },
	{ month_code: 9, label: "September" },
	{ month_code: 11, label: "November" },
];
const MONTHS_SECOND_HALF = [
	{ month_code: 2, label: "February" },
	{ month_code: 4, label: "April" },
	{ month_code: 6, label: "June" },
	{ month_code: 8, label: "August" },
	{ month_code: 10, label: "October" },
	{ month_code: 12, label: "December" },
];

const TBTNewEditStatisTicDialog = memo(({ open, onClose, statistic, yearsDisabled, ...other }) => {
	const { load, stop } = useSwal();
	const statisticSchema = Yup.object().shape({
		year: Yup.number().nullable().required("Please select a year to insert the record.").test({
			name: "invalid_year",
			test (val) {
				return (yearsDisabled.includes(val) && statistic === null) ? this.createError({ message: "This year is invalid." }) : true;
			}
		}),
		file_src: Yup.mixed().required("Please attach a file."),
		manpower_1_January: Yup.string(),
		manhours_1_January: Yup.string(),
		manpower_2_February: Yup.string(),
		manhours_2_February: Yup.string(),
		manpower_3_March: Yup.string(),
		manhours_3_March: Yup.string(),
		manpower_4_April: Yup.string(),
		manhours_4_April: Yup.string(),
		manpower_5_May: Yup.string(),
		manhours_5_May: Yup.string(),
		manpower_6_June: Yup.string(),
		manhours_6_June: Yup.string(),
		manpower_7_July: Yup.string(),
		manhours_7_July: Yup.string(),
		manpower_8_August: Yup.string(),
		manhours_8_August: Yup.string(),
		manpower_9_September: Yup.string(),
		manhours_9_September: Yup.string(),
		manpower_10_October: Yup.string(),
		manhours_10_October: Yup.string(),
		manpower_11_November: Yup.string(),
		manhours_11_November: Yup.string(),
		manpower_12_December: Yup.string(),
		manhours_12_December: Yup.string(),
	});

	const defaultValues = {
		year: null,
		file_src: null,
		manpower_1_January: 0,
		manhours_1_January: 0,
		manpower_2_February: 0,
		manhours_2_February: 0,
		manpower_3_March: 0,
		manhours_3_March: 0,
		manpower_4_April: 0,
		manhours_4_April: 0,
		manpower_5_May: 0,
		manhours_5_May: 0,
		manpower_6_June: 0,
		manhours_6_June: 0,
		manpower_7_July: 0,
		manhours_7_July: 0,
		manpower_8_August: 0,
		manhours_8_August: 0,
		manpower_9_September: 0,
		manhours_9_September: 0,
		manpower_10_October: 0,
		manhours_10_October: 0,
		manpower_11_November: 0,
		manhours_11_November: 0,
		manpower_12_December: 0,
		manhours_12_December: 0,
	};

	const methods = useForm({
		resolver: yupResolver(statisticSchema),
		defaultValues
	});
	const { setValue, getValues, watch, handleSubmit, reset, formState: { errors } } = methods;

	useEffect(() => {
		if (statistic) {
			const editValues = {
				year: +statistic.year,
				file_src: statistic?.src || null
			}
			for (const month of statistic.months) {
				editValues[`manpower_${month.month_code}_${month.month}`] = month.manpower;
				editValues[`manhours_${month.month_code}_${month.month}`] = month.manhours;
			}
			reset(editValues);
		} else {
			reset(defaultValues);
		}
	}, [statistic]);

	const values = watch();

	const onSubmit = (data) => {
		const selYear = statistic ? +statistic.year : data.year;
		const file_src = data.file_src;
		delete data.year;
		delete data.file_src;
		const months = Object.entries(data);
		const monthsData = months.reduce((acc, mon) => {
			const [d, m, l] = mon[0].split("_");
			const monthInAcc = acc.findIndex(a => a.month_code === +m);
			if (monthInAcc !== -1) {
				if (d === "manpower") {
					acc[monthInAcc].manpower = Number(mon[1]?.replace(/,/g, ""));
				}
				if (d === "manhours") {
					acc[monthInAcc].manhours = Number(mon[1]?.replace(/,/g, ""));
				}
				acc[monthInAcc].month_code = +m
				acc[monthInAcc].month = l;
			} else {
				acc.push({
					manpower: d === "manpower" ? Number(mon[1]?.replace(/,/g, "")) : 0,
					manhours: d === "manhours" ? Number(mon[1]?.replace(/,/g, "")) : 0,
					month: l,
					month_code: +m
				});
			}
			return acc;
		}, [])

		const newData = {
			year: selYear,
			months: monthsData
		}

		if (typeof file_src !== "string") {
			newData.file_src = file_src;
		}
		Inertia.post(statistic?.id ? PATH_DASHBOARD.toolboxTalks.editStatistic(statistic.id) : route('toolboxtalk.management.store_statistic'), newData, {
			preserveScroll: true,
			onStart () {
				handleClose();
				load(statistic ? `Updating ${statistic.year} record.` : "Inserting record", "please wait...");
			},
			onFinish () {
				stop();
			}
		});
	}

	const handleDrop = useCallback(
		(acceptedFiles) => {
			const newFile = Object.assign(acceptedFiles[0], {
				preview: URL.createObjectURL(acceptedFiles[0]),
			})

			setValue('file_src', newFile, { shouldValidate: true });
		},
		[setValue]
	);

	const onRemove = () => {
		setValue("file_src", null, { shouldValidate: true });
	}


	const handleClose = () => {
		onClose();
		reset(defaultValues);
	}

	const renderField = (mon) => (
		<Stack spacing={1} key={mon.month_code}>
			<Typography variant="subtitle2">{mon.label}</Typography>
			<Stack direction="row" spacing={1}>
				<RHFTextField
					name={`manpower_${mon.month_code}_${mon.label}`}
					label="Manpower"
					placeholder="0"
					size="small"
					value={getValues(`manpower_${mon.month_code}_${mon.label}`)}
					onChange={(event) => {
						const val = +(event.target.value + "").replace(/,/g, "");
						if (event.target.value !== "") {
							if (val) {
								setValue(`manpower_${mon.month_code}_${mon.label}`, val.toLocaleString(), { shouldValidate: true })
							}
						} else {
							setValue(`manpower_${mon.month_code}_${mon.label}`, "0", { shouldValidate: true })
						}
					}}
					sx={{ maxWidth: 220 }}
					InputLabelProps={{ shrink: true }}
				/>
				<RHFTextField
					name={`manhours_${mon.month_code}_${mon.label}`}
					label="Manhour"
					placeholder="0"
					size="small"
					value={getValues(`manhours_${mon.month_code}_${mon.label}`)}
					onChange={(event) => {
						if (event.target.value !== "") {
							const val = +(event.target.value + "").replace(/,/g, "");
							if (val) {
								setValue(`manhours_${mon.month_code}_${mon.label}`, val.toLocaleString(), { shouldValidate: true })
							}
						} else {
							setValue(`manhours_${mon.month_code}_${mon.label}`, "0", { shouldValidate: true })
						}
					}}
					sx={{ maxWidth: 220 }}
					InputLabelProps={{ shrink: true }}
				/>
			</Stack>
			<Divider sx={{ borderStyle: "dashed", mb: 1 }} />
		</Stack>
	)

	return (
		<Dialog fullWidth maxWidth="lg" open={open} onClose={handleClose} {...other}>
			<Stack direction="row" justifyContent="space-between" alignItems="center">
				<DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}>
					{statistic ? `Update Record For ${statistic.year}` : "Insert Record"}
				</DialogTitle>
			</Stack>
			<DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
				<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
					<Grid container spacing={4}>
						<Grid item xs={12}>
							<MobileDatePicker
								label="Select Year"
								inputFormat="yyyy"
								showToolbar
								views={['year']}
								openTo="year"
								maxDate={new Date()}
								disabled={!!statistic}
								value={values?.year ? new Date(values?.year, 1, 1) : null}
								onChange={(newVal) => {
									setValue("year", newVal.getFullYear(), { shouldValidate: true })
								}}
								shouldDisableYear={(d) => yearsDisabled.includes(d.getFullYear())}
								renderInput={(params) => (
									<TextField
										{...params}
										size="small"
										fullWidth
										sx={{
											maxWidth: { md: 160 },
										}}
										InputProps={{
											readOnly: true,
											endAdornment: (
												<Iconify icon="eva:calendar-fill" sx={{ color: 'primary.main' }} />
											)
										}}
										error={!!errors?.year?.message}
										helperText={errors?.year?.message}
									/>
								)}
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							{MONTHS_HALF.map((mon) => renderField(mon))}
						</Grid>
						<Divider flexItem orientation="vertical" sx={{ marginRight: "-18px", marginLeft: "12px", borderStyle: "dashed" }} />
						<Grid item xs={12} md={6}>
							{MONTHS_SECOND_HALF.map((mon) => renderField(mon))}
						</Grid>
					</Grid>
					<Stack sx={{ my: 2 }}>
						<Upload maxSize={3145728} error={!!errors?.file_src?.message} helperText={errors?.file_src?.message} file={values.file_src || null} onDrop={handleDrop} />
						<MultiFilePreview files={values?.file_src ? [values.file_src] : []} onRemove={onRemove} />
					</Stack>
					<Stack direction="row" justifyContent="end">
						<Button type="submit" variant="contained" sx={{ my: 2 }}>
							{statistic ? "Update" : "Insert"}
						</Button>
					</Stack>
				</FormProvider>
			</DialogContent>
		</Dialog>
	)
});

export { TBTNewEditStatisTicDialog }