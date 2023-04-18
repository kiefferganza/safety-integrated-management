// routes
import { PATH_DASHBOARD } from '@/routes/paths';
// components
import Label from '@/Components/label';
import SvgColor from '@/Components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/storage/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const ICONS = {
	blog: icon('ic_blog'),
	cart: icon('ic_cart'),
	chat: icon('ic_chat'),
	mail: icon('ic_mail'),
	user: icon('ic_user'),
	file: icon('ic_file'),
	lock: icon('ic_lock'),
	label: icon('ic_label'),
	blank: icon('ic_blank'),
	kanban: icon('ic_kanban'),
	folder: icon('ic_folder'),
	banking: icon('ic_banking'),
	booking: icon('ic_booking'),
	invoice: icon('ic_invoice'),
	calendar: icon('ic_calendar'),
	disabled: icon('ic_disabled'),
	external: icon('ic_external'),
	menuItem: icon('ic_menu_item'),
	ecommerce: icon('ic_ecommerce'),
	analytics: icon('ic_analytics'),
	dashboard: icon('ic_dashboard'),
	employee: icon('clarity_employee_solid'),
	training: icon('mingcute_certificate_2'),
	toolboxTalks: icon('mingcute_clipboard'),
	incident: icon('ion_accessibility'),
	inspection: icon('heroicons_document_magnifying_glass')
};

