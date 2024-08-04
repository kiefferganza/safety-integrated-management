import { useState } from "react";
// @mui
import {
    Tab,
    Card,
    Tabs,
    Container,
    Box,
    Backdrop,
    CircularProgress,
    Typography,
    Stack,
    // Button,
    // Dialog,
    // DialogTitle,
    // DialogContent,
    // DialogActions,
} from "@mui/material";
// routes
import { PATH_DASHBOARD } from "@/routes/paths";
// _mock_
import {
    _userAbout,
    _userFeeds,
    _userFriends,
    _userGallery,
    _userFollowers,
} from "@/_mock/arrays";
// components
import Iconify from "@/Components/iconify";
import CustomBreadcrumbs from "@/Components/custom-breadcrumbs";
import { useSettingsContext } from "@/Components/settings";
// sections
import {
    Profile,
    ProfileCover,
    // ProfileFriends,
    ProfileGallery,
    // ProfileFollowers,
    EmployeeTrainings,
} from "@/sections/@dashboard/user/profile";
import { getCurrentUserName } from "@/utils/formatName";
import ProfileBilling from "@/sections/@dashboard/user/profile/ProfileBilling";
import { fDate } from "@/utils/formatTime";
import Label from "@/Components/label";
import { UpgradeStorageIllustration } from "@/assets/illustrations";
// import useBoolean from "@/hooks/useBoolean";
// import { CardElement, Elements } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";

// ----------------------------------------------------------------------

export default function UserProfilePage({ user, employee, subscription }) {
    const isAdmin = user?.user_type === 0;
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const { themeStretch } = useSettingsContext();

    // const [searchFriends, setSearchFriends] = useState('');

    const [currentTab, setCurrentTab] = useState("profile");

    const renderBilling = isAdmin ? (
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
            value: "profile",
            label: "Profile",
            icon: <Iconify icon="ic:round-account-box" />,
            component: (
                <Profile
                    socialAccounts={user?.social_accounts || []}
                    user={user}
                    employee={employee}
                />
            ),
        },
        {
            value: "trainings",
            label: "Trainings",
            icon: <Iconify icon="mingcute:certificate-2-fill" />,
            component: (
                <EmployeeTrainings
                    trainings={employee?.participated_trainings || []}
                />
            ),
        },
        // {
        // 	value: 'followers',
        // 	label: 'Followers',
        // 	icon: <Iconify icon="eva:heart-fill" />,
        // 	component: <ProfileFollowers followers={_userFollowers} />,
        // },
        // {
        // 	value: 'friends',
        // 	label: 'Friends',
        // 	icon: <Iconify icon="eva:people-fill" />,
        // 	component: (
        // 		<ProfileFriends
        // 			friends={_userFriends}
        // 			searchFriends={searchFriends}
        // 			onSearchFriends={(event) => setSearchFriends(event.target.value)}
        // 		/>
        // 	),
        // },
        {
            value: "gallery",
            label: "Gallery",
            icon: <Iconify icon="ic:round-perm-media" />,
            component: <ProfileGallery isCurrentProfile user={user} />,
        },
        {
            value: "billing",
            label: "Billing",
            icon: <Iconify icon="ic:round-receipt" />,
            component: renderBilling,
            disabled: !isAdmin,
        },
    ];

    return (
        <>
            <Container maxWidth={themeStretch ? false : "lg"}>
                <Stack flexDirection="row" justifyContent="space-between">
                    <CustomBreadcrumbs
                        heading="Profile"
                        links={[
                            { name: "Dashboard", href: PATH_DASHBOARD.root },
                            { name: "User", href: PATH_DASHBOARD.user.root },
                            { name: getCurrentUserName(user) },
                        ]}
                    />
                    <Label color="error">PREMIUM PRO</Label>
                </Stack>
                <Card
                    sx={{
                        mb: 3,
                        height: 280,
                        position: "relative",
                    }}
                >
                    <ProfileCover
                        isCurrentProfile
                        setOpenBackdrop={setOpenBackdrop}
                        user={user}
                        name={getCurrentUserName(user)}
                        role={user?.employee?.position}
                    />

                    <Tabs
                        value={currentTab}
                        onChange={(event, newValue) => setCurrentTab(newValue)}
                        sx={{
                            width: 1,
                            bottom: 0,
                            zIndex: 9,
                            position: "absolute",
                            bgcolor: "background.paper",
                            "& .MuiTabs-flexContainer": {
                                pr: { md: 3 },
                                justifyContent: {
                                    sm: "center",
                                    md: "flex-end",
                                },
                            },
                        }}
                    >
                        {TABS.map((tab) => (
                            <Tab
                                key={tab.value}
                                value={tab.value}
                                icon={tab.icon}
                                label={tab.label}
                                disabled={tab?.disabled}
                            />
                        ))}
                    </Tabs>
                </Card>

                {TABS.map(
                    (tab) =>
                        tab.value === currentTab && (
                            <Box key={tab.value}> {tab.component} </Box>
                        )
                )}
            </Container>
            <Backdrop open={openBackdrop}>
                <CircularProgress />
            </Backdrop>
        </>
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
