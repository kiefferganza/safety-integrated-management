import { Head } from "@inertiajs/inertia-react";
// @mui
import { Container } from "@mui/material";
// routes
import { PATH_DASHBOARD } from "@/routes/paths";
// components
import { useSettingsContext } from "@/Components/settings";
import CustomBreadcrumbs from "@/Components/custom-breadcrumbs";
// sections
import InHouseNewEditForm from "@/sections/@dashboard/training/form/in-house/InHouseNewEditForm";

// ----------------------------------------------------------------------

export default function EditCreatePage({
    isEdit = false,
    details = null,
    currentTraining,
    projectDetails,
}) {
    const { themeStretch } = useSettingsContext();
    console.log(details);

    return (
        <>
            <Head>
                <title>
                    {isEdit
                        ? "Update In House course"
                        : "New In House training"}
                </title>
            </Head>

            <Container maxWidth={themeStretch ? false : "lg"}>
                <CustomBreadcrumbs
                    heading={isEdit ? "Update course" : "New In House training"}
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
                            name: isEdit ? "Update course" : "New training",
                        },
                    ]}
                />

                <InHouseNewEditForm
                    isEdit={isEdit}
                    currentTraining={currentTraining}
                    projectDetails={projectDetails}
                />
            </Container>
        </>
    );
}
