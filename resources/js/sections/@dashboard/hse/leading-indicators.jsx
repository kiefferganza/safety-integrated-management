import Chart, { useChart } from "@/Components/chart";

export default function LeadingIndicators() {
    const categories = [
        "NEGA...",
        "SAFET...",
        "HSE...",
        "MGT...",
        "PERMI...",
        "TRAIN...",
        "DRILLS",
        "DICIPL...",
        "AUDIT",
    ];
    const chartOptions = useChart({
        xaxis: {
            categories,
            labels: {
                rotate: -50,
                style: {
                    fontSize: "10px",
                },
            },
        },
        legend: {
            position: "right",
            fontSize: "7px",
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
                dataLabels: {
                    hideOverflowingLabels: false,
                    position: "top",
                },
            },
        },
        dataLabels: {
            enabled: true,
            offsetX: 0,
            offsetY: -10,
            style: {
                fontSize: "6px",
            },
        },
        grid: {
            strokeDashArray: 0,
        },
    });
    const series = [
        {
            data: [270, 48, 522, 48, 120, 237, 6, 1, 6],
        },
    ];
    return (
        <Chart type="bar" series={series} options={chartOptions} height={280} />
    );
}
