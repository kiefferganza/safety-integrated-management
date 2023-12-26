import { Suspense, lazy } from "react";
import LoadingScreen from "@/Components/loading-screen/LoadingScreen";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from "@inertiajs/inertia-react";
import { useSettingsContext } from "@/Components/settings";
import { PATH_DASHBOARD } from "@/routes/paths";
import { useQuery } from "@tanstack/react-query";
import { getExternalMatrix } from "@/utils/axios";
const CustomBreadcrumbs = lazy(() =>
    import("@/Components/custom-breadcrumbs/CustomBreadcrumbs")
);
const MatrixToolbar = lazy(() =>
    import("@/sections/@dashboard/training/details/matrix/MatrixToolbar")
);
const Container = lazy(() => import("@mui/material/Container"));
const TrainingMatrixPage = lazy(() =>
    import("../../Matrix/TrainingMatrixPage")
);

const index = ({ from, to, auth: { user } }) => {
    const { themeStretch } = useSettingsContext();
    const { data } = useQuery({
        queryKey: ["external-matrix", { sub: user.subscriber_id, from, to }],
        queryFn: () => getExternalMatrix({ from, to }),
    });

    return (
        <Suspense fallback={<LoadingScreen />}>
            <DashboardLayout>
                <Head>
                    <title>Training External Matrix</title>
                </Head>

                <Container maxWidth={themeStretch ? false : "lg"}>
                    <CustomBreadcrumbs
                        heading={"External Matrix"}
                        links={[
                            {
                                name: "Dashboard",
                                href: PATH_DASHBOARD.root,
                            },
                            {
                                name: "List",
                                href: PATH_DASHBOARD.training.inHouse,
                            },
                            {
                                name: "Training External Matrix",
                            },
                        ]}
                    />
                    <MatrixToolbar
                        titles={data?.titles || []}
                        years={data?.years || {}}
                        from={from}
                        to={to}
                    />
                    <TrainingMatrixPage
                        titles={data?.titles || []}
                        years={data?.years || {}}
                        yearList={data?.yearList || []}
                        from={from}
                        to={to}
                    />
                </Container>
            </DashboardLayout>
        </Suspense>
    );
};

export default index;
