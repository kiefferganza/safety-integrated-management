import { m } from "framer-motion";
import { useState, useCallback } from "react";

import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import List from "@mui/material/List";
import Stack from "@mui/material/Stack";
import Badge from "@mui/material/Badge";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import useBoolean from "@/hooks/useBoolean";
import useResponsive from "@/hooks/useResponsive";

// _mock_
import { _notifications } from "@/_mock/arrays";

import Label from "@/Components/label";
import Iconify from "@/Components/iconify";
import Scrollbar from "@/Components/scrollbar";
import { varHover } from "@/Components/animate";

import NotificationItem from "./notification-item";
import { getNotifications, readNotification } from "@/utils/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function NotificationsPopover() {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (ids) => readNotification(ids),
        onMutate: async (vars) => {
            await queryClient.cancelQueries(["notifications"]);
            const prevData = queryClient.getQueryData(["notifications"]);
            queryClient.setQueryData(["notifications"], (data) => {
                const updatedData = (prevData?.notifications || []).map(
                    (notif) => {
                        if (vars.includes(notif.id)) {
                            return {
                                ...notif,
                                read_at: new Date().toLocaleString(),
                            };
                        }
                        return notif;
                    }
                );
                return { success: data.success, notifications: updatedData };
            });
            return { prevData };
        },
        onError: (_e, _v, context) => {
            queryClient.setQueryData(["notifications"], context.prevData);
        },
        onSettled: () => {
            queryClient.invalidateQueries(["notifications"]);
        },
    });

    const { data, isLoading, isError } = useQuery({
        queryKey: ["notifications"],
        queryFn: getNotifications,
        refetchOnWindowFocus: false,
    });

    const drawer = useBoolean();

    const smUp = useResponsive("up", "sm");

    const [currentTab, setCurrentTab] = useState("all");

    const handleChangeTab = useCallback((_event, newValue) => {
        setCurrentTab(newValue);
    }, []);

    const notifications = data?.notifications || [];
    const totalUnRead =
        notifications?.filter((item) => item.read_at === null)?.length || 0;

    const TABS = [
        {
            value: "all",
            label: "All",
            count: notifications.length,
        },
        {
            value: "unread",
            label: "Unread",
            count: totalUnRead,
        },
    ];

    const handleMarkAllAsRead = () => {
        const ids = notifications
            .filter((notif) => notif?.read_at === null)
            .map((notif) => notif.id);
        mutation.mutate(ids);
    };

    if (isLoading || isError) {
        return (
            <IconButton
                component={m.button}
                whileTap="tap"
                whileHover="hover"
                variants={varHover(1.05)}
                color="default"
            >
                <Iconify icon="solar:bell-bing-bold-duotone" width={24} />
            </IconButton>
        );
    }

    const renderHead = (
        <Stack
            direction="row"
            alignItems="center"
            sx={{ py: 2, pl: 2.5, pr: 1, minHeight: 68 }}
        >
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Notifications
            </Typography>

            {!!totalUnRead && (
                <Tooltip title="Mark all as read">
                    <IconButton color="primary" onClick={handleMarkAllAsRead}>
                        <Iconify icon="eva:done-all-fill" />
                    </IconButton>
                </Tooltip>
            )}

            {!smUp && (
                <IconButton onClick={drawer.onFalse}>
                    <Iconify icon="mingcute:close-line" />
                </IconButton>
            )}
        </Stack>
    );

    const renderTabs = (
        <Tabs value={currentTab} onChange={handleChangeTab}>
            {TABS.map((tab) => (
                <Tab
                    key={tab.value}
                    iconPosition="end"
                    value={tab.value}
                    label={tab.label}
                    icon={
                        <Label
                            variant={
                                ((tab.value === "all" ||
                                    tab.value === currentTab) &&
                                    "filled") ||
                                "soft"
                            }
                            color={
                                (tab.value === "unread" && "info") ||
                                // (tab.value === 'archived' && 'success') ||
                                "default"
                            }
                        >
                            {tab.count}
                        </Label>
                    }
                    sx={{
                        "&:not(:last-of-type)": {
                            mr: 3,
                        },
                    }}
                />
            ))}
        </Tabs>
    );

    const renderList = (
        <Scrollbar>
            <List disablePadding>
                {currentTab === "all"
                    ? notifications.map((notification) => (
                          <NotificationItem
                              key={notification.id}
                              notification={notification}
                              mutation={mutation}
                          />
                      ))
                    : notifications
                          ?.filter((item) => item.read_at === null)
                          .map((notification) => (
                              <NotificationItem
                                  key={notification.id}
                                  notification={notification}
                                  mutation={mutation}
                              />
                          ))}
            </List>
        </Scrollbar>
    );

    return (
        <>
            <IconButton
                component={m.button}
                whileTap="tap"
                whileHover="hover"
                variants={varHover(1.05)}
                color={drawer.value ? "primary" : "default"}
                onClick={drawer.onTrue}
            >
                <Badge badgeContent={totalUnRead} color="error">
                    <Iconify icon="solar:bell-bing-bold-duotone" width={24} />
                </Badge>
            </IconButton>

            <Drawer
                open={drawer.value}
                onClose={drawer.onFalse}
                anchor="right"
                slotProps={{
                    backdrop: { invisible: true },
                }}
                PaperProps={{
                    sx: { width: 1, maxWidth: 420 },
                }}
            >
                {renderHead}

                <Divider />

                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ pl: 2.5, pr: 1 }}
                >
                    {renderTabs}
                </Stack>

                <Divider />

                {renderList}

                {/* <Box sx={{ p: 1 }}>
					<Button fullWidth size="large">
						View All
					</Button>
				</Box> */}
            </Drawer>
        </>
    );
}
