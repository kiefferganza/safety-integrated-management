import { useState, useCallback } from 'react';
import { usePage } from '@inertiajs/inertia-react';
import { useQuery } from '@tanstack/react-query';
import { getTrainingsChartByYear } from '@/utils/axios';


import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import ButtonBase from '@mui/material/ButtonBase';

import Iconify from '@/Components/iconify';
import Chart, { useChart } from '@/Components/chart';
import CustomPopover, { usePopover } from '@/Components/custom-popover';
import { ProgressLoadingScreen } from '@/Components/loading-screen';
import { generateYears } from '@/utils/years';

function AnalyticsTrainingLine () {
	const theme = useTheme();
	const { auth: { user } } = usePage().props;
	const [year, setYear] = useState(new Date().getFullYear());
	const years = generateYears();

	const popover = usePopover();

	const { isLoading, data: trainingData } = useQuery({
		queryKey: ['trainings-year', { sub: user.subscriber_id, year }],
		queryFn: () => getTrainingsChartByYear(year)
	})

	const colors = [
		[theme.palette.primary.light, theme.palette.primary.main],
		[theme.palette.info.light, theme.palette.info.main],
		[theme.palette.error.light, theme.palette.error.main],
	]
	const chartOptions = useChart({
		colors: colors.map((colr) => colr[1]),
		fill: {
			type: 'gradient',
			gradient: {
				colorStops: colors.map((colr) => [
					{ offset: 0, color: colr[0], opacity: 1 },
					{ offset: 100, color: colr[1], opacity: 1 },
				]),
			},
		},
		xaxis: {
			categories: [
				'Jan',
				'Feb',
				'Mar',
				'Apr',
				'May',
				'Jun',
				'Jul',
				'Aug',
				'Sep',
				'Oct',
				'Nov',
				'Dec',
			],
		}
	});

	const handleChangeSeries = useCallback(
		(newValue) => {
			popover.onClose();
			setYear(newValue);
		},
		[popover]
	);

	return (
		<>
			<Card sx={{ width: 1 }}>
				<CardHeader
					title="Trainings"
					action={
						<ButtonBase
							onClick={popover.onOpen}
							sx={{
								pl: 1,
								py: 0.5,
								pr: 0.5,
								borderRadius: 1,
								typography: 'subtitle2',
								bgcolor: 'background.neutral',
							}}
						>
							{year}

							<Iconify
								width={16}
								icon={popover.open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
								sx={{ ml: 0.5 }}
							/>
						</ButtonBase>
					}
				/>

				<Box sx={{ mt: 3, mx: 3 }}>
					{isLoading && !trainingData ? (
						<ProgressLoadingScreen color={theme.palette.primary.main} height={364} />
					) : (
						<Chart
							dir="ltr"
							type="line"
							series={[
								{ ...trainingData?.completedTrainings },
								{ ...trainingData?.inductions },
								{ ...trainingData?.notCompletedTrainings },
							]}
							options={chartOptions}
							width="100%"
							height={364}
						/>
					)}
				</Box>
			</Card>

			<CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 140 }}>
				{years.map((option) => (
					<MenuItem
						key={option}
						selected={option === year}
						onClick={() => handleChangeSeries(option)}
					>
						{option}
					</MenuItem>
				))}
			</CustomPopover>
		</>
	)
}

export default AnalyticsTrainingLine
