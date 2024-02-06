import Chart, { useChart } from "@/Components/chart";
const YEAR = new Date().getFullYear().toString().substr(2);
export default function IncidentPerMonth({ data }) {
    const categories = [
        "JAN-" + YEAR,
        "FEB-" + YEAR,
        "MAR-" + YEAR,
        "APR-" + YEAR,
        "MAY-" + YEAR,
        "JUN-" + YEAR,
        "JUL-" + YEAR,
        "AUG-" + YEAR,
        "SEP-" + YEAR,
        "OCT-" + YEAR,
        "NOV-" + YEAR,
        "DEC-" + YEAR,
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
            distributed: true,
            enabledOnSeries: [0, 1, 2, 3, 4],
            style: {
                fontSize: "9px", // Customize the font size of data labels
            },
            value: true,
        },
        grid: {
            strokeDashArray: 0,
        },
        colors: [
            "#000000",
            "#d81c0e",
            "#953735",
            "#e46c0a",
            "#77933c",
            "#31869b",
        ],
    });
    const series = data || [];
    return (
        <Chart type="bar" series={series} options={chartOptions} height={280} />
    );
}
