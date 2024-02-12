import Chart, { useChart } from "@/Components/chart";
import { red, orange } from "@mui/material/colors";

export default function TrendingObservation({ chart, trends }) {
    const { series, categories } = chart;

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
                borderRadius: 0,
                columnWidth: "80%",
                dataLabels: {
                    position: "top",
                    total: {
                        style: {
                            fontSize: "9px",
                        },
                    },
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
        grid: {
            strokeDashArray: 0,
        },
        chart: {
            stacked: true,
            dropShadow: {
                enabled: true,
                blur: 1,
                opacity: 0.25,
            },
        },
    });

    return (
        <Chart type="bar" series={series} options={chartOptions} height={300} />
    );
}
