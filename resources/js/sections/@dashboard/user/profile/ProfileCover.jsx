import PropTypes from "prop-types";
// @mui
import { styled } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";
// components
import Image from "@/Components/image";
import { useCallback, useEffect, useState } from "react";
import UploadProfile from "@/Components/upload/UploadProfile";
import { CustomAvatar } from "@/Components/custom-avatar";
import { Inertia } from "@inertiajs/inertia";
import { useQueryClient } from "@tanstack/react-query";
import UploadCover from "@/Components/upload/UploadCover";

// ----------------------------------------------------------------------

const StyledRoot = styled("div")(() => ({
    "&:before": {
        top: 0,
        zIndex: 9,
        content: "''",
        width: "100%",
        height: "100%",
        position: "absolute",
    },
}));

const StyledInfo = styled("div")(({ theme }) => ({
    left: 0,
    right: 0,
    zIndex: 99,
    position: "absolute",
    marginTop: theme.spacing(5),
    [theme.breakpoints.up("md")]: {
        right: "auto",
        display: "flex",
        alignItems: "center",
        left: theme.spacing(3),
        bottom: theme.spacing(3),
    },
}));

// ----------------------------------------------------------------------

ProfileCover.propTypes = {
    cover: PropTypes.string,
    name: PropTypes.string,
    role: PropTypes.string,
    isCurrentProfile: PropTypes.bool,
    setOpenBackdrop: PropTypes.oneOfType([PropTypes.func, PropTypes.any]),
};

export default function ProfileCover({
    name,
    role,
    user,
    isCurrentProfile,
    setOpenBackdrop,
}) {
    const queryClient = useQueryClient();
    const [profileImage, setProfileImage] = useState(null);
    const [coverImage, setCoverImage] = useState(null);

    const handleDrop = useCallback(
        (acceptedFiles) => {
            const file = acceptedFiles[0];

            if (file) {
                Inertia.post(
                    route("api.user.update_profile_image", user?.id),
                    { profile_pic: file },
                    {
                        preserveScroll: true,
                        onStart() {
                            if (typeof setOpenBackdrop === "function") {
                                setOpenBackdrop(true);
                            }
                        },
                        onFinish() {
                            if (typeof setOpenBackdrop === "function") {
                                const newFile = Object.assign(file, {
                                    preview: URL.createObjectURL(file),
                                });
                                setProfileImage(newFile);
                                setOpenBackdrop(false);
                                queryClient.invalidateQueries({
                                    queryKey: ["user.profile_images", user.id],
                                    force: true,
                                });
                            }
                        },
                    }
                );
            }
        },
        [setProfileImage]
    );

    const handleDropCover = useCallback(
        (acceptedFiles) => {
            const file = acceptedFiles[0];

            if (file) {
                Inertia.post(
                    route("api.user.add_cover", user?.id),
                    { cover: file },
                    {
                        preserveScroll: true,
                        onStart() {
                            if (typeof setOpenBackdrop === "function") {
                                setOpenBackdrop(true);
                            }
                        },
                        onFinish() {
                            if (typeof setOpenBackdrop === "function") {
                                const newFile = Object.assign(file, {
                                    preview: URL.createObjectURL(file),
                                });
                                setCoverImage(newFile);
                                setOpenBackdrop(false);
                                queryClient.invalidateQueries({
                                    queryKey: ["user.cover_images", user.id],
                                    force: true,
                                });
                            }
                        },
                    }
                );
            }
        },
        [setCoverImage]
    );

    useEffect(() => {
        setProfileImage(
            () =>
                user?.profile?.small ||
                route("image", {
                    path: "assets/images/default-profile.jpg",
                    w: 128,
                    h: 128,
                    fit: "crop",
                })
        );
        setCoverImage(
            () =>
                user?.cover?.cover ||
                route("image", {
                    path: "assets/images/home/cover.jpg",
                    w: 1200,
                    h: 280,
                    fit: "crop",
                })
        );
    }, [user.profile, user.cover]);

    return (
        <StyledRoot>
            <StyledInfo>
                {isCurrentProfile ? (
                    <UploadProfile
                        maxSize={3145728}
                        onDrop={handleDrop}
                        file={profileImage}
                        sx={{
                            width: { xs: 96, md: 128 },
                            height: { xs: 96, md: 128 },
                        }}
                        avatarSx={{
                            width: "100%",
                            height: "100%",
                        }}
                    />
                ) : (
                    <CustomAvatar
                        src={
                            user?.profile?.small ||
                            route("image", {
                                path: "assets/images/default-profile.jpg",
                                w: 128,
                                h: 128,
                                fit: "crop",
                            })
                        }
                        alt={`${user?.firstname || user?.employee?.firstname} ${
                            user?.lastname || user?.employee?.lastname
                        }`}
                        name={`${
                            user?.firstname || user?.employee?.firstname
                        } ${user?.lastname || user?.employee?.lastname}`}
                        sx={{
                            mx: "auto",
                            borderWidth: 2,
                            borderStyle: "solid",
                            borderColor: "common.white",
                            width: { xs: 80, md: 128 },
                            height: { xs: 80, md: 128 },
                        }}
                    />
                )}
                <Box
                    sx={{
                        ml: { md: 3 },
                        mt: { xs: 1, md: 0 },
                        color: "common.white",
                        textAlign: { xs: "center", md: "left" },
                    }}
                >
                    <Typography variant="h4">{name}</Typography>

                    <Typography sx={{ opacity: 0.72 }}>{role}</Typography>
                </Box>
            </StyledInfo>

            {isCurrentProfile ? (
                <UploadCover
                    maxSize={3145728}
                    onDrop={handleDropCover}
                    file={coverImage}
                    sx={{
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        position: "absolute",
                    }}
                />
            ) : (
                <Image
                    alt="cover"
                    src={
                        user?.cover?.cover ||
                        route("image", {
                            path: "assets/images/home/cover.jpg",
                            w: 1200,
                            h: 280,
                            fit: "crop",
                        })
                    }
                    sx={{
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        position: "absolute",
                    }}
                />
            )}
        </StyledRoot>
    );
}
