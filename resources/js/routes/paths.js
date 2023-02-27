// ----------------------------------------------------------------------

function path (root, sublink) {
	return `${root}${sublink}`;
}

const ROOTS_AUTH = '/';
const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
	root: ROOTS_AUTH,
	login: path(ROOTS_AUTH, '/login'),
	register: path(ROOTS_AUTH, '/register'),
	loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
	registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
	verify: path(ROOTS_AUTH, '/verify'),
	resetPassword: path(ROOTS_AUTH, '/reset-password'),
	newPassword: path(ROOTS_AUTH, '/new-password'),
};

export const PATH_PAGE = {
	comingSoon: '/coming-soon',
	maintenance: '/maintenance',
	pricing: '/pricing',
	payment: '/payment',
	about: '/about-us',
	contact: '/contact-us',
	faqs: '/faqs',
	page403: '/403',
	page404: '/404',
	page500: '/500',
	components: '/components',
};

export const PATH_DASHBOARD = {
	root: ROOTS_DASHBOARD,
	kanban: path(ROOTS_DASHBOARD, '/kanban'),
	calendar: path(ROOTS_DASHBOARD, '/calendar'),
	permissionDenied: path(ROOTS_DASHBOARD, '/permission-denied'),
	blank: path(ROOTS_DASHBOARD, '/blank'),

	general: {
		employee: path(ROOTS_DASHBOARD, '/employees'),
		inventory: path(ROOTS_DASHBOARD, '/inventory'),
		hse_dashboard: path(ROOTS_DASHBOARD, '/hse-dashboard'),
		// banking: path(ROOTS_DASHBOARD, '/banking'),
		// booking: path(ROOTS_DASHBOARD, '/booking'),
		file: path(ROOTS_DASHBOARD, '/file'),
	},
	mail: {
		root: path(ROOTS_DASHBOARD, '/mail'),
		all: path(ROOTS_DASHBOARD, '/mail/all'),
	},
	chat: {
		root: path(ROOTS_DASHBOARD, '/chat'),
		new: path(ROOTS_DASHBOARD, '/chat/new'),
		view: (name) => path(ROOTS_DASHBOARD, `/chat/${name}`),
	},
	user: {
		root: path(ROOTS_DASHBOARD, '/user/profile'),
		new: path(ROOTS_DASHBOARD, '/user/new'),
		list: path(ROOTS_DASHBOARD, '/user/list'),
		cards: path(ROOTS_DASHBOARD, '/user/cards'),
		profile: path(ROOTS_DASHBOARD, '/user/profile'),
		account: path(ROOTS_DASHBOARD, '/user/settings'),
		edit: (id) => path(ROOTS_DASHBOARD, `/user/${id}/edit`),
	},
	employee: {
		root: path(ROOTS_DASHBOARD, '/employee/list'),
		new: path(ROOTS_DASHBOARD, '/employee/new'),
		edit: (id) => path(ROOTS_DASHBOARD, `/employee/${id}/edit`),
		view: (id) => path(ROOTS_DASHBOARD, `/employee/${id}`),
	},
	position: {
		root: path(ROOTS_DASHBOARD, '/position/list'),
		new: path(ROOTS_DASHBOARD, '/position/new'),
		edit: (id) => path(ROOTS_DASHBOARD, `/position/${id}/edit`),
	},
	department: {
		root: path(ROOTS_DASHBOARD, '/department/list'),
		new: path(ROOTS_DASHBOARD, '/department/new'),
		edit: (id) => path(ROOTS_DASHBOARD, `/department/${id}/edit`),
	},
	company: {
		root: path(ROOTS_DASHBOARD, '/company/list'),
		new: path(ROOTS_DASHBOARD, '/company/new'),
		edit: (id) => path(ROOTS_DASHBOARD, `/company/${id}/edit`),
	},
	ppe: {
		root: path(ROOTS_DASHBOARD, '/ppe/list'),
		new: path(ROOTS_DASHBOARD, '/ppe/new'),
		view: (name) => path(ROOTS_DASHBOARD, `/ppe/product/${name}`),
		edit: (name) => path(ROOTS_DASHBOARD, `/ppe/product/${name}/edit`),
		update: (name) => path(ROOTS_DASHBOARD, `/ppe/product/${name}/update`),
		addRemoveStock: (id) => path(ROOTS_DASHBOARD, `/ppe/product/add-remove-stock/${id}`),
	},

	training: {
		root: path(ROOTS_DASHBOARD, '/training'),
		induction: path(ROOTS_DASHBOARD, '/training/induction'),
		inHouse: path(ROOTS_DASHBOARD, '/training/in-house'),
		client: path(ROOTS_DASHBOARD, '/training/client'),
		thirdParty: path(ROOTS_DASHBOARD, '/training/third-party'),
		new: (type) => path(ROOTS_DASHBOARD, `/training/new?type=${type || 2}`),
	},

	// Toolbox Talks
	toolboxTalks: {
		root: path(ROOTS_DASHBOARD, '/toolbox-talks/all'),
		view: (id) => path(ROOTS_DASHBOARD, `/toolbox-talks/${id}/view`),
		new: (type) => type ? path(ROOTS_DASHBOARD, `/toolbox-talks/new?type=${type}`) : path(ROOTS_DASHBOARD, '/toolbox-talks/new?type=1'),
		edit: (id) => path(ROOTS_DASHBOARD, `/toolbox-talks/${id}/edit`),
		civil: path(ROOTS_DASHBOARD, '/toolbox-talks/civil'),
		electrical: path(ROOTS_DASHBOARD, '/toolbox-talks/electrical'),
		mechanical: path(ROOTS_DASHBOARD, '/toolbox-talks/mechanical'),
		camp: path(ROOTS_DASHBOARD, '/toolbox-talks/workshop'),
		office: path(ROOTS_DASHBOARD, '/toolbox-talks/office'),
		report: path(ROOTS_DASHBOARD, '/toolbox-talks/report'),
		statistic: path(ROOTS_DASHBOARD, '/toolbox-talks/statistic'),
	},

	// Incident
	incident: {
		root: path(ROOTS_DASHBOARD, '/incident'),
		firstAid: path(ROOTS_DASHBOARD, '/incident/first-aid'),
		investigation: path(ROOTS_DASHBOARD, '/incident/investigation'),
		incidentReport: path(ROOTS_DASHBOARD, '/incident/incident-report'),
	},


	inspection: {
		root: path(ROOTS_DASHBOARD, '/inspection'),
		new: path(ROOTS_DASHBOARD, '/inspection/new'),
		safetyObservation: path(ROOTS_DASHBOARD, '/inspection/site'),
		list: path(ROOTS_DASHBOARD, '/inspection/site/list'),
		report: path(ROOTS_DASHBOARD, '/inspection/site/report'),
		machineries: path(ROOTS_DASHBOARD, '/inspection/machineries'),
		toolsAndEquipments: path(ROOTS_DASHBOARD, '/inspection/tools-and-equipments'),
		edit: (id) => path(ROOTS_DASHBOARD, `/inspection/${id}/edit`),
		review: (id) => path(ROOTS_DASHBOARD, `/inspection/${id}/review`),
		verify: (id) => path(ROOTS_DASHBOARD, `/inspection/${id}/verify`),
	},

	fileManager: {
		root: path(ROOTS_DASHBOARD, '/file-manager'),
		view: (id) => path(ROOTS_DASHBOARD, `/file-manager/${id}`),
		edit: (id) => path(ROOTS_DASHBOARD, `/file-manager/${id}/edit`),
		newDocument: (folderId) => path(ROOTS_DASHBOARD, `/file-manager/${folderId}/new`),
		viewDocument: (folderId, documentId) => path(ROOTS_DASHBOARD, `/file-manager/view?folder=${folderId}&document=${documentId}`),
		actionDocument: (documentId) => path(ROOTS_DASHBOARD, `/file-manager/document/${documentId}/action`),
		addComment: (documentId) => path(ROOTS_DASHBOARD, `/file-manager/document/${documentId}/add-comment`),
		replyComment: (commentId) => path(ROOTS_DASHBOARD, `/file-manager/document/${commentId}/reply-comment`),
		deleteComment: (commentId) => path(ROOTS_DASHBOARD, `/file-manager/document/${commentId}/delete-comment`),
	},

	// invoice: {
	// 	root: path(ROOTS_DASHBOARD, '/invoice'),
	// 	list: path(ROOTS_DASHBOARD, '/invoice/list'),
	// 	new: path(ROOTS_DASHBOARD, '/invoice/new'),
	// 	view: (id) => path(ROOTS_DASHBOARD, `/invoice/${id}`),
	// 	edit: (id) => path(ROOTS_DASHBOARD, `/invoice/${id}/edit`),
	// 	demoEdit: path(ROOTS_DASHBOARD, '/invoice/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1/edit'),
	// 	demoView: path(ROOTS_DASHBOARD, '/invoice/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5'),
	// },
	// blog: {
	// 	root: path(ROOTS_DASHBOARD, '/blog'),
	// 	posts: path(ROOTS_DASHBOARD, '/blog/posts'),
	// 	new: path(ROOTS_DASHBOARD, '/blog/new'),
	// 	view: (title) => path(ROOTS_DASHBOARD, `/blog/post/${title}`),
	// 	demoView: path(ROOTS_DASHBOARD, '/blog/post/apply-these-7-secret-techniques-to-improve-event'),
	// },
};

export const PATH_DOCS = {
	root: 'https://docs.minimals.cc',
	changelog: 'https://docs.minimals.cc/changelog',
};

export const PATH_ZONE_ON_STORE = 'https://mui.com/store/items/zone-landing-page/';

export const PATH_MINIMAL_ON_STORE = 'https://mui.com/store/items/minimal-dashboard/';

export const PATH_FREE_VERSION = 'https://mui.com/store/items/minimal-dashboard-free/';

export const PATH_FIGMA_PREVIEW =
	'https://www.figma.com/file/OBEorYicjdbIT6P1YQTTK7/%5BPreview%5D-Minimal-Web.15.10.22?node-id=0%3A1';
