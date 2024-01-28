import Chart, { useChart } from "@/Components/chart";

export default function IncidentPerMonth() {
    const categories = [
        "JAN-23",
        "FEB-23",
        "MAR-23",
        "APR-23",
        "MAY-23",
        "JUN-23",
        "JUL-23",
        "AUG-23",
        "SEP-23",
        "OCT-23",
        "NOV-23",
        "DEC-23",
    ];
    const chartOptions = useChart({
        xaxis: {
            categories,
            labels: {
                rotate: -45,
                style: {
                    fontSize: "0.5rem",
                },
            },
        },
        legend: {
            position: "top",
            horizontalAlign: "center",
            fontSize: "9px",
            markers: {
                radius: 0,
            },
            itemMargin: {
                horizontal: 6,
                vertical: 0,
            },
        },
        chart: {
            stacked: true,
        },
        plotOptions: {
            bar: {
                borderRadius: 0,
            },
        },
        dataLabels: {
            enabled: true,
            offsetY: 0,
            offsetX: 0,
            enabledOnSeries: [0, 1, 2, 3, 4],
            style: {
                fontSize: "9px", // Customize the font size of data labels
            },
            value: true,
        },
        grid: {
            strokeDashArray: 0,
        },
    });
    const series = [
        {
            name: "FAT",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            name: "LTC",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            name: "MTC",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
        },
        {
            name: "FAC",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            name: "NM",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
        },
    ];
    return (
        <Chart type="bar" series={series} options={chartOptions} height={280} />
    );
}
