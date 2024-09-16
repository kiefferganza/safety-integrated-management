// @mui
import { Container } from "@mui/material";
// routes
import { PATH_DASHBOARD } from "@/routes/paths";
// components
import { useSettingsContext } from "@/Components/settings";
import CustomBreadcrumbs from "@/Components/custom-breadcrumbs";
// sections
import TrainingNewEditForm from "@/sections/@dashboard/training/form";
import { Head } from "@inertiajs/inertia-react";

// ----------------------------------------------------------------------

const TYPE_OPTIONS = {
    2: "client",
    3: "thirdParty",
    // 4: "induction"
};

export default function TrainingEditCreatePage({
    isEdit = false,
    details = null,
    title = "Client",
    currentTraining,
    type,
    projectDetails,
}) {
    const { themeStretch } = useSettingsContext();

    return (
        <>
            <Head>
                <title>
                    {isEdit ? "Update course" : `New ${title} Training`}
                </title>
            </Head>

            <Container maxWidth={themeStretch ? false : "lg"}>
                <CustomBreadcrumbs
                    heading={isEdit ? "Update course" : `New ${title} Training`}
                    links={[
                        {
                            name: "Dashboard",
                            href: PATH_DASHBOARD.root,
                        },
                        {
                            name: `${title} List`,
                            href:
                                isEdit && details
                                    ? PATH_DASHBOARD.training[details?.url]
                                    : type
                                    ? PATH_DASHBOARD.training[
                                          TYPE_OPTIONS[type]
                                      ]
                                    : PATH_DASHBOARD.training.client,
                        },
                        {
                            name: isEdit ? "Update course" : "New training",
                        },
                    ]}
                />

                <TrainingNewEditForm
                    isEdit={isEdit}
                    currentTraining={currentTraining}
                    projectDetails={projectDetails}
                />
            </Container>
        </>
    );
}
