import { useState } from "react";
// @mui
const {
    Box,
    Tab,
    Tabs,
    Card,
    Grid,
    Divider,
    Container,
    Stack,
    TextField,
    InputAdornment,
    Button,
} = await import("@mui/material");
// routes
import { PATH_DASHBOARD } from "@/routes/paths";
import { Head, Link } from "@inertiajs/inertia-react";
// components
import Markdown from "@/Components/markdown";
import CustomBreadcrumbs from "@/Components/custom-breadcrumbs";
import { useSettingsContext } from "@/Components/settings";
import {
    PpeDetailsCarousel,
    PpeDetailsSummary,
} from "@/sections/@dashboard/ppe/details";
import Iconify from "@/Components/iconify";
import RenderedPDFViewer from "./PDF/RenderPDFViewer";
const { PpeDetailsHistory } = await import(
    "@/sections/@dashboard/ppe/details/PpeDetailsHistory"
);

// ----------------------------------------------------------------------

export default function PpeProductDetailsPage({ inventory }) {
    const { themeStretch } = useSettingsContext();

    const [filterName, setFilterName] = useState("");

    const [currentTab, setCurrentTab] = useState("history");

    const TABS = [
        {
            value: "history",
            label: "History",
            component: inventory ? (
                <PpeDetailsHistory
                    bound={inventory?.bound}
                    filterName={filterName}
                    setFilterName={setFilterName}
                />
            ) : null,
        },
        {
            value: "description",
            label: "description",
            component: inventory ? (
                <Markdown children={inventory?.description} />
            ) : null,
        },
    ];
    return (
        <>
            <Head>
                <title>{`${inventory?.item || ""}`}</title>
            </Head>

            <Container maxWidth={themeStretch ? false : "lg"}>
                <CustomBreadcrumbs
                    heading="Product Details"
                    links={[
                        { name: "Dashboard", href: PATH_DASHBOARD.root },
                        {
                            name: "PPE",
                            href: PATH_DASHBOARD.ppe.root,
                        },
                        { name: inventory?.item?.toUpperCase() },
                    ]}
                    action={
                        <Stack direction="row" gap={1.5}>
                            <Button
                                variant="outlined"
                                component={Link}
                                href={PATH_DASHBOARD.ppe.edit(inventory.slug)}
                                startIcon={<Iconify icon="eva:edit-fill" />}
                            >
                                Edit
                            </Button>
                            {!!inventory && (
                                <RenderedPDFViewer props={{ inventory }} />
                            )}
                        </Stack>
                    }
                />

                {inventory && (
                    <>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6} lg={7}>
                                <PpeDetailsCarousel inventory={inventory} />
                            </Grid>

                            <Grid item xs={12} md={6} lg={5}>
                                <PpeDetailsSummary inventory={inventory} />
                            </Grid>
                        </Grid>

                        <Card>
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                sx={{
                                    px: 3,
                                    my: 2,
                                    bgcolor: "background.neutral",
                                }}
                            >
                                <Tabs
                                    value={currentTab}
                                    onChange={(_event, newValue) =>
                                        setCurrentTab(newValue)
                                    }
                                >
                                    {TABS.map((tab) => (
                                        <Tab
                                            key={tab.value}
                                            value={tab.value}
                                            label={tab.label}
                                        />
                                    ))}
                                </Tabs>
                                <TextField
                                    size="small"
                                    placeholder="Search..."
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Iconify
                                                    icon="eva:search-fill"
                                                    sx={{
                                                        color: "text.disabled",
                                                    }}
                                                />
                                            </InputAdornment>
                                        ),
                                    }}
                                    value={filterName}
                                    onChange={(event) => {
                                        setFilterName(event.target.value);
                                    }}
                                />
                            </Stack>

                            <Divider />

                            {TABS.map(
                                (tab) =>
                                    tab.value === currentTab && (
                                        <Box
                                            key={tab.value}
                                            sx={{
                                                ...(currentTab ===
                                                    "description" && {
                                                    p: 3,
                                                }),
                                            }}
                                        >
                                            {tab.component}
                                        </Box>
                                    )
                            )}
                        </Card>
                    </>
                )}
            </Container>
        </>
    );
}
