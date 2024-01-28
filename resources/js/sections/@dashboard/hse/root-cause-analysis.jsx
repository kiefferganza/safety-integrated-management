import Chart, { useChart } from "@/Components/chart";

export default function RootCauseAnalysis() {
    const categories = [
        "Other",
        "Organizational",
        "Workplace Hazards",
        "Integrity of tools...",
        "Protective Systems",
        "Inattention / Lack of...",
        "Use of Protective Methods",
        "Use of Tools,Equipment,...",
        "Not following Procedures",
    ];
    const chartOptions = useChart({
        xaxis: {
            categories,
            labels: {
                rotate: -50,
                style: {
                    fontSize: "0.5rem",
                },
            },
        },
        plotOptions: {
            bar: {
                borderRadius: 0,
                horizontal: true,
            },
        },
        dataLabels: {
            enabled: true,
            offsetX: 0,
            offsetY: 0,
            style: {
                fontSize: "10px",
            },
        },
        grid: {
            strokeDashArray: 0,
        },
    });
    const series = [
        {
            data: [0, 0, 1, 0, 0, 0, 0, 0, 1],
        },
    ];
    return (
        <Chart type="bar" series={series} options={chartOptions} height={280} />
    );
}
