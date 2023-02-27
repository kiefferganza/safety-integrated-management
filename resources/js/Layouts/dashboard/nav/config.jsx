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
			{ title: 'HSE-dashboard', path: PATH_DASHBOARD.general.hse_dashboard, icon: ICONS.analytics },
			{ title: 'file', path: PATH_DASHBOARD.general.file, icon: ICONS.file },
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
				children: [
					{ title: 'profile', path: PATH_DASHBOARD.user.profile },
					{ title: 'cards', gate: "view_any_user", path: PATH_DASHBOARD.user.cards },
					{ title: 'list', gate: "view_any_user", path: PATH_DASHBOARD.user.list },
					{ title: 'create', gate: "view_any_user", path: PATH_DASHBOARD.user.new },
					{ title: 'settings', path: PATH_DASHBOARD.user.account },
				],
			},
			// Employees
			{
				title: 'employee',
				path: PATH_DASHBOARD.employee.root,
				icon: ICONS.employee,
				childList: ["position", "department", "company", "employee"],
				children: [
					{ title: 'list', path: PATH_DASHBOARD.employee.root },
					{ title: 'create', path: PATH_DASHBOARD.employee.new },
					// Position
					{ title: 'position', path: PATH_DASHBOARD.position.root },
					// Department
					{ title: 'department', path: PATH_DASHBOARD.department.root },
					// Company
					{ title: 'company', path: PATH_DASHBOARD.company.root },
				],
			},

			// Training
			{
				title: 'Training',
				path: PATH_DASHBOARD.training.root,
				icon: ICONS.training,
				children: [
					{ title: 'create', path: PATH_DASHBOARD.training.new(2) },
					{ title: 'client', path: PATH_DASHBOARD.training.client },
					{ title: 'induction', path: PATH_DASHBOARD.training.induction },
					{ title: 'in house', path: PATH_DASHBOARD.training.inHouse },
					{ title: 'third party', path: PATH_DASHBOARD.training.thirdParty },
					{ title: 'metrics report', path: "/#", disabled: true },
				]
			},

			// Inspection
			{
				title: 'Inspection',
				path: PATH_DASHBOARD.inspection.root,
				icon: ICONS.inspection,
				children: [
					{
						title: "Create",
						path: PATH_DASHBOARD.inspection.new
					},
					{
						title: "Site",
						path: PATH_DASHBOARD.inspection.safetyObservation,
						children: [
							{ title: 'list', path: PATH_DASHBOARD.inspection.list },
							{ title: 'report', path: PATH_DASHBOARD.inspection.report, disabled: true },
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
				children: [
					{ title: 'create', path: PATH_DASHBOARD.toolboxTalks.new("1") },
					{ title: 'all', path: PATH_DASHBOARD.toolboxTalks.root },
					{ title: 'civil', path: PATH_DASHBOARD.toolboxTalks.civil },
					{ title: 'electrical', path: PATH_DASHBOARD.toolboxTalks.electrical },
					{ title: 'mechanical', path: PATH_DASHBOARD.toolboxTalks.mechanical },
					{ title: 'workshop', path: PATH_DASHBOARD.toolboxTalks.camp },
					{ title: 'office', path: PATH_DASHBOARD.toolboxTalks.office },
					{ title: 'report', path: PATH_DASHBOARD.toolboxTalks.report },
					{ title: 'statistic', path: PATH_DASHBOARD.toolboxTalks.statistic },
				]
			},

			// PPE
			{
				title: 'PPE',
				path: PATH_DASHBOARD.ppe.root,
				icon: ICONS.cart,
				children: [
					{ title: 'create', path: PATH_DASHBOARD.ppe.new },
					{ title: 'list', path: PATH_DASHBOARD.ppe.root }
				],
			},

			// Incident
			{
				title: 'Incident',
				path: PATH_DASHBOARD.incident.root,
				icon: ICONS.incident,
				children: [
					{ title: 'first aid', path: PATH_DASHBOARD.incident.firstAid, disabled: true },
					{ title: 'investigation', path: PATH_DASHBOARD.incident.investigation, disabled: true },
					{ title: 'incident report', path: PATH_DASHBOARD.incident.incidentReport, disabled: true },
				]
			},
			{
				title: 'File manager',
				path: PATH_DASHBOARD.fileManager.root,
				childList: ['file-manager'],
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
