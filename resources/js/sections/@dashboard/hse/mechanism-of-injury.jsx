import Chart, { useChart } from "@/Components/chart";
import { useTheme } from "@mui/material/styles";

export default function MechanismOfInjury({ data }) {
    const theme = useTheme();
    const categories = data?.categories || [];
    const chartOptions = useChart({
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
                foreColor: theme.palette.primary.main,
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
        colors: ["#ffc000"],
    });
    const series = [
        {
            data: data?.data || [],
        },
    ];
    return (
        <Chart type="bar" series={series} options={chartOptions} height={280} />
    );
}
