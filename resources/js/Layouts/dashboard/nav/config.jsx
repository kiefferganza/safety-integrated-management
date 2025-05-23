// routes
import { PATH_DASHBOARD } from "@/routes/paths";
// components
import Label from "@/Components/label";
import SvgColor from "@/Components/svg-color";

// ----------------------------------------------------------------------

const icon = (name) => (
    <SvgColor
        src={`/storage/assets/icons/navbar/${name}.svg`}
        sx={{ width: 1, height: 1 }}
    />
);

const ICONS = {
    blog: icon("ic_blog"),
    cart: icon("ic_cart"),
    chat: icon("ic_chat"),
    mail: icon("ic_mail"),
    user: icon("ic_user"),
    companyInformation: icon("mdi_company"),
    file: icon("ic_file"),
    lock: icon("ic_lock"),
    label: icon("ic_label"),
    blank: icon("ic_blank"),
    kanban: icon("ic_kanban"),
    folder: icon("ic_folder"),
    banking: icon("ic_banking"),
    booking: icon("ic_booking"),
    invoice: icon("ic_invoice"),
    calendar: icon("ic_calendar"),
    disabled: icon("ic_disabled"),
    external: icon("ic_external"),
    menuItem: icon("ic_menu_item"),
    ecommerce: icon("ic_ecommerce"),
    analytics: icon("ic_analytics"),
    dashboard: icon("ic_dashboard"),
    employee: icon("clarity_employee_solid"),
    training: icon("mingcute_certificate_2"),
    toolboxTalks: icon("mingcute_clipboard"),
    incident: icon("ion_accessibility"),
    inspection: icon("heroicons_document_magnifying_glass"),
    store: icon("ic_store"),
    chart: icon("mdi_chart_box"),
};

