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
			{ title: 'inventory', path: PATH_DASHBOARD.general.inventory, icon: ICONS.ecommerce, disabled: true },
			// { title: 'banking', path: PATH_DASHBOARD.general.banking, icon: ICONS.banking },
			// { title: 'booking', path: PATH_DASHBOARD.general.booking, icon: ICONS.booking },
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
					{ title: 'camp', path: PATH_DASHBOARD.toolboxTalks.camp },
					{ title: 'office', path: PATH_DASHBOARD.toolboxTalks.office },
					{ title: 'report', path: PATH_DASHBOARD.toolboxTalks.report },
				]
			},

			// PPE
			{
				title: 'PPE',
				path: PATH_DASHBOARD.ppe.root,
				icon: ICONS.cart,
				children: [
					{ title: 'shop', path: PATH_DASHBOARD.ppe.shop, disabled: true },
					{ title: 'product', path: PATH_DASHBOARD.ppe.demoView, disabled: true },
					{ title: 'list', path: PATH_DASHBOARD.ppe.list, disabled: true },
					{ title: 'create', path: PATH_DASHBOARD.ppe.new, disabled: true },
					{ title: 'edit', path: PATH_DASHBOARD.ppe.demoEdit, disabled: true },
					{ title: 'checkout', path: PATH_DASHBOARD.ppe.checkout, disabled: true },
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

			// INVOICE
			// {
			// 	title: 'invoice',
			// 	path: PATH_DASHBOARD.invoice.root,
			// 	icon: ICONS.invoice,
			// 	children: [
			// 		{ title: 'list', path: PATH_DASHBOARD.invoice.list },
			// 		{ title: 'details', path: PATH_DASHBOARD.invoice.demoView },
			// 		{ title: 'create', path: PATH_DASHBOARD.invoice.new },
			// 		{ title: 'edit', path: PATH_DASHBOARD.invoice.demoEdit },
			// 	],
			// },

			// BLOG
			// {
			// 	title: 'blog',
			// 	path: PATH_DASHBOARD.blog.root,
			// 	icon: ICONS.blog,
			// 	children: [
			// 		{ title: 'posts', path: PATH_DASHBOARD.blog.posts },
			// 		{ title: 'post', path: PATH_DASHBOARD.blog.demoView },
			// 		{ title: 'create', path: PATH_DASHBOARD.blog.new },
			// 	],
			// },
			{
				title: 'File manager',
				path: PATH_DASHBOARD.fileManager.root,
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

	// DEMO MENU STATES
	// {
	// 	subheader: 'Other cases',
	// 	items: [
	// 		{
	// 			// default roles : All roles can see this entry.
	// 			// roles: ['user'] Only users can see this item.
	// 			// roles: ['admin'] Only admin can see this item.
	// 			// roles: ['admin', 'manager'] Only admin/manager can see this item.
	// 			// Reference from 'src/guards/RoleBasedGuard'.
	// 			title: 'item_by_roles',
	// 			path: PATH_DASHBOARD.permissionDenied,
	// 			icon: ICONS.lock,
	// 			roles: ['admin'],
	// 			caption: 'only_admin_can_see_this_item',
	// 		},
	// 		{
	// 			title: 'menu_level',
	// 			path: '#/dashboard/menu_level',
	// 			icon: ICONS.menuItem,
	// 			children: [
	// 				{
	// 					title: 'menu_level_2a',
	// 					path: '#/dashboard/menu_level/menu_level_2a',
	// 				},
	// 				{
	// 					title: 'menu_level_2b',
	// 					path: '#/dashboard/menu_level/menu_level_2b',
	// 					children: [
	// 						{
	// 							title: 'menu_level_3a',
	// 							path: '#/dashboard/menu_level/menu_level_2b/menu_level_3a',
	// 						},
	// 						{
	// 							title: 'menu_level_3b',
	// 							path: '#/dashboard/menu_level/menu_level_2b/menu_level_3b',
	// 							children: [
	// 								{
	// 									title: 'menu_level_4a',
	// 									path: '#/dashboard/menu_level/menu_level_2b/menu_level_3b/menu_level_4a',
	// 								},
	// 								{
	// 									title: 'menu_level_4b',
	// 									path: '#/dashboard/menu_level/menu_level_2b/menu_level_3b/menu_level_4b',
	// 								},
	// 							],
	// 						},
	// 					],
	// 				},
	// 			],
	// 		},
	// 		{
	// 			title: 'item_disabled',
	// 			path: '#disabled',
	// 			icon: ICONS.disabled,
	// 			disabled: true,
	// 		},

	// 		{
	// 			title: 'item_label',
	// 			path: '#label',
	// 			icon: ICONS.label,
	// 			info: (
	// 				<Label color="info" startIcon={<Iconify icon="eva:email-fill" />}>
	// 					NEW
	// 				</Label>
	// 			),
	// 		},
	// 		{
	// 			title: 'item_caption',
	// 			path: '#caption',
	// 			icon: ICONS.menuItem,
	// 			caption:
	// 				'Quisque malesuada placerat nisl. In hac habitasse platea dictumst. Cras id dui. Pellentesque commodo eros a enim. Morbi mollis tellus ac sapien.',
	// 		},
	// 		{
	// 			title: 'item_external_link',
	// 			path: 'https://www.google.com/',
	// 			icon: ICONS.external,
	// 		},
	// 		{
	// 			title: 'blank',
	// 			path: PATH_DASHBOARD.blank,
	// 			icon: ICONS.blank,
	// 		},
	// 	],
	// },
];

export default navConfig;
