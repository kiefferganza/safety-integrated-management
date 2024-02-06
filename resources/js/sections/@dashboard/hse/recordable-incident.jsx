import Chart, { useChart } from "@/Components/chart";
export default function RecordableIncident({ data }) {
    const categories = data?.categories || [];
    const chartOptions = useChart({
        labels: categories,
        // labels: [],
        dataLabels: {
            enabled: false,
            formatter: function (val) {
                return val;
            },
        },
        legend: {
            position: "right",
            // show: false,
            fontSize: "9px",
            markers: {
                radius: 0,
            },
        },
        tooltip: {
            followCursor: false,
            hideEmptySeries: false,
        },
        plotOptions: {
            pie: {
                customScale: 1,
                offsetX: 0,
                offsetY: 0,
                donut: {
                    labels: {
                        name: {
                            show: false,
                        },
                        total: {
                            show: false,
                        },
                        value: {
                            show: false,
                        },
                    },
                },
            },
        },
    });
    const series = data?.data || [1];
    return (
        <Chart
            type="donut"
            series={series}
            options={chartOptions}
            height={300}
        />
    );
}