const navConfig = [
    // GENERAL
    // ----------------------------------------------------------------------
    {
        subheader: "general",
        items: [
            {
                title: "HSE dashboard",
                path: PATH_DASHBOARD.general.hse_dashboard,
                icon: ICONS.analytics,
                routeNames: ["dashboard"],
            },
            // {
            //     title: "file",
            //     path: PATH_DASHBOARD.general.file,
            //     icon: ICONS.file,
            //     routeNames: ["general.file"],
            // },
            // {
            //     title: "employee",
            //     path: PATH_DASHBOARD.general.employee,
            //     icon: ICONS.employee,
            //     disabled: true,
            // },
            // {
            //     title: "inventory",
            //     path: PATH_DASHBOARD.general.inventory,
            //     icon: ICONS.ecommerce,
            //     disabled: true,
            // },
        ],
    },

    // HSE
    // ----------------------------------------------------------------------
    {
        subheader: "hse",
        items: [
            // COMPANY INFORMATION
            {
                title: "Control Panel",
                path: PATH_DASHBOARD.companyInformation.register,
                icon: ICONS.companyInformation,
                routeNames: [
                    "management.company_information.register",
                    "management.position.list",
                    "management.department.list",
                    "management.company.list",
                ],
                children: [
                    {
                        title: "Project Details",
                        path: PATH_DASHBOARD.companyInformation.register,
                        routeNames: ["management.company_information.register"],
                    },
                    // Position
                    {
                        title: "positions",
                        gate: "position_show",
                        path: PATH_DASHBOARD.position.root,
                        routeNames: ["management.position.list"],
                    },
                    // Department
                    {
                        title: "departments",
                        gate: "department_show",
                        path: PATH_DASHBOARD.department.root,
                        routeNames: ["management.department.list"],
                    },
                    // Company
                    {
                        title: "company",
                        gate: "company_show",
                        path: PATH_DASHBOARD.company.root,
                        routeNames: ["management.company.list"],
                    },
                ],
            },
            // USER
            {
                title: "account",
                path: PATH_DASHBOARD.user.root,
                icon: ICONS.user,
                routeNames: [
                    "management.user.profile",
                    "management.user.show",
                    "management.user.settings",
                    "management.user.edit",
                    "management.user.new",
                    "management.user.cards",
                    "management.user.list",
                ],
                children: [
                    {
                        title: "profile",
                        path: PATH_DASHBOARD.user.profile,
                        routeNames: ["management.user.profile"],
                    },
                    // {
                    //     title: "cards",
                    //     gate: "user_show",
                    //     path: PATH_DASHBOARD.user.cards,
                    //     routeNames: ["management.user.cards"],
                    // },
                    {
                        title: "user list",
                        gate: "user_show",
                        path: PATH_DASHBOARD.user.list,
                        routeNames: [
                            "management.user.list",
                            "management.user.show",
                        ],
                    },
                    {
                        title: "create",
                        gate: "user_create",
                        path: PATH_DASHBOARD.user.new,
                        routeNames: ["management.user.new"],
                    },
                    {
                        title: "settings",
                        gate: "user_create",
                        path: PATH_DASHBOARD.user.account,
                        routeNames: ["management.user.settings"],
                    },
                ],
            },
            // Employees
            {
                title: "employee",
                path: PATH_DASHBOARD.employee.root,
                icon: ICONS.employee,
                routeNames: [
                    "management.employee.list",
                    "management.employee.create",
                    "management.employee.show",
                    "management.employee.profileGallery",
                    "management.employee.profileTrainings",
                    "management.employee.update",
                ],
                children: [
                    {
                        title: "create",
                        gate: "employee_create",
                        path: PATH_DASHBOARD.employee.new,
                        routeNames: ["management.employee.create"],
                    },
                    {
                        title: "list",
                        gate: "employee_show",
                        path: PATH_DASHBOARD.employee.root,
                        routeNames: [
                            "management.employee.list",
                            "management.employee.show",
                            "management.employee.profileGallery",
                            "management.employee.profileTrainings",
                        ],
                    },
                ],
            },

            // Training
            {
                title: "Training",
                icon: ICONS.training,
                routeNames: [
                    "training.management.client",
                    "training.management.client_course",
                    "training.management.client.show",
                    "training.management.in_house",
                    "training.management.in_house.show",
                    "training.management.induction",
                    "training.management.induction.show",
                    "training.management.external",
                    "training.management.external.show",
                    "training.management.createThirdParty",
                    "training.management.createClient",
                    "training.management.edit",
                    "training.management.courses",
                    "training.management.matrix",
                    "training.management.in_house_course",
                    "training.management.in_house_create",
                    "training.management.in_house_edit",
                    "training.management.show_in_house",
                    "training.management.in_house_matrix",
                    "training.management.external_matrix",
                    "training.management.client.show",
                    "training.management.external.external_action",
                    "training.management.external.external_approve",
                    "training.management.external.external_review",
                    "training.management.external.edit",
                    "training.management.tracker",
                ],
                children: [
                    {
                        title: "tracker",
                        path: PATH_DASHBOARD.training.tracker,
                        routeNames: ["training.management.tracker"],
                    },
                    {
                        title: "client",
                        routeNames: [
                            "training.management.client",
                            "training.management.client_course",
                            "training.management.client.show",
                            "training.management.createClient",
                        ],
                        children: [
                            {
                                title: "create",
                                gate: "training_show",
                                path: PATH_DASHBOARD.training.createClient,
                                routeNames: [
                                    "training.management.createClient",
                                ],
                            },
                            {
                                title: "register",
                                gate: "training_show",
                                path: PATH_DASHBOARD.training.clientCourses,
                                routeNames: [
                                    "training.management.client_course",
                                ],
                            },
                            {
                                title: "list",
                                path: PATH_DASHBOARD.training.client,
                                gate: "training_show",
                                routeNames: ["training.management.client"],
                            },
                            {
                                title: "client matrix",
                                disabled: true,
                            },
                        ],
                    },
                    {
                        title: "Internal",
                        routeNames: [
                            "training.management.in_house_course",
                            "training.management.in_house_create",
                            "training.management.in_house",
                            "training.management.in_house.show",
                            "training.management.in_house_edit",
                            "training.management.show_in_house",
                            "training.management.in_house_matrix",
                        ],
                        children: [
                            {
                                title: "create",
                                gate: "training_show",
                                path: PATH_DASHBOARD.training.newInHouse,
                                routeNames: [
                                    "training.management.in_house_create",
                                ],
                            },
                            {
                                title: "register",
                                gate: "training_show",
                                path: PATH_DASHBOARD.training.inHouseCourses,
                                routeNames: [
                                    "training.management.in_house_course",
                                ],
                            },
                            {
                                title: "in house",
                                gate: "training_show",
                                path: PATH_DASHBOARD.training.inHouse,
                                routeNames: ["training.management.in_house"],
                            },
                            {
                                title: "internal matrix",
                                path: PATH_DASHBOARD.training.inHouseMatrix,
                                routeNames: [
                                    "training.management.in_house_matrix",
                                ],
                            },
                        ],
                    },
                    {
                        title: "External",
                        routeNames: [
                            "training.management.external",
                            "training.management.external.show",
                            "training.management.createThirdParty",
                            "training.management.edit",
                            "training.management.courses",
                            "training.management.external_matrix",
                            "training.management.external.external_action",
                            "training.management.external.external_approve",
                            "training.management.external.external_review",
                        ],
                        children: [
                            {
                                title: "create",
                                gate: "training_create",
                                path: PATH_DASHBOARD.training.createThirdParty,
                                routeNames: [
                                    "training.management.createThirdParty",
                                ],
                            },
                            {
                                title: "register",
                                gate: "training_create",
                                path: PATH_DASHBOARD.training.register,
                                routeNames: ["training.management.courses"],
                            },
                            {
                                title: "third party",
                                gate: "training_show",
                                path: PATH_DASHBOARD.training.thirdParty,
                                routeNames: [
                                    "training.management.external",
                                    "training.management.external.show",
                                ],
                            },
                            {
                                title: "external matrix",
                                path: PATH_DASHBOARD.training.externalMatrix,
                                routeNames: [
                                    "training.management.external_matrix",
                                ],
                            },
                        ],
                    },
                    {
                        title: "matrix report",
                        path: PATH_DASHBOARD.training.matrix,
                        routeNames: ["training.management.matrix"],
                    },
                ],
            },

            // Inspection
            {
                title: "DOR",
                path: PATH_DASHBOARD.inspection.root,
                icon: ICONS.inspection,
                routeNames: [
                    "inspection.management.report",
                    "inspection.management.new",
                    "inspection.management.list",
                    "inspection.management.view",
                    "inspection.management.edit",
                    "inspection.management.review",
                    "inspection.management.verify",
                    // inspector
                    "inspection.management.inspector.list",
                    "inspection.management.inspector.positions",
                    "inspection.management.tracker",
                ],
                children: [
                    {
                        title: "Task",
                        path: PATH_DASHBOARD.inspection.tracker,
                        routeNames: ["inspection.management.tracker"],
                    },
                    {
                        title: "Inspector",
                        path: PATH_DASHBOARD.root,
                        routeNames: [
                            "inspection.management.inspector.list",
                            "inspection.management.inspector.positions",
                        ],
                        children: [
                            {
                                title: "List",
                                routeNames: [
                                    "inspection.management.inspector.list",
                                ],
                                path: PATH_DASHBOARD.inspection.inspectors,
                            },
                            {
                                title: "Authorized Positions",
                                routeNames: [
                                    "inspection.management.inspector.positions",
                                ],
                                path: PATH_DASHBOARD.inspection.positions,
                            },
                        ],
                    },
                    {
                        title: "Site",
                        path: PATH_DASHBOARD.inspection.safetyObservation,
                        routeNames: [
                            "inspection.management.report",
                            "inspection.management.list",
                            "inspection.management.new",
                        ],
                        children: [
                            {
                                title: "Create",
                                gate: "inspection_create",
                                routeNames: ["inspection.management.new"],
                                path: PATH_DASHBOARD.inspection.new,
                            },
                            {
                                title: "list",
                                gate: "inspection_show",
                                path: PATH_DASHBOARD.inspection.list,
                                routeNames: [
                                    "inspection.management.list",
                                    "inspection.management.view",
                                    "inspection.management.edit",
                                    "inspection.management.review",
                                    "inspection.management.verify",
                                ],
                            },
                            {
                                title: "report",
                                path: PATH_DASHBOARD.inspection.report,
                                routeNames: ["inspection.management.report"],
                            },
                        ],
                    },
                    // {
                    //     title: "machineries",
                    //     path: PATH_DASHBOARD.inspection.machineries,
                    //     disabled: true,
                    // },
                    // {
                    //     title: "tools & equipments",
                    //     path: PATH_DASHBOARD.inspection.toolsAndEquipments,
                    //     disabled: true,
                    // },
                ],
            },

            // Toolbox Talks
            {
                title: "Toolbox Talks",
                path: PATH_DASHBOARD.toolboxTalks.root,
                icon: ICONS.toolboxTalks,
                routeNames: [
                    "toolboxtalk.management.all",
                    "toolboxtalk.management.civil",
                    "toolboxtalk.management.electrical",
                    "toolboxtalk.management.mechanical",
                    "toolboxtalk.management.camp",
                    "toolboxtalk.management.office",
                    "toolboxtalk.management.show",
                    "toolboxtalk.management.new",
                    "toolboxtalk.management.edit",
                    "toolboxtalk.management.report",
                    "toolboxtalk.management.statistic",
                    // preplanning
                    "toolboxtalk.management.preplanning.tracker",
                ],
                children: [
                    {
                        title: "TBT Tracker",
                        path: PATH_DASHBOARD.toolboxTalks.tracker,
                        routeNames: [
                            "toolboxtalk.management.preplanning.tracker",
                        ],
                    },
                    {
                        title: "create",
                        gate: "talk_toolbox_create",
                        path: PATH_DASHBOARD.toolboxTalks.new("1"),
                        routeNames: ["toolboxtalk.management.new"],
                    },
                    {
                        title: "all",
                        gate: "talk_toolbox_show",
                        path: PATH_DASHBOARD.toolboxTalks.root,
                        routeNames: ["toolboxtalk.management.all"],
                    },
                    {
                        title: "civil",
                        gate: "talk_toolbox_show",
                        path: PATH_DASHBOARD.toolboxTalks.civil,
                        routeNames: ["toolboxtalk.management.civil"],
                    },
                    {
                        title: "electrical",
                        gate: "talk_toolbox_show",
                        path: PATH_DASHBOARD.toolboxTalks.electrical,
                        routeNames: ["toolboxtalk.management.electrical"],
                    },
                    {
                        title: "mechanical",
                        gate: "talk_toolbox_show",
                        path: PATH_DASHBOARD.toolboxTalks.mechanical,
                        routeNames: ["toolboxtalk.management.mechanical"],
                    },
                    {
                        title: "workshop",
                        gate: "talk_toolbox_show",
                        path: PATH_DASHBOARD.toolboxTalks.camp,
                        routeNames: ["toolboxtalk.management.camp"],
                    },
                    {
                        title: "office",
                        gate: "talk_toolbox_show",
                        path: PATH_DASHBOARD.toolboxTalks.office,
                        routeNames: ["toolboxtalk.management.office"],
                    },
                    {
                        title: "report",
                        path: PATH_DASHBOARD.toolboxTalks.report,
                        routeNames: ["toolboxtalk.management.report"],
                    },
                    {
                        title: "statistic",
                        path: PATH_DASHBOARD.toolboxTalks.statistic,
                        routeNames: ["toolboxtalk.management.statistic"],
                    },
                ],
            },

            // PPE
            {
                title: "PPE",
                path: PATH_DASHBOARD.ppe.root,
                icon: ICONS.cart,
                routeNames: [
                    "ppe.management.index",
                    "ppe.management.create",
                    "ppe.management.show",
                    "ppe.management.edit",
                    "ppe.management.report",
                    "ppe.management.report.list",
                    "ppe.management.report.show",
                ],
                children: [
                    {
                        title: "create",
                        gate: "inventory_create",
                        path: PATH_DASHBOARD.ppe.new,
                        routeNames: ["ppe.management.create"],
                    },
                    {
                        title: "list",
                        gate: "inventory_show",
                        path: PATH_DASHBOARD.ppe.root,
                        routeNames: [
                            "ppe.management.index",
                            "ppe.management.show",
                            "ppe.management.edit",
                        ],
                    },
                    {
                        title: "report",
                        routeNames: [
                            "ppe.management.report",
                            "ppe.management.report.list",
                            "ppe.management.report.show",
                        ],
                        children: [
                            {
                                title: "new",
                                path: PATH_DASHBOARD.ppe.report,
                                routeNames: ["ppe.management.report"],
                            },
                            {
                                title: "list",
                                path: PATH_DASHBOARD.ppe.reportList,
                                routeNames: [
                                    "ppe.management.report.list",
                                    "ppe.management.report.show",
                                ],
                            },
                        ],
                    },
                ],
            },

            // Incident
            {
                title: "Incident",
                path: PATH_DASHBOARD.incident.root,
                icon: ICONS.incident,
                routeNames: [
                    "incident.management.index",
                    "incident.management.create",
                    "incident.management.edit",
                    "incident.management.show",
                    "incident.management.report",
                ],
                children: [
                    {
                        title: "create",
                        path: PATH_DASHBOARD.incident.new,
                        routeNames: ["incident.management.create"],
                    },
                    {
                        title: "list",
                        path: PATH_DASHBOARD.incident.root,
                        routeNames: [
                            "incident.management.show",
                            "incident.management.index",
                            "incident.management.edit",
                        ],
                    },
                    {
                        title: "report",
                        path: PATH_DASHBOARD.incident.report,
                        routeNames: ["incident.management.report"],
                    },
                ],
            },

            // File Manager
            {
                title: "File manager",
                gate: "folder_show",
                path: PATH_DASHBOARD.fileManager.root,
                routeNames: [
                    "files.management.index",
                    "files.management.show",
                    "files.management.external",
                    "files.management.document.show",
                    "files.management.create",
                ],
                icon: ICONS.folder,
            },
        ],
    },

    // Operation
    {
        subheader: "operation",
        items: [
            {
                title: "Store",
                routeNames: [
                    "operation.store.index",
                    "operation.store.create",
                    "operation.store.edit",
                    "operation.store.show",
                    "operation.store.report.index",
                    "operation.store.report.create",
                    "operation.store.report.show",
                ],
                icon: ICONS.store,
                children: [
                    {
                        title: "create",
                        path: PATH_DASHBOARD.store.create,
                        routeNames: ["operation.store.create"],
                    },
                    {
                        title: "list",
                        path: PATH_DASHBOARD.store.root,
                        routeNames: ["operation.store.index"],
                    },
                    {
                        title: "report",
                        routeNames: [
                            "operation.store.report.index",
                            "operation.store.report.create",
                            "operation.store.report.show",
                        ],
                        children: [
                            {
                                title: "new",
                                path: PATH_DASHBOARD.store.createReport,
                                routeNames: ["operation.store.report.create"],
                            },
                            {
                                title: "list",
                                path: PATH_DASHBOARD.store.report,
                                routeNames: [
                                    "operation.store.report.index",
                                    "operation.store.report.show",
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },

    // APP
    // ----------------------------------------------------------------------
    {
        subheader: "app",
        items: [
            {
                title: "mail",
                path: PATH_DASHBOARD.mail.root,
                icon: ICONS.mail,
                info: <Label color="error">+32</Label>,
            },
            // {
            //     title: "chat",
            //     path: PATH_DASHBOARD.chat.root,
            //     icon: ICONS.chat,
            //     disabled: true,
            // },
            {
                title: "calendar",
                path: PATH_DASHBOARD.calendar,
                icon: ICONS.calendar,
            },
            // {
            //     title: "kanban",
            //     path: PATH_DASHBOARD.kanban,
            //     icon: ICONS.kanban,
            //     disabled: true,
            // },
        ],
    },
];

export default navConfig;
