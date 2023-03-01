import { useCallback } from "react";
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
const { RHFTextField, RHFUpload } = await import("@/Components/hook-form");
import FormProvider from "@/Components/hook-form/FormProvider";
import Iconify from "@/Components/iconify";

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

const statisticSchema = Yup.object().shape({
	year: Yup.number().nullable().required("Please select a year to insert the record."),
	file_src: Yup.mixed().required("Please attach a file."),
	manpower_1_January: Yup.number(),
	manhours_1_January: Yup.number(),
	manpower_2_February: Yup.number(),
	manhours_2_February: Yup.number(),
	manpower_3_March: Yup.number(),
	manhours_3_March: Yup.number(),
	manpower_4_April: Yup.number(),
	manhours_4_April: Yup.number(),
	manpower_5_May: Yup.number(),
	manhours_5_May: Yup.number(),
	manpower_6_June: Yup.number(),
	manhours_6_June: Yup.number(),
	manpower_7_July: Yup.number(),
	manhours_7_July: Yup.number(),
	manpower_8_August: Yup.number(),
	manhours_8_August: Yup.number(),
	manpower_9_September: Yup.number(),
	manhours_9_September: Yup.number(),
	manpower_10_October: Yup.number(),
	manhours_10_October: Yup.number(),
	manpower_11_November: Yup.number(),
	manhours_11_November: Yup.number(),
	manpower_12_December: Yup.number(),
	manhours_12_December: Yup.number(),
});

export const TBTNewEditStatisTicDialog = ({ open, onClose, statistic, yearsDisabled, ...other }) => {
	const { load, stop } = useSwal();

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

	const yearVal = watch("year");

	const onSubmit = (data) => {
		const selYear = data.year;
		const file_src = data.file_src;
		delete data.year;
		delete data.file_src;
		const months = Object.entries(data);
		const monthsData = months.reduce((acc, mon) => {
			const [d, m, l] = mon[0].split("_");
			const monthInAcc = acc.findIndex(a => a.month_code === +m);
			if (monthInAcc !== -1) {
				if (d === "manpower") {
					acc[monthInAcc].manpower = mon[1];
				}
				if (d === "manhours") {
					acc[monthInAcc].manhours = mon[1];
				}
				acc[monthInAcc].month_code = +m
				acc[monthInAcc].month = l;
			} else {
				acc.push({
					manpower: d === "manpower" ? mon[1] : 0,
					manhours: d === "manhours" ? mon[1] : 0,
					month: l,
					month_code: +m
				});
			}
			return acc;
		}, [])

		const newData = {
			year: selYear,
			file_src,
			months: monthsData
		}
		Inertia.post(route('toolboxtalk.management.store_statistic'), newData, {
			preserveScroll: true,
			onStart () {
				handleClose();
				load("Inserting record", "please wait...");
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

			setValue('file_src', newFile, { shouldDirty: true });
		},
		[setValue]
	);


	const handleClose = () => {
		onClose();
		reset();
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
					value={getValues(`manpower_${mon.month_code}_${mon.label}`) === 0 ? '' : getValues(`manpower_${mon.month_code}_${mon.label}`)}
					onChange={(event) => setValue(`manpower_${mon.month_code}_${mon.label}`, Number(event.target.value), { shouldValidate: true })}
					sx={{ maxWidth: 220 }}
					InputLabelProps={{ shrink: true }}
					InputProps={{
						type: 'number',
					}}
				/>
				<RHFTextField
					name={`manhours_${mon.month_code}_${mon.label}`}
					label="Manhour"
					placeholder="0"
					size="small"
					value={getValues(`manhours_${mon.month_code}_${mon.label}`) === 0 ? '' : getValues(`manhours_${mon.month_code}_${mon.label}`)}
					onChange={(event) => setValue(`manhours_${mon.month_code}_${mon.label}`, Number(event.target.value), { shouldValidate: true })}
					sx={{ maxWidth: 220 }}
					InputLabelProps={{ shrink: true }}
					InputProps={{
						type: 'number',
					}}
				/>
			</Stack>
			<Divider sx={{ borderStyle: "dashed", mb: 1 }} />
		</Stack>
	)

	return (
		<Dialog fullWidth maxWidth="md" open={open} onClose={handleClose} {...other}>
			<Stack direction="row" justifyContent="space-between" alignItems="center">
				<DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}>Insert Record</DialogTitle>
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
								minDate={new Date(2013, 1, 1)}
								maxDate={new Date()}
								value={yearVal ? new Date(yearVal, 1, 1) : null}
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
						<RHFUpload
							thumbnail
							name="file_src"
							maxSize={3145728}
							onDrop={handleDrop}
						/>
					</Stack>
					<Stack direction="row" justifyContent="end">
						<Button type="submit" variant="contained" sx={{ my: 2 }}>
							Insert
						</Button>
					</Stack>
				</FormProvider>
			</DialogContent>
		</Dialog>
	)
}