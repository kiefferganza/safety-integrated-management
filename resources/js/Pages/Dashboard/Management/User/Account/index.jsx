import { lazy, Suspense } from "react";
import LoadingScreen from "@/Components/loading-screen/LoadingScreen";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from "@inertiajs/inertia-react";
const UserAccountPage = lazy(() => import("./UserAccountPage"));

const index = ({ auth, subscription }) => {
    console.log(subscription?.status);

    return (
        <>
            <Head>
                <title>Setting</title>
            </Head>
            <Suspense fallback={<LoadingScreen />}>
                <DashboardLayout>
                    <UserAccountPage auth={auth} subscription={subscription} />
                </DashboardLayout>
            </Suspense>
        </>
    );
};

export default index;
