import CustomBreadcrumbs from "@/Components/custom-breadcrumbs";
import { useSettingsContext } from "@/Components/settings";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { PATH_DASHBOARD } from "@/routes/paths";
// import InspectionNewForm from "@/sections/@dashboard/inspection/form/InspectionNewForm";
import { fetchAssignedInspectionTracker } from "@/utils/axios";
import { Head } from "@inertiajs/inertia-react";
import { Container } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import InspectionNewEditForm from "./InspectionNewEditForm";

const index = ({ projectDetails, auth: { user } }) => {
    const { themeStretch } = useSettingsContext();
    const { isLoading, data } = useQuery({
        queryKey: ["inspection.traker.assigned", user.subscriber_id],
        queryFn: fetchAssignedInspectionTracker,
        refetchOnWindowFocus: false,
    });

    return (
        <>
            <Head>
                <title>Inspection Form</title>
            </Head>
            <DashboardLayout>
                <Container maxWidth={themeStretch ? false : "lg"}>
                    <CustomBreadcrumbs
                        heading={"Inspection Form"}
                        links={[
                            {
                                name: "Dashboard",
                                href: PATH_DASHBOARD.root,
                            },
                            {
                                name: "Inpections",
                                href: PATH_DASHBOARD.inspection.list,
                            },
                            {
                                name: "New Inspection",
                            },
                        ]}
                    />
                    <InspectionNewEditForm
                        projectDetails={projectDetails}
                        loading={isLoading}
                        tracker={data ?? []}
                    />
                </Container>
            </DashboardLayout>
        </>
    );
};

export default index;
