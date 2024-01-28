import Chart, { useChart } from "@/Components/chart";
import { useTheme } from "@mui/material/styles";

export default function JobDescriptionGraph() {
    const theme = useTheme();
    const categories = [
        "Carpenter",
        "Labour",
        "Driver",
        "Welder",
        "Mechanic",
        "Painter",
        "HVAC",
        "Field Staff",
        "Engineer",
        "Equipment...",
        "Visitor",
        "Fitter",
        "Supervior",
    ];
    const chartOptions = useChart({
        colors: [],
        xaxis: {
            categories,
            labels: {
                style: {
                    fontSize: "0.5rem",
                },
            },
        },
        legend: {
            show: false,
        },
        plotOptions: {
            bar: {
                fillColor: "transparent",
                borderRadius: 0,
                horizontal: true,
                hideOverflowingLabels: false,
                barHeight: "60%",
                dataLabels: {
                    position: "start",
                },
                stroke: {
                    width: 0,
                },
            },
        },
        dataLabels: {
            enabled: true,
            offsetX: -30,
            offsetY: 0,
            style: {
                fontSize: "10px",
            },
            background: {
                enabled: true,
                foreColor: theme.palette.secondary.main,
                dropShadow: {
                    enabled: false,
                    top: 1,
                    left: 1,
                    blur: 1,
                    color: "#000",
                    opacity: 0.45,
                },
            },
        },
        grid: {
            strokeDashArray: 0,
        },
        fill: {
            colors: undefined,
            opacity: 0,
            borderRadius: 0,
        },
        colors: [theme.palette.secondary.main],
    });
    const series = [
        {
            data: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
    ];
    return (
        <Chart type="bar" series={series} options={chartOptions} height={280} />
    );
}
