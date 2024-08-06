import { useState } from "react";
// @mui
import {
    Container,
    Tab,
    Tabs,
    Box,
    Card,
    Stack,
    Typography,
} from "@mui/material";
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
    AccountGeneral,
    AccountSocialLinks,
    AccountNotifications,
    AccountChangePassword,
} from "@/sections/@dashboard/user/account";
import ProfileBilling from "@/sections/@dashboard/user/profile/ProfileBilling";
import { fDate } from "@/utils/formatTime";
import { UpgradeStorageIllustration } from "@/assets/illustrations";

// ----------------------------------------------------------------------

export default function UserAccountPage({ auth, subscription }) {
    const { user } = auth;
    const isAdmin = user?.user_type === 0;
    // const [hasPermission] = usePermission();
    const { themeStretch } = useSettingsContext();

    const [currentTab, setCurrentTab] = useState("general");

    const renderBilling =
        subscription?.status === "active" ? (
            <AlreadySubscribed
                nextInvoice={subscription?.nextInvoice ?? new Date()}
            />
        ) : isAdmin ? (
            !!subscription?.clientSecret ? (
                <ProfileBilling
                    user={user}
                    clientSecret={subscription.clientSecret}
                />
            ) : (
                <AlreadySubscribed
                    nextInvoice={subscription?.nextInvoice ?? new Date()}
                />
            )
        ) : null;

    const TABS = [
        {
            value: "general",
            label: "General",
            icon: <Iconify icon="ic:round-account-box" />,
            component: <AccountGeneral user={user} />,
        },
        {
            value: "billing",
            label: "Billing",
            icon: <Iconify icon="ic:round-receipt" />,
            component: (
                <Box display="flex" justifyContent="center">
                    <Box sx={{ maxWidth: "lg", width: 1 }}>{renderBilling}</Box>
                </Box>
            ),
            disabled: !isAdmin,
        },
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

function AlreadySubscribed({ nextInvoice }) {
    // const newCard = useBoolean();

    return (
        <>
            <Card>
                <Stack py={3} px={2}>
                    <Typography variant="h4" align="center">
                        You're currently subscribed to our PREMIUM PRO Plan.
                    </Typography>
                    <Typography variant="h4" align="center" sx={{ mb: 2 }}>
                        Your next payment of $630.00 will be charged on{" "}
                        {fDate(nextInvoice)}
                    </Typography>
                    <Box sx={{ mx: "auto", mt: 1.5 }}>
                        <UpgradeStorageIllustration
                            sx={{
                                width: 1,
                                height: 1,
                            }}
                        />
                    </Box>
                    {/* <Box sx={{ mx: "auto", mt: 1 }}>
                        <Button variant="contained" onClick={newCard.onTrue}>
                            Update Payment Method
                        </Button>
                    </Box> */}
                </Stack>
            </Card>
            {/* <UpdatePaymentMethod
                open={newCard.value}
                onClose={newCard.onFalse}
            /> */}
        </>
    );
}

// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
// function UpdatePaymentMethod({ paymentMethodId, onClose, ...other }) {
//     return (
//         <>
//             <Dialog maxWidth="sm" fullWidth onClose={onClose} {...other}>
//                 <DialogTitle>New Card</DialogTitle>

//                 <DialogContent sx={{ overflow: "unset" }}>
//                     <Elements stripe={stripePromise}>
//                         <CardElement />
//                     </Elements>
//                 </DialogContent>

//                 <DialogActions>
//                     <Button
//                         color="inherit"
//                         variant="outlined"
//                         onClick={onClose}
//                     >
//                         Cancel
//                     </Button>

//                     <Button variant="contained" onClick={onClose}>
//                         Update
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//         </>
//     );
// }
