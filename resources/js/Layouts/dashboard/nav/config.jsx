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
					{ title: 'cards', gate: "user_access", path: PATH_DASHBOARD.user.cards },
					{ title: 'list', gate: "user_access", path: PATH_DASHBOARD.user.list },
					{ title: 'create', gate: "user_create", path: PATH_DASHBOARD.user.new },
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
					{ title: 'create', gate: 'employee_create', path: PATH_DASHBOARD.employee.new },
					{ title: 'profile', path: PATH_DASHBOARD.employee.profile },
					{ title: 'list', gate: 'employee_show', path: PATH_DASHBOARD.employee.root },
					// Position
					{ title: 'position', gate: 'position_show', path: PATH_DASHBOARD.position.root },
					// Department
					{ title: 'department', gate: 'department_show', path: PATH_DASHBOARD.department.root },
					// Company
					{ title: 'company', gate: 'company_show', path: PATH_DASHBOARD.company.root },
				],
			},

			// Training
			{
				title: 'Training',
				path: PATH_DASHBOARD.training.root,
				icon: ICONS.training,
				children: [
					{ title: 'create', gate: 'training_create', path: PATH_DASHBOARD.training.new(2) },
					{ title: 'client', gate: 'training_show', path: PATH_DASHBOARD.training.client },
					{ title: 'induction', gate: 'training_show', path: PATH_DASHBOARD.training.induction },
					{ title: 'in house', gate: 'training_show', path: PATH_DASHBOARD.training.inHouse },
					{ title: 'third party', gate: 'training_show', path: PATH_DASHBOARD.training.thirdParty },
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
						gate: 'inspection_create',
						path: PATH_DASHBOARD.inspection.new
					},
					{
						title: "Site",
						path: PATH_DASHBOARD.inspection.safetyObservation,
						children: [
							{ title: 'list', gate: 'inspection_show', path: PATH_DASHBOARD.inspection.list },
							{ title: 'report', path: PATH_DASHBOARD.inspection.report },
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
					{ title: 'create', gate: 'talk_toolbox_create', path: PATH_DASHBOARD.toolboxTalks.new("1") },
					{ title: 'all', gate: 'talk_toolbox_show', path: PATH_DASHBOARD.toolboxTalks.root },
					{ title: 'civil', gate: 'talk_toolbox_show', path: PATH_DASHBOARD.toolboxTalks.civil },
					{ title: 'electrical', gate: 'talk_toolbox_show', path: PATH_DASHBOARD.toolboxTalks.electrical },
					{ title: 'mechanical', gate: 'talk_toolbox_show', path: PATH_DASHBOARD.toolboxTalks.mechanical },
					{ title: 'workshop', gate: 'talk_toolbox_show', path: PATH_DASHBOARD.toolboxTalks.camp },
					{ title: 'office', gate: 'talk_toolbox_show', path: PATH_DASHBOARD.toolboxTalks.office },
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
					{ title: 'create', gate: 'inventory_create', path: PATH_DASHBOARD.ppe.new },
					{ title: 'list', gate: 'inventory_show', path: PATH_DASHBOARD.ppe.root },
					{ title: 'report', path: PATH_DASHBOARD.ppe.report },
					{ title: 'report list', path: PATH_DASHBOARD.ppe.reportList }
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
				gate: 'folder_show',
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
