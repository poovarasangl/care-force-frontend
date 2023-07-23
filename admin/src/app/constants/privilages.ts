export interface PrivilagesData {
	alias?: string;
	icon?: string;
	name: string;
	state: string;
	childs?: PrivilagesData[];
	status?: { add: boolean, edit: boolean, view: boolean, delete: boolean };
}
const data: PrivilagesData[] = [
	{
		alias: 'administrators',
		icon: 'iconsminds-administrator',
		name: 'Administrator',
		state: '/app/administrator',
		childs: [{
			alias: 'pages-authorization',
			icon: 'simple-icon-key',
			name: 'AdminList',
			state: '/app/administrator/mainadminlist',
		},
		{
			icon: 'simple-icon-key',
			name: 'Sub AdminList',
			state: '/app/administrator/subadminlist',
		}
		],
		status: {
			add: false,
			edit: false,
			view: false,
			delete: false
		}
	},
	{
		alias: 'agency',
		icon: 'iconsminds-user',
		name: 'Agency',
		state: '/app/agency',
		childs: [{
			alias: 'pages-authorization',
			name: 'Agency List',
			state: '/app/agency/list',
		},
		{
			alias: 'pages-authorization',
			name: 'Add New Agency',
			state: '/app/agency/add',
		}
		],
		status: {
			add: false,
			edit: false,
			view: false,
			delete: false
		}
	},
	{
		alias: 'tasker',
		icon: 'simple-icon-people',
		name: 'Experts',
		state: '/app/experts/',
		childs: [{
			alias: 'pages-authorization',
			name: 'Expert List',
			state: '/app/experts/taskers/taskerlist',
		},
		{
			alias: 'pages-authorization',
			name: 'Add New Expert',
			state: '/app/experts/addnewtasker',
		},
		{
			alias: 'pages-authorization',
			name: 'Document List',
			state: '/app/experts/document/documentlist',
		}
		],
		status: {
			add: false,
			edit: false,
			view: false,
			delete: false
		}
	},
	{
		alias: 'tasker_management',
		icon: 'simple-icon-people',
		name: 'Experts Management',
		state: '/app/expertsmanagement/',
		childs: [{
			alias: 'pages-authorization',
			name: 'Experience List',
			state: '/app/expertsmanagement/experiencelist',
		},
		{
			alias: 'pages-authorization',
			name: 'Questions List',
			state: '/app/expertsmanagement/questionslist',
		}
		],
		status: {
			add: false,
			edit: false,
			view: false,
			delete: false
		}
	},
	{
		alias: 'categories',
		icon: 'simple-icon-list',
		name: 'Categories',
		state: '/app/categories',
		childs: [{
			alias: 'pages-authorization',
			name: 'Maincategories List',
			state: '/app/categories/mainlist',
		},
		{
			alias: 'pages-authorization',
			name: 'Subcategories List',
			state: '/app/categories/sublist',
		}
		],
		status: {
			add: false,
			edit: false,
			view: false,
			delete: false
		}
	},
	{
		alias: 'newsletter',
		icon: 'iconsminds-file-edit',
		name: 'childscribers',
		state: '/app/childscribers/list',
		status: {
			add: false,
			edit: false,
			view: false,
			delete: false
		}
	},
	{
		alias: 'settings',
		icon: 'simple-icon-settings',
		name: 'settings',
		state: '/app/settings',
		childs: [{
			alias: 'pages-authorization',
			name: 'General',
			state: '/app/settings/general',
		},
		{
			name: 'SEO',
			state: '/app/settings/seo',
		},
		{
			name: 'SMTP',
			state: '/app/settings/smtp',
		},
		{
			name: 'Social Network',
			state: '/app/settings/socialnetwork',
		},
		{
			name: 'Currencies',
			state: '/app/settings/currencies',
		},
		{
			name: 'Languages',
			state: '/app/settings/languages',
		},
		{
			name: 'Cancellation',
			state: '/app/settings/cancellation',
		},
		{
			name: 'Appearance',
			state: '/app/settings/appearance',
		},
		{
			name: 'Post Header',
			state: '/app/settings/postheader',
		},
		{
			name: 'Mobile',
			state: '/app/settings/mobile',
		}
		],
		status: {
			add: false,
			edit: false,
			view: false,
			delete: false
		}
	},
	{
		alias: 'coupons',
		icon: 'iconsminds-gift-box',
		name: 'Coupons',
		state: '/app/coupons',
		childs: [{
			alias: 'pages-authorization',
			name: 'Coupon List',
			state: '/app/coupons/list',
		},
		{
			alias: 'pages-authorization',
			name: 'Add Coupon',
			state: '/app/coupons/add',
		}
		],
		status: {
			add: false,
			edit: false,
			view: false,
			delete: false
		}
	},
	{
		alias: 'earnings',
		icon: 'iconsminds-money-bag',
		name: 'Earnings',
		state: '/app/earnings',
		childs: [{
			alias: 'pages-authorization',
			name: 'Earning List',
			state: '/app/earnings/earninglist',
		},
		{
			alias: 'pages-authorization',
			name: 'Payout List',
			state: '/app/earnings/payoutlist',
		}
		],
		status: {
			add: false,
			edit: false,
			view: false,
			delete: false
		}
	},

	{
		alias: 'payment',
		icon: 'simple-icon-wallet',
		name: 'Gateway',
		state: '/app/gateway/',
		childs: [{
			alias: 'pages-authorization',
			name: 'Payment Gateway',
			state: '/app/gateway/paymentgateway',
		},
		{
			alias: 'pages-authorization',
			name: 'Sms Gateway',
			state: '/app/gateway/smsgateway',
		}
		],
		status: {
			add: false,
			edit: false,
			view: false,
			delete: false
		}
	},
	{
		alias: 'page',
		icon: 'iconsminds-digital-drawing',
		name: 'site-pages',
		state: '/app/site-page',
		childs: [{
			icon: 'iconsminds-digital-drawing',
			name: 'All Pages List',
			state: '/app/site-page/allpages'
		},
		{
			icon: 'iconsminds-digital-drawing',
			name: 'Add new page',
			state: '/app/site-page/addpage'
		},
		{
			icon: 'iconsminds-digital-drawing',
			name: 'Add Translate page',
			state: '/app/site-page/addtranslate'
		}
		],
		status: {
			add: false,
			edit: false,
			view: false,
			delete: false
		}
	},
	{
		alias: 'etemplate',
		icon: 'iconsminds-mail-gallery',
		name: 'Email Template',
		state: '/app/emailtemplates',
		childs: [{
			icon: 'iconsminds-mailbox-full',
			name: 'Template List',
			state: '/app/emailtemplates/templatelist'
		},
		{
			icon: 'iconsminds-mail-open',
			name: 'Add Translate Template',
			state: '/app/emailtemplates/addtemplate'
		}
		],
		status: {
			add: false,
			edit: false,
			view: false,
			delete: false
		}
	},
	{
		alias: 'notification',
		icon: 'simple-icon-rocket',
		name: 'Push Notifications',
		state: '/app/pushnotifications',
		childs: [{
			icon: 'iconsminds-user',
			name: 'Users',
			state: '/app/pushnotifications/users'
		},
		{
			icon: 'simple-icon-people',
			name: 'Experts',
			state: '/app/pushnotifications/experts'
		},
		{
			icon: 'iconsminds-box-full',
			name: 'Templates',
			state: '/app/pushnotifications/templates'
		},
		],
		status: {
			add: false,
			edit: false,
			view: false,
			delete: false
		}
	},
	{
		alias: 'contact',
		icon: 'iconsminds-old-telephone',
		name: 'ContactUs',
		state: '/app/contact/contact-us',
		status: {
			add: false,
			edit: false,
			view: false,
			delete: false
		}
	},
	{
		alias: 'reviews',
		icon: 'iconsminds-file-edit',
		name: 'Reviews',
		state: '/app/reviews/list',
		status: {
			add: false,
			edit: false,
			view: false,
			delete: false
		}
	}

];
export default data;