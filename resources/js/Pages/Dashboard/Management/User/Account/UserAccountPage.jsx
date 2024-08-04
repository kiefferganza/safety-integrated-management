import { useState } from "react";
// @mui
import { Container, Tab, Tabs, Box } from "@mui/material";
// routes
import { PATH_DASHBOARD } from "@/routes/paths";
// _mock_
import { _userPayment, _userAddressBook, _userInvoices } from "@/_mock/arrays";
// components
import Iconify from "@/Components/iconify";
import CustomBreadcrumbs from "@/Components/custom-breadcrumbs";
import { useSettingsContext } from "@/Components/settings";
// sections
import {
    AccountBilling,
    AccountGeneral,
    AccountSocialLinks,
    AccountNotifications,
    AccountChangePassword,
    AccountPublicImages,
} from "@/sections/@dashboard/user/account";
import usePermission from "@/hooks/usePermission";

// ----------------------------------------------------------------------

export default function UserAccountPage({ auth, images }) {
    const { user } = auth;
    const [hasPermission] = usePermission();
    const { themeStretch } = useSettingsContext();

    const [currentTab, setCurrentTab] = useState("general");

    const TABS = [
        {
            value: "general",
            label: "General",
            icon: <Iconify icon="ic:round-account-box" />,
            component: <AccountGeneral user={user} />,
        },
        // {
        //     value: "billing",
        //     label: "Billing",
        //     icon: <Iconify icon="ic:round-receipt" />,
        //     // component: (
        //     //     <AccountBilling
        //     //         cards={_userPayment}
        //     //         addressBook={_userAddressBook}
        //     //         invoices={_userInvoices}
        //     //     />
        //     // ),
        //     component: null,
        //     disabled: true,
        // },
        {
            value: "notifications",
            label: "Notifications",
            icon: <Iconify icon="eva:bell-fill" />,
            component: <AccountNotifications />,
            disabled: true,
        },
        {
            value: "social_links",
            label: "Social links",
            icon: <Iconify icon="eva:share-fill" />,
            component: <AccountSocialLinks user={user} />,
        },
        {
            value: "change_password",
            label: "Change password",
            icon: <Iconify icon="ic:round-vpn-key" />,
            component: <AccountChangePassword />,
        },
    ];

    // const canUpload = hasPermission("image_upload_slider");
    // if (canUpload) {
    //     TABS.push({
    //         value: "images",
    //         label: "Images",
    //         icon: <Iconify icon="material-symbols:image" />,
    //         component: <AccountPublicImages user={user} images={images} />,
    //     });
    // }

    return (
        <Container maxWidth={themeStretch ? false : "lg"}>
            <CustomBreadcrumbs
                heading="Account"
                links={[
                    { name: "Dashboard", href: PATH_DASHBOARD.root },
                    { name: "User", href: PATH_DASHBOARD.user.root },
                    { name: "Account Settings" },
                ]}
            />

            <Tabs
                value={currentTab}
                onChange={(_event, newValue) => setCurrentTab(newValue)}
            >
                {TABS.map((tab) => (
                    <Tab
                        disabled={tab.disabled}
                        key={tab.value}
                        label={tab.label}
                        icon={tab.icon}
                        value={tab.value}
                    />
                ))}
            </Tabs>

            {TABS.map(
                (tab) =>
                    tab.value === currentTab && (
                        <Box key={tab.value} sx={{ mt: 5 }}>
                            {tab.component}
                        </Box>
                    )
            )}
        </Container>
    );
}
