import Chart, { useChart } from "@/Components/chart";

export default function IncidentClassification() {
    const categories = [
        "FAT",
        "LTC",
        "RWC",
        "MTC",
        "FAC",
        "NM",
        "PD",
        "TRAF",
        "FIRE",
        "ENV",
    ];
    const chartOptions = useChart({
        xaxis: {
            categories,
            labels: {
                style: {
                    fontSize: "0.7rem",
                },
            },
        },
        plotOptions: {
            bar: {
                borderRadius: 0,
                dataLabels: {
                    hideOverflowingLabels: false,
                    position: "top",
                    total: {
                        enabled: true,
                    },
                },
                rangeBarOverlap: false,
            },
        },
        grid: {
            strokeDashArray: 0,
        },
        dataLabels: {
            enabled: true,
            offsetY: -10,
            offsetX: 0,
            style: {
                fontSize: "9px", // Customize the font size of data labels
            },
            value: true, // Display data labels for 0 values
        },
    });
    const series = [
        {
            name: "Net Profit",
            data: [0, 0, 0, 1, 0, 1, 0, 0, 0, 0],
        },
    ];
    return (
        <Chart type="bar" series={series} options={chartOptions} height={280} />
    );
}
