import { useState, useCallback } from "react";
import { usePage } from "@inertiajs/inertia-react";
import { useQuery } from "@tanstack/react-query";
import { getTrainingsChartByYear } from "@/utils/axios";

import Card from "@mui/material/Card";
import MenuItem from "@mui/material/MenuItem";
import { useTheme } from "@mui/material";
import CardHeader from "@mui/material/CardHeader";
import ButtonBase from "@mui/material/ButtonBase";

import Iconify from "@/Components/iconify";
import Chart, { useChart } from "@/Components/chart";
import CustomPopover, { usePopover } from "@/Components/custom-popover";
import { ProgressLoadingScreen } from "@/Components/loading-screen";
import { generateYears } from "@/utils/years";
import { Grid } from "@mui/material";

function AnalyticsTrainingLine() {
    const theme = useTheme();
    const {
        auth: { user },
    } = usePage().props;
    const [year, setYear] = useState(new Date().getFullYear());
    const years = generateYears();

    const popover = usePopover();

    const { isLoading, data: trainingData } = useQuery({
        queryKey: ["trainings-year", { sub: user.subscriber_id, year }],
        queryFn: () => getTrainingsChartByYear(year),
    });
    const chartOptions = useChart({
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      xaxis: {
          categories: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
          ],
      },
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
            <Grid item xs={12} md={12} lg={6} xl={6}>
                <Card>
                    <CardHeader title="Completed Trainings" />
                    {isLoading && !trainingData ? (
                        <ProgressLoadingScreen
                            color={theme.palette.primary.main}
                            height={364}
                        />
                    ) : (
                        <Chart
                            dir="ltr"
                            type="bar"
                            series={[{ ...trainingData?.completedTrainings }]}
                            options={{
                                ...chartOptions,
                                colors: [theme.palette.info.main],
                                fill: {
                                  type: "gradient",
                                  gradient: {
                                      colorStops: [
                                        {
                                            offset: 0,
                                            color: theme.palette.info.main,
                                            opacity: 1,
                                        },
                                        {
                                            offset: 100,
                                            color: theme.palette.info.dark,
                                            opacity: 1,
                                        },
                                      ]
                                  },
                              },
                            }}
                            width="100%"
                            height={364}
                        />
                    )}
                </Card>
            </Grid>

            <Grid item xs={12} md={12} lg={6} xl={6}>
                <Card sx={{ width: 1 }}>
                    <CardHeader
                        title="Not Completed Trainings"
                        action={
                            <ButtonBase
                                onClick={popover.onOpen}
                                sx={{
                                    pl: 1,
                                    py: 0.5,
                                    pr: 0.5,
                                    borderRadius: 1,
                                    typography: "subtitle2",
                                    bgcolor: "background.neutral",
                                }}
                            >
                                {year}

                                <Iconify
                                    width={16}
                                    icon={
                                        popover.open
                                            ? "eva:arrow-ios-upward-fill"
                                            : "eva:arrow-ios-downward-fill"
                                    }
                                    sx={{ ml: 0.5 }}
                                />
                            </ButtonBase>
                        }
                    />
                    {isLoading && !trainingData ? (
                        <ProgressLoadingScreen
                            color={theme.palette.primary.main}
                            height={364}
                        />
                    ) : (
                        <Chart
                            dir="ltr"
                            type="bar"
                            series={[
                                { ...trainingData?.notCompletedTrainings },
                            ]}
                            options={{
                                ...chartOptions,
                                colors: [theme.palette.warning.light],
                                fill: {
                                    type: "gradient",
                                    gradient: {
                                        colorStops: [
                                          {
                                              offset: 0,
                                              color: theme.palette.warning.main,
                                              opacity: 1,
                                          },
                                          {
                                              offset: 100,
                                              color: theme.palette.warning.dark,
                                              opacity: 1,
                                          },
                                        ]
                                    },
                                },
                            }}
                            width="100%"
                            height={364}
                        />
                    )}
                </Card>
            </Grid>

            <CustomPopover
                open={popover.open}
                onClose={popover.onClose}
                sx={{ width: 140 }}
            >
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
    );
}

export default AnalyticsTrainingLine;
