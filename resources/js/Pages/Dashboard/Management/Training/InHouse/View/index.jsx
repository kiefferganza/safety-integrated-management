import { Suspense, useEffect, useState, lazy } from "react";
import Container from "@mui/material/Container";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
// components
import { useSettingsContext } from "@/Components/settings";
import CustomBreadcrumbs from "@/Components/custom-breadcrumbs";
// sections
const TrainingDetails = lazy(() =>
    import("@/sections/@dashboard/training/details/in-house/InHouseDetail")
);
import { Head } from "@inertiajs/inertia-react";
import { PATH_DASHBOARD } from "@/routes/paths";
import LoadingScreen from "@/Components/loading-screen/LoadingScreen";

const index = ({ training, rolloutDate }) => {
    const { themeStretch } = useSettingsContext();
    const [trainingData, setTrainingData] = useState({});

    const joinTrainees = () => {
        const newTrainees = training.trainees.map((tr) => {
            return {
                ...tr,
                emp_id: tr.employee_id,
                fullname: `${tr.firstname} ${tr.lastname}`,
                position: tr?.position?.position,
            };
        });
        return newTrainees;
    };

    useEffect(() => {
        if (training) {
            setTrainingData({
                ...training,
                id: training.training_id,
                cms: training?.project_code
                    ? `${training?.project_code}-${training?.originator}-${
                          training?.discipline
                      }-${training?.document_type}-${
                          training?.document_zone
                              ? training?.document_zone + "-"
                              : ""
                      }${
                          training?.document_level
                              ? training?.document_level + "-"
                              : ""
                      }${training?.sequence_no}`
                    : null,
                trainees: joinTrainees()
            });
        }
    }, []);

    return (
        <>
            <Head>
                <title>In House</title>
            </Head>
            <Suspense fallback={<LoadingScreen />}>
                <DashboardLayout>
                    <Container maxWidth={themeStretch ? false : "lg"}>
                        <CustomBreadcrumbs
                            heading="Course Details"
                            links={[
                                {
                                    name: "Dashboard",
                                    href: PATH_DASHBOARD.root,
                                },
                                {
                                    name: "New Training",
                                    href: PATH_DASHBOARD.training.newInHouse,
                                },
                                {
                                    name: `In House List`,
                                    href: PATH_DASHBOARD.training.inHouse,
                                },
                                { name: training.csm },
                            ]}
                        />

                        <TrainingDetails training={trainingData} rolloutDate={rolloutDate} />
                    </Container>
                </DashboardLayout>
            </Suspense>
        </>
    );
};

export default index;
