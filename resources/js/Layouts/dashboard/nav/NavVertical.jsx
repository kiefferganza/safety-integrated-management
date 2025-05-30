import PropTypes from "prop-types";
// @mui
import { Box, Stack, Drawer } from "@mui/material";
// hooks
import useResponsive from "@/hooks/useResponsive";
// config
import { NAV } from "../../../config";
// components
import Logo from "@/Components/logo";
import Scrollbar from "@/Components/scrollbar";
import { NavSectionVertical } from "@/Components/nav-section";
//
import navConfig from "./config";
import NavDocs from "./NavDocs";
import NavAccount from "./NavAccount";

// ----------------------------------------------------------------------

NavVertical.propTypes = {
    openNav: PropTypes.bool,
    onCloseNav: PropTypes.func,
};

export default function NavVertical({ openNav, onCloseNav }) {
    const isDesktop = useResponsive("up", "lg");

    const renderContent = (
        <Scrollbar
            sx={{
                height: 1,
                "& .simplebar-content": {
                    height: 1,
                    display: "flex",
                    flexDirection: "column",
                },
            }}
        >
            <Stack
                spacing={3}
                sx={{
                    pt: 3,
                    pb: 2,
                    px: 2.5,
                    flexShrink: 0,
                }}
            >
                <Logo />

                <NavAccount />
            </Stack>

            <NavSectionVertical data={navConfig} />

            <Box sx={{ flexGrow: 1 }} />

            <NavDocs />
        </Scrollbar>
    );

    return (
        <Box
            component="nav"
            sx={{
                flexShrink: { lg: 0 },
                width: { lg: NAV.W_DASHBOARD },
            }}
        >
            {isDesktop ? (
                <Drawer
                    open
                    variant="permanent"
                    PaperProps={{
                        sx: {
                            width: NAV.W_DASHBOARD,
                            bgcolor: "transparent",
                            borderRightStyle: "dashed",
                        },
                    }}
                >
                    {renderContent}
                </Drawer>
            ) : (
                <Drawer
                    open={openNav}
                    onClose={onCloseNav}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    PaperProps={{
                        sx: {
                            width: NAV.W_DASHBOARD,
                        },
                    }}
                >
                    {renderContent}
                </Drawer>
            )}
        </Box>
    );
}
