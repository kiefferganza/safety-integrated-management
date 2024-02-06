import Chart, { useChart } from "@/Components/chart";

export default function PotentialSeverity({ data }) {
    // const categories = ["EXTERME 4", "HIGH 3", "MEDIUM 2", "LOW 1"];
    const categories = data?.categories || [];
    const chartOptions = useChart({
        xaxis: {
            categories,
        },
        legend: {
            show: false,
        },
        plotOptions: {
            bar: {
                borderRadius: 0,
                horizontal: true,
                barHeight: "30%",
                hideOverflowingLabels: true,
                distributed: true,
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
                fontSize: "9px",
                colors: ["#000"],
            },
        },
        grid: {
            strokeDashArray: 0,
        },
        colors: ["#ff0000", "#ffc000", "#ffff00", "#00b050"],
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
