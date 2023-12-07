import { Suspense, lazy } from "react";
import { Head } from "@inertiajs/inertia-react";
import LoadingScreen from "@/Components/loading-screen/LoadingScreen";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
const PPEReportListPage = lazy(() => import("./PPEReportListPage"));

const index = ({ inventoryReports, projectDetails, submittedDates }) => {
    return (
        <>
            <Head>
                <title> PPE: Report List</title>
            </Head>
            <Suspense fallback={<LoadingScreen />}>
                <DashboardLayout>
                    <PPEReportListPage
                        inventoryReports={inventoryReports}
                        projectDetails={projectDetails}
                        submittedDates={submittedDates}
                    />
                </DashboardLayout>
            </Suspense>
        </>
    );
};

export default index;