const navConfig = [
	// GENERAL
	// ----------------------------------------------------------------------
	{
		subheader: 'general',
		items: [
			{ title: 'HSE-dashboard', path: PATH_DASHBOARD.general.hse_dashboard, icon: ICONS.analytics, routeNames: ["dashboard"] },
			{ title: 'file', path: PATH_DASHBOARD.general.file, icon: ICONS.file, routeNames: ["general.file"] },
			{ title: 'employee', path: PATH_DASHBOARD.general.employee, icon: ICONS.employee, disabled: true },
			{ title: 'inventory', path: PATH_DASHBOARD.general.inventory, icon: ICONS.ecommerce, disabled: true }
		],
	},

	// MANAGEMENT
	// ----------------------------------------------------------------------
	{
		subheader: 'management',
		items: [
			// USER
			{
				title: 'user',
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
					{ title: 'profile', path: PATH_DASHBOARD.user.profile, routeNames: ["management.user.profile"] },
					{ title: 'cards', gate: "user_access", path: PATH_DASHBOARD.user.cards, routeNames: ["management.user.cards"] },
					{ title: 'list', gate: "user_access", path: PATH_DASHBOARD.user.list, routeNames: ["management.user.list", "management.user.show"] },
					{ title: 'create', gate: "user_create", path: PATH_DASHBOARD.user.new, routeNames: ["management.user.new"] },
					{ title: 'settings', path: PATH_DASHBOARD.user.account, routeNames: ["management.user.settings"] },
				],
			},
			// Employees
			{
				title: 'employee',
				path: PATH_DASHBOARD.employee.root,
				icon: ICONS.employee,
				routeNames: [
					"management.employee.list",
					"management.employee.create",
					"management.employee.show",
					"management.employee.profileGallery",
					"management.employee.profileTrainings",
					"management.employee.update",
					"management.position.list",
					"management.department.list",
					"management.company.list",
				],
				children: [
					{ title: 'create', gate: 'employee_create', path: PATH_DASHBOARD.employee.new, routeNames: ["management.employee.create"] },
					{ title: 'list', gate: 'employee_show', path: PATH_DASHBOARD.employee.root, routeNames: ["management.employee.list", "management.employee.show", "management.employee.profileGallery", "management.employee.profileTrainings"] },
					// Position
					{ title: 'position', gate: 'position_show', path: PATH_DASHBOARD.position.root, routeNames: ["management.position.list"] },
					// Department
					{ title: 'department', gate: 'department_show', path: PATH_DASHBOARD.department.root, routeNames: ["management.department.list"] },
					// Company
					{ title: 'company', gate: 'company_show', path: PATH_DASHBOARD.company.root, routeNames: ["management.company.list"] },
				],
			},

			// Training
			{
				title: 'Training',
				path: PATH_DASHBOARD.training.root,
				icon: ICONS.training,
				routeNames: [
					"training.management.client",
					"training.management.client.show",
					"training.management.in_house",
					"training.management.in_house.show",
					"training.management.induction",
					"training.management.induction.show",
					"training.management.external",
					"training.management.external.show",
					"training.management.create",
					"training.management.edit",
				],
				children: [
					{ title: 'create', gate: 'training_create', path: PATH_DASHBOARD.training.new(2), routeNames: ["training.management.create"] },
					{ title: 'client', gate: 'training_show', path: PATH_DASHBOARD.training.client, routeNames: ["training.management.client", "training.management.client.show"] },
					{ title: 'induction', gate: 'training_show', path: PATH_DASHBOARD.training.induction, routeNames: ["training.management.induction", "training.management.induction.show"] },
					{ title: 'in house', gate: 'training_show', path: PATH_DASHBOARD.training.inHouse, routeNames: ["training.management.in_house", "training.management.in_house.show"] },
					{ title: 'third party', gate: 'training_show', path: PATH_DASHBOARD.training.thirdParty, routeNames: ["training.management.external", "training.management.external.show"] },
					{ title: 'metrics report', path: "/#", disabled: true },
				]
			},

			// Inspection
			{
				title: 'Inspection',
				path: PATH_DASHBOARD.inspection.root,
				icon: ICONS.inspection,
				routeNames: [
					"inspection.management.report",
					"inspection.management.new",
					"inspection.management.list",
					"inspection.management.view",
					"inspection.management.edit",
					"inspection.management.review",
					"inspection.management.verify"
				],
				children: [
					{
						title: "Create",
						gate: 'inspection_create',
						path: PATH_DASHBOARD.inspection.new
					},
					{
						title: "Site",
						path: PATH_DASHBOARD.inspection.safetyObservation,
						routeNames: [
							"inspection.management.report",
							"inspection.management.list",
						],
						children: [
							{ title: 'list', gate: 'inspection_show', path: PATH_DASHBOARD.inspection.list, routeNames: ["inspection.management.new", "inspection.management.list", "inspection.management.view", "inspection.management.edit", "inspection.management.review", "inspection.management.verify"] },
							{ title: 'report', path: PATH_DASHBOARD.inspection.report, routeNames: ["inspection.management.report"] },
						],
					},
					{ title: 'machineries', path: PATH_DASHBOARD.inspection.machineries, disabled: true },
					{ title: 'tools & equipments', path: PATH_DASHBOARD.inspection.toolsAndEquipments, disabled: true },
				]
			},

			// Toolbox Talks
			{
				title: 'Toolbox Talks',
				path: PATH_DASHBOARD.toolboxTalks.root,
				icon: ICONS.toolboxTalks,
				routeNames: [
					"toolboxtalk.management.all",
					"toolboxtalk.management.civil",
					"toolboxtalk.management.electrical",
					"toolboxtalk.management.mechanical",
					"toolboxtalk.management.camp",
					"toolboxtalk.management.office",
					"toolboxtalk.management.new",
					"toolboxtalk.management.edit",
					"toolboxtalk.management.report",
					"toolboxtalk.management.statistic",
				],
				children: [
					{ title: 'create', gate: 'talk_toolbox_create', path: PATH_DASHBOARD.toolboxTalks.new("1"), routeNames: ["toolboxtalk.management.new"] },
					{ title: 'all', gate: 'talk_toolbox_show', path: PATH_DASHBOARD.toolboxTalks.root, routeNames: ["toolboxtalk.management.all"] },
					{ title: 'civil', gate: 'talk_toolbox_show', path: PATH_DASHBOARD.toolboxTalks.civil, routeNames: ["toolboxtalk.management.civil"] },
					{ title: 'electrical', gate: 'talk_toolbox_show', path: PATH_DASHBOARD.toolboxTalks.electrical, routeNames: ["toolboxtalk.management.electrical"] },
					{ title: 'mechanical', gate: 'talk_toolbox_show', path: PATH_DASHBOARD.toolboxTalks.mechanical, routeNames: ["toolboxtalk.management.mechanical"] },
					{ title: 'workshop', gate: 'talk_toolbox_show', path: PATH_DASHBOARD.toolboxTalks.camp, routeNames: ["toolboxtalk.management.camp"] },
					{ title: 'office', gate: 'talk_toolbox_show', path: PATH_DASHBOARD.toolboxTalks.office, routeNames: ["toolboxtalk.management.office"] },
					{ title: 'report', path: PATH_DASHBOARD.toolboxTalks.report, routeNames: ["toolboxtalk.management.report"] },
					{ title: 'statistic', path: PATH_DASHBOARD.toolboxTalks.statistic, routeNames: ["toolboxtalk.management.statistic"] },
				]
			},

			// PPE
			{
				title: 'PPE',
				path: PATH_DASHBOARD.ppe.root,
				icon: ICONS.cart,
				routeNames: [
					"ppe.management.index",
					"ppe.management.create",
					"ppe.management.show",
					"ppe.management.edit",
					"ppe.management.report",
					"ppe.management.report.list",
					"ppe.management.report.show"
				],
				children: [
					{ title: 'create', gate: 'inventory_create', path: PATH_DASHBOARD.ppe.new, routeNames: ["ppe.management.create"] },
					{ title: 'list', gate: 'inventory_show', path: PATH_DASHBOARD.ppe.root, routeNames: ["ppe.management.index", "ppe.management.show", "ppe.management.edit"] },
					{ title: 'report', path: PATH_DASHBOARD.ppe.report, routeNames: ["ppe.management.report"] },
					{ title: 'report list', path: PATH_DASHBOARD.ppe.reportList, routeNames: ["ppe.management.report.list", "ppe.management.report.show"] }
				],
			},

			// Incident
			{
				title: 'Incident',
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
					{ title: 'create', path: PATH_DASHBOARD.incident.new, routeNames: ["incident.management.create"] },
					{ title: 'list', path: PATH_DASHBOARD.incident.root, routeNames: ["incident.management.show", "incident.management.index", "incident.management.edit"] },
					{ title: 'report', path: PATH_DASHBOARD.incident.report, routeNames: ["incident.management.report"] },
				]
			},
			{
				title: 'File manager',
				gate: 'folder_show',
				path: PATH_DASHBOARD.fileManager.root,
				routeNames: [
					"files.management.index",
					"files.management.show",
					"files.management.external",
					"files.management.document.show",
					"files.management.create"
				],
				icon: ICONS.folder
			},
		],
	},

	// APP
	// ----------------------------------------------------------------------
	{
		subheader: 'app',
		items: [
			{
				title: 'mail',
				path: PATH_DASHBOARD.mail.root,
				icon: ICONS.mail,
				info: <Label color="error">+32</Label>,
				disabled: true
			},
			{
				title: 'chat',
				path: PATH_DASHBOARD.chat.root,
				icon: ICONS.chat,
				disabled: true
			},
			{
				title: 'calendar',
				path: PATH_DASHBOARD.calendar,
				icon: ICONS.calendar,
			},
			{
				title: 'kanban',
				path: PATH_DASHBOARD.kanban,
				icon: ICONS.kanban,
				disabled: true
			},
		],
	},
];

export default navConfig;
