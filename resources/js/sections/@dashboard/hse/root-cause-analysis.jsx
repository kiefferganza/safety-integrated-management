import Chart, { useChart } from "@/Components/chart";

export default function RootCauseAnalysis({ data }) {
    const categories = data?.categories || [];
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
        colors: ["#31869b"],
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
