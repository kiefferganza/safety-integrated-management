import Chart, { useChart } from "@/Components/chart";
import { useTheme } from "@mui/material/styles";

export default function MechanismOfInjury() {
    const theme = useTheme();
    const categories = [
        "Struct By...",
        "Struct Againts...",
        "Fall to lower level",
        "Fall to same level",
        "Caught In...",
        "Movement, Posture / Manual Handling",
        "Caught On (Snagged, hung)",
        "Caught Between Or Under...",
        "Contact With (particulate, electricity,...",
        "Overstress, Overexertion, Overload",
        "Slip / Trip / Fall at the same level",
        "Working at Heights",
        "Others",
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
        colors: [theme.palette.primary.main],
    });
    const series = [
        {
            data: [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0],
        },
    ];
    return (
        <Chart type="bar" series={series} options={chartOptions} height={280} />
    );
}
