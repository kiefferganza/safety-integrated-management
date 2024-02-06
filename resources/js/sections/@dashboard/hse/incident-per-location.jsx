import Chart, { useChart } from "@/Components/chart";

export default function IncidentPerLocation({ data }) {
    const categories = data?.categories || [];
    const chartOptions = useChart({
        xaxis: {
            categories,
            labels: {
                rotate: -50,
                style: {
                    fontSize: "7px",
                },
            },
        },
        legend: {
            position: "right",
            fontSize: "9px",
            markers: {
                radius: 0,
            },
            itemMargin: {
                horizontal: 0,
                vertical: 0,
            },
        },
        chart: {
            stacked: true,
        },
        plotOptions: {
            bar: {
                borderRadius: 0,
                hideZeroBarsWhenGrouped: true,
            },
        },
        dataLabels: {
            enabled: true,
            offsetX: 0,
            offsetY: 10,
            distributed: true,
            enabledOnSeries: [0, 1, 2, 3, 4],
            style: {
                fontSize: "9px",
            },
        },
        grid: {
            strokeDashArray: 0,
        },
        colors: ["#000000", "#d81c0e", "#953735", "#e46c0a", "#77933c"],
    });
    const series = data?.data || [];
    return (
        <Chart type="bar" series={series} options={chartOptions} height={280} />
    );
}
