import PropTypes from "prop-types";
// @mui
import { Box, Card, CardHeader } from "@mui/material";
import { red, orange } from "@mui/material/colors";
// components
import Chart, { useChart } from "@/Components/chart";

// ----------------------------------------------------------------------

const AnalyticsTrendingObservation = ({
    title,
    subheader,
    chart,
    height,
    width,
    trends,
    ...other
}) => {
    const { series, categories, options } = chart;

    const chartOptions = useChart({
        colors: [
            function ({ value }) {
                const isTrend = trends.some((t) => t.value === value);
                return isTrend ? red[500] : orange[500];
            },
        ],
        series,
        plotOptions: {
            bar: {
                columnWidth: "80%",
                dataLabels: {
                    position: "top",
                },
            },
        },
        dataLabels: {
            enabled: true,
            dropShadow: {
                enabled: true,
                blur: 1,
                opacity: 0.25,
            },
            offsetY: 0,
            offsetX: 0,
            style: {
                fontSize: "9px", // Customize the font size of data labels
            },
            value: true, // Display data labels for 0 values
        },
        xaxis: {
            categories,
            labels: {
                trim: true, // Enable label trimming
                maxWidth: 16, // Set the maximum width for labels
                maxHeight: 95,
                show: true,
                rotate: -75,
                style: {
                    fontSize: "10px",
                },
                formatter: function (val) {
                    return val;
                },
            },
        },
        tooltip: {
            enabled: true,
            y: {
                formatter: function (val) {
                    return val !== 0 ? val.toLocaleString("en-US") : ""; // Display the full value on the tooltip
                },
            },
        },
        states: {
            hover: {
                filter: "none",
            },
        },
        legend: {
            showForZeroSeries: true,
        },
        chart: {
            stacked: true,
            dropShadow: {
                enabled: true,
                blur: 1,
                opacity: 0.25,
            },
        },
        ...options,
    });

    return (
        <Card {...other}>
            <CardHeader title={title} subheader={subheader} />
            <Box sx={{ mx: 3 }} dir="ltr">
                <Chart
                    type="bar"
                    series={series}
                    options={chartOptions}
                    height={height}
                    width={width}
                />
            </Box>
        </Card>
    );
};

export default AnalyticsTrendingObservation;

AnalyticsTrendingObservation.propTypes = {
    chart: PropTypes.object,
    title: PropTypes.string,
    subheader: PropTypes.string,
};
