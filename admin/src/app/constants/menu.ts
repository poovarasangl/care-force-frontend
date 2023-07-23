export interface IMenuItem {
	id?: string;
	icon?: string;
	label: string;
	to: string;
	newWindow?: boolean;
	subs?: IMenuItem[];
}
const data: IMenuItem[] = [
	{
		id: 'dashboards',
		icon: 'iconsminds-shop-4',
		label: 'menu.dashboards',
		to: '/app/dashboards',
	},
	// {
	// 	id: 'administrator',
	// 	icon: 'iconsminds-administrator',
	// 	label: 'Administrator',
	// 	to: '/app/administrator',
	// 	subs: [{
	// 		icon: 'iconsminds-business-man',
	// 		id: 'pages-authorization',
	// 		label: 'AdminList',
	// 		to: '/app/administrator/mainadminlist',
	// 	},
	// 	{
	// 		icon: 'iconsminds-male-2',
	// 		id: 'pages-authorization',
	// 		label: 'Sub AdminList',
	// 		to: '/app/administrator/subadminlist',
	// 	}
	// 	]
	// },
	{
		id: 'agency',
		icon: 'iconsminds-user',
		label: 'Agency',
		to: '/app/agency',
		subs: [{
			icon: 'iconsminds-mens',
			id: 'pages-authorization',
			label: 'Agency List',
			to: '/app/agency/list',
		},
		{
			icon: 'iconsminds-male',
			id: 'pages-authorization',
			label: 'Add New Agency',
			to: '/app/agency/add',
		}
		]
	},
	{
		id: 'caregiver',
		icon: 'simple-icon-people',
		label: 'Caregivers',
		to: '/app/experts/',
		subs: [{
			icon: 'iconsminds-mens',
			id: 'pages-authorization',
			label: 'Caregiver List',
			to: '/app/experts/taskers/taskerlist',
		},
		{
			icon: 'iconsminds-male',
			id: 'pages-authorization',
			label: 'Add New caregiver',
			to: '/app/experts/addnewtasker',
		},
		{
			icon: 'iconsminds-file-clipboard',
			id: 'pages-authorization',
			label: 'Document List',
			to: '/app/experts/document/documentlist',
		},{
			icon: 'iconsminds-blinklist',
			id: 'pages-authorization',
			label: 'Experience List',
			to: '/app/expertsmanagement/experiencelist',
		},
		{
			icon: 'simple-icon-list',
			id: 'pages-authorization',
			label: 'Questions List',
			to: '/app/expertsmanagement/questionslist',
		},
		]
	},

	{
		id: 'categories',
		icon: 'simple-icon-list',
		label: 'Categories',
		to: '/app/categories',
		subs: [
		// 	{
		// 	icon: 'simple-icon-options',
		// 	id: 'pages-authorization',
		// 	label: 'Main Categories',
		// 	to: '/app/categories/mainlist',
		// },
		{
			icon: 'simple-icon-options-vertical',
			id: 'pages-authorization',
			label: 'Categories',
			to: '/app/categories/sublist',
		}
		]
	},
	{
		id: 'jobs',
		icon: 'iconsminds-file-clipboard-file---text',
		label: 'Jobs',
		to: '/app/jobs',
		subs: [{
			icon: 'iconsminds-files',
			id: 'pages-authorization',
			label: 'All Jobs',
			to: '/app/jobs/all-jobs',
		},
		{
			icon: 'iconsminds-file-clipboard',
			id: 'pages-authorization',
			label: 'Ongoing Jobs',
			to: '/app/jobs/ongoing',
		},
		{
			icon: 'iconsminds-file-edit',
			id: 'pages-authorization',
			label: 'Payment Pending Jobs',
			to: '/app/jobs/paymentpending',
		},
		{
			icon: 'iconsminds-file-zip',
			id: 'pages-authorization',
			label: 'Completed Jobs',
			to: '/app/jobs/completed',
		},
		{
			icon: 'iconsminds-delete-file',
			id: 'pages-authorization',
			label: 'Cancelled Jobs',
			to: '/app/jobs/cancelled',
		},
		// {
		// 	icon: 'iconsminds-clock-back',
		// 	id: 'pages-authorization',
		// 	label: 'Expired Jobs',
		// 	to: '/app/jobs/expired',
		// },
		]
	},
	{
		id: 'settings',
		icon: 'simple-icon-settings',
		label: 'Settings',
		to: '/app/settings',
		subs: [{
			icon: 'simple-icon-menu',
			id: 'pages-authorization',
			label: 'General',
			to: '/app/settings/general',
		},
		{
			icon: 'simple-icon-compass',
			label: 'SEO',
			to: '/app/settings/seo',
		},
		{
			icon: 'simple-icon-key',
			label: 'SMTP',
			to: '/app/settings/smtp',
		},
		{
			icon: 'simple-icon-social-google',
			label: 'Social Network',
			to: '/app/settings/socialnetwork',
		},
		{
			icon: 'iconsminds-mail-money',
			label: 'Currencies',
			to: '/app/settings/currencies',
		},
		{
			icon: 'iconsminds-library',
			label: 'Languages',
			to: '/app/settings/languages',
		},
		{
			icon: 'iconsminds-folder-delete',
			label: 'Cancellation',
			to: '/app/settings/cancellation',
		},
		{
			icon: 'iconsminds-brush',
			label: 'Appearance',
			to: '/app/settings/appearance',
		},
		{
			icon: 'iconsminds-post-mail',
			label: 'Post Header',
			to: '/app/settings/postheader',
		},
		{
			icon: 'simple-icon-screen-smartphone',
			label: 'Mobile',
			to: '/app/settings/mobile',
		},
		{
			icon: 'iconsminds-firewall',
			id: 'pages-authorization',
			label: 'Payment Gateway',
			to: '/app/gateway/paymentgateway',
		},
		{
			icon: 'iconsminds-mail-photo',
			id: 'pages-authorization',
			label: 'SMS Gateway',
			to: '/app/gateway/smsgateway',
		}
		]
	},


	// {
	// 	id: 'gateway',
	// 	icon: 'iconsminds-wallet',
	// 	label: 'Gateway',
	// 	to: '/app/gateway/',
	// 	subs: [{
	// 		icon: 'iconsminds-firewall',
	// 		id: 'pages-authorization',
	// 		label: 'Payment Gateway',
	// 		to: '/app/gateway/paymentgateway',
	// 	},
	// 	{
	// 		icon: 'iconsminds-mail-photo',
	// 		id: 'pages-authorization',
	// 		label: 'SMS Gateway',
	// 		to: '/app/gateway/smsgateway',
	// 	}
	// 	]
	// },
	// {
	// 	id: 'earnings',
	// 	icon: 'iconsminds-money-bag',
	// 	label: 'Earnings',
	// 	to: '/app/earnings',
	// 	subs: [{
	// 		icon: 'iconsminds-mail-money',
	// 		id: 'pages-authorization',
	// 		label: 'Earning List',
	// 		to: '/app/earnings/earninglist',
	// 	},
	// 	{
	// 		icon: 'iconsminds-file-clipboard',
	// 		id: 'pages-authorization',
	// 		label: 'Payout List',
	// 		to: '/app/earnings/payoutlist',
	// 	}
	// 	]
	// },
	{
		id: 'coupons',
		icon: 'iconsminds-gift-box',
		label: 'Coupons',
		to: '/app/coupons',
		subs: [{
			icon: 'iconsminds-billing',
			id: 'pages-authorization',
			label: 'Coupon List',
			to: '/app/coupons/list',
		},
		{
			icon: 'iconsminds-folder-add--',
			id: 'pages-authorization',
			label: 'Add New Coupon',
			to: '/app/coupons/add',
		}
		]
	},
	{
		id: 'Pages',
		icon: 'iconsminds-digital-drawing',
		label: 'Pages',
		to: '/app/site-page',
		subs: [{
			icon: 'iconsminds-digital-drawing',
			label: 'All Pages',
			to: '/app/site-page/allpages'
		},
		{
			icon: 'iconsminds-pen',
			label: 'Add New Page',
			to: '/app/site-page/addpage'
		},
		{
			icon: 'iconsminds-add-file',
			label: 'Add Translate Page',
			to: '/app/site-page/addtranslate'
		}
		]
	},

	{
		id: 'email',
		icon: 'iconsminds-mail-gallery',
		label: 'Email Template & Push Notifications',
		to: '/app/email-template',
		subs: [{
			icon: 'iconsminds-mailbox-full',
			id: 'pages-authorization',
			label: 'Email Template List',
			to: '/app/email-template/list',
		},
		{
			icon: 'iconsminds-mail-reply',
			id: 'pages-authorization',
			label: 'Add New Email Teamplate',
			to: '/app/email-template/add',
		},{
			icon: 'iconsminds-user',
			label: 'Users',
			to: '/app/pushnotifications/users'
		  },
		 {
			icon: 'simple-icon-people',
			label: 'Experts',
			to: '/app/pushnotifications/experts'
		  },
		  {
			icon: 'iconsminds-box-full',
			label: 'Templates',
			to: '/app/pushnotifications/templates'
		  },
		]
	},
	// {
	// 	id: 'push-notifications',
	// 	icon: 'simple-icon-rocket',
	// 	label: 'Push Notifications',
	// 	to: '/app/pushnotifications',
	// 	subs: [{
	// 		icon: 'iconsminds-user',
	// 		label: 'Users',
	// 		to: '/app/pushnotifications/users'
	// 	  },
	// 	 {
	// 		icon: 'simple-icon-people',
	// 		label: 'Experts',
	// 		to: '/app/pushnotifications/experts'
	// 	  },
	// 	  {
	// 		icon: 'iconsminds-box-full',
	// 		label: 'Templates',
	// 		to: '/app/pushnotifications/templates'
	// 	  },
	// 	]
	// },
	{
		id: 'Subscribers',
		icon: 'iconsminds-file-edit',
		label: 'Subscribers',
		to: '/app/subscribers/list',
	},
	// {
	// 	id: 'payment-price',
	// 	icon: 'simple-icon-credit-card',
	// 	label: 'Payment Price',
	// 	to: '/app/paymentsprice',
	// 	subs: [{
	// 		icon: 'iconsminds-credit-card-3',
	// 		id: 'pages-authorization',
	// 		label: 'Payment Price List',
	// 		to: '/app/paymentsprice/list',
	// 	},
		
	// 	]
	// },
	// {
	// 	id: 'expertsmanagement',
	// 	icon: 'simple-icon-people',
	// 	label: 'Expert Management',
	// 	to: '/app/expertsmanagement/',
	// 	subs: [{
	// 		icon: 'iconsminds-blinklist',
	// 		id: 'pages-authorization',
	// 		label: 'Experience List',
	// 		to: '/app/expertsmanagement/experiencelist',
	// 	},
	// 	{
	// 		icon: 'simple-icon-list',
	// 		id: 'pages-authorization',
	// 		label: 'Questions List',
	// 		to: '/app/expertsmanagement/questionslist',
	// 	},
	// 	]
	// },
	// {
	// 	id: 'people-comments',
	// 	icon: 'iconsminds-business-mens',
	// 	label: 'People Comments',
	// 	to: '/app/peoplecomments',
	// 	subs: [{
	// 		icon: 'iconsminds-business-man-woman',
	// 		id: 'pages-authorization',
	// 		label: 'People Comments List',
	// 		to: '/app/peoplecomments/list',
	// 	},
	// 	]
	// },
	{
		id: 'contactus',
		icon: 'iconsminds-old-telephone',
		label: 'Contact Us',
		to: '/app/contact/contact-us',
	},
	{
		id: 'reviews',
		icon: 'iconsminds-file-edit',
		label: 'Reviews',
		to: '/app/reviews/list',
	}

];
export default data;