import Chart, { useChart } from "@/Components/chart";
export default function RecordableIncident() {
    const categories = ["FAT", "LTC", "RWC", "MTC", "FAC"];
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
                customScale: 0.8,
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
                        // value: {
                        //     show: false,
                        // },
                    },
                },
            },
        },
    });
    const series = [1];
    // const series = [0];
    return (
        <Chart
            type="donut"
            series={series}
            options={chartOptions}
            height={300}
        />
    );
}
