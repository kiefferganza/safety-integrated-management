import Chart, { useChart } from "@/Components/chart";

export default function PotentialSeverity() {
    const categories = ["EXTERME 4", "HIGH 3", "MEDIUM 2", "LOW 1"];
    const chartOptions = useChart({
        xaxis: {
            categories,
        },
        plotOptions: {
            bar: {
                borderRadius: 0,
                horizontal: true,
                barHeight: "30%",
                hideOverflowingLabels: true,
                dataLabels: {
                    position: "start",
                },
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
            data: [0, 1, 0, 0],
        },
    ];
    return (
        <Chart type="bar" series={series} options={chartOptions} height={280} />
    );
}
