import Chart, { useChart } from "@/Components/chart";

export default function IncidentClassification({ data }) {
    const categories = data?.categories || [];
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
            offsetY: 0,
            offsetX: 0,
            style: {
                fontSize: "9px", // Customize the font size of data labels
            },
            value: true, // Display data labels for 0 values
        },
        colors: ["#31869b"],
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
