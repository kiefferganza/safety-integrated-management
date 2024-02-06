import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
// @mui
import {
    Box,
    Stack,
    Dialog,
    Tooltip,
    IconButton,
    DialogActions,
    CircularProgress,
} from "@mui/material";
// components
import Iconify from "@/Components/iconify";
//
import TrainingPDF from "./TrainingPDF";
import { Link } from "@inertiajs/inertia-react";
import Chart, { useChart } from "@/Components/chart";
import ApexCharts from "apexcharts";
import Image from "@/Components/image/Image";

// ----------------------------------------------------------------------

TrainingToolbar.propTypes = {
    training: PropTypes.object,
    module: PropTypes.string,
};

export default function TrainingToolbar({
    training,
    module = "In House",
    rolloutDate,
}) {
    const [open, setOpen] = useState(false);
    // const [chartImg, setChartImg] = useState(null);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // const chartOptions = useChart({
    // 	plotOptions: {
    // 		bar: {
    // 			columnWidth: '80%',
    // 			dataLabels: {
    // 				position: 'top'
    // 			},
    // 		},
    // 	},
    // 	dataLabels: {
    // 		enabled: true,
    // 		// dropShadow: {
    // 		// 	enabled: true,
    // 		// 	blur: 1,
    // 		// 	opacity: 0.25,
    // 		// },
    // 		offsetY: 0,
    // 		offsetX: 0,
    // 		style: {
    // 			fontSize: '9px', // Customize the font size of data labels
    // 		},
    // 		value: true, // Display data labels for 0 values
    // 	},
    // 	xaxis: {
    // 		categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
    // 		labels: {
    // 			trim: true, // Enable label trimming
    // 			maxWidth: 16, // Set the maximum width for labels
    // 			maxHeight: 95,
    // 			show: true,
    // 			rotate: -75,
    // 			style: {
    // 				fontSize: '10px',
    // 			},
    // 			formatter: function (val) {
    // 				return val;
    // 			},
    // 		},
    // 	},
    // 	legend: {
    // 		showForZeroSeries: true
    // 	},
    // 	chart: {
    //   id: "basic-chart",
    //   events: {
    //     updated: async function(ctx) {
    //       const uri = await ctx?.dataURI();
    //       setChartImg(uri.imgURI);
    //     }
    //   }
    // 	},
    // });

    return (
        <>
            {/* <Image src={chartImg} />
          <Chart
            type="bar"
            series={[{
              name: 'series-1',
              data: [30, 40, 35, 50, 49, 60, 70, 91, 125]
            }]}
            options={chartOptions}
          /> */}
            <Stack
                spacing={2}
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ sm: "center" }}
                sx={{ mb: 5 }}
            >
                <Stack direction="row" spacing={1}>
                    <Tooltip title="Edit">
                        <IconButton
                            LinkComponent={Link}
                            href={route(
                                "training.management.in_house_edit",
                                training.training_id
                            )}
                        >
                            <Iconify icon="eva:edit-fill" />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="View">
                        <IconButton onClick={handleOpen}>
                            <Iconify icon="eva:eye-fill" />
                        </IconButton>
                    </Tooltip>

                    <PDFDownloadLink
                        document={
                            <TrainingPDF
                                training={training}
                                module={module}
                                rolloutDate={rolloutDate}
                            />
                        }
                        fileName={training?.cms || module || "training"}
                        style={{ textDecoration: "none" }}
                    >
                        {({ loading }) => (
                            <Tooltip title="Download">
                                <IconButton>
                                    {loading ? (
                                        <CircularProgress
                                            size={24}
                                            color="inherit"
                                        />
                                    ) : (
                                        <Iconify icon="eva:download-fill" />
                                    )}
                                </IconButton>
                            </Tooltip>
                        )}
                    </PDFDownloadLink>

                    <Tooltip title="Print">
                        <IconButton onClick={handleOpen}>
                            <Iconify icon="eva:printer-fill" />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Send">
                        <IconButton>
                            <Iconify icon="ic:round-send" />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Share">
                        <IconButton>
                            <Iconify icon="eva:share-fill" />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Stack>

            <Dialog fullScreen open={open}>
                <Box
                    sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <DialogActions
                        sx={{
                            zIndex: 9,
                            padding: "12px !important",
                            boxShadow: (theme) => theme.customShadows.z8,
                        }}
                    >
                        <Tooltip title="Close">
                            <IconButton color="inherit" onClick={handleClose}>
                                <Iconify icon="eva:close-fill" />
                            </IconButton>
                        </Tooltip>
                    </DialogActions>

                    <Box
                        sx={{ flexGrow: 1, height: "100%", overflow: "hidden" }}
                    >
                        <PDFViewer
                            width="100%"
                            height="100%"
                            style={{ border: "none" }}
                        >
                            <TrainingPDF
                                training={training}
                                module={module}
                                rolloutDate={rolloutDate}
                            />
                        </PDFViewer>
                        {/* {chartImg && (
                          <PDFViewer
                              width="100%"
                              height="100%"
                              style={{ border: "none" }}
                          >
                              <TrainingPDF chartImage={chartImg} training={training} module={module} rolloutDate={rolloutDate} />
                          </PDFViewer>
                        )} */}
                    </Box>
                </Box>
            </Dialog>
        </>
    );
}
