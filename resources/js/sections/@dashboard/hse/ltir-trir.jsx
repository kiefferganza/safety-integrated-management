import Chart, { useChart } from "@/Components/chart";

export default function LtirTrir() {
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
    const series = [
        {
            name: "Manpower",
            type: "line",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            name: "LTIR",
            type: "column",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            name: "TRIR",
            type: "column",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
    ];
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
