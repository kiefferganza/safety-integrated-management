import Chart, { useChart } from "@/Components/chart";

const YEAR = new Date().getFullYear().toString().substr(2);
export default function LtirTrir({ data }) {
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
                rotate: -50,
                style: {
                    fontSize: "0.5rem",
                },
            },
        },
        legend: {
            position: "bottom",
            horizontalAlign: "center",
            fontSize: "9px",
            markers: {
                radius: 0,
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
        stroke: {
            width: 3,
            curve: "straight",
        },
        grid: {
            strokeDashArray: 0,
        },
    });
    const series = data || [];
    return (
        <Chart
            type="line"
            series={series}
            options={chartOptions}
            height={280}
            width={"100%"}
        />
    );
}
