import Chart, { useChart } from "@/Components/chart";

export default function IncidentPerLocation() {
    const categories = [
        "Ratqa",
        "Janubia",
        "Markaziya",
        "Shamiya",
        "Mushrif Shamiya",
        "Qurainat",
        "Mushrif Qurainat",
        "SIDS",
        "NIDS",
        "DS5",
        "DS4",
        "DS3",
        "DS2",
        "DS1",
    ];
    const chartOptions = useChart({
        xaxis: {
            categories,
            labels: {
                rotate: -50,
                style: {
                    fontSize: "0.7rem",
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
            enabledOnSeries: [0, 1, 2, 3, 4],
            style: {
                fontSize: "9px",
            },
        },
        grid: {
            strokeDashArray: 0,
        },
    });
    const series = [
        {
            name: "FAT",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            name: "LTC",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            name: "RWC",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            name: "MTC",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
        },
        {
            name: "FAC",
            data: [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
    ];
    return (
        <Chart type="bar" series={series} options={chartOptions} height={280} />
    );
}
