export default [
  {
    path : '/',
    title: 'Home',
    icon : 'house',
  },
  {
    path : '/actuality',
    title: 'Actuality',
    icon : 'newspaper',
  },
  {
    path : '/schedule',
    title: 'Schedule',
    icon : 'calendar-days',
  },
  {
    path : '/bots/vk',
    title: 'VK Bot',
    icon : ['fab', 'vk'],
    scope: 'admin',
  },
  {
    path    : '/short-url',
    title   : 'Short URL',
    icon    : 'link',
    scope   : 'user',
    disabled: true,
  },
  {
    path    : '/juice-rating',
    title   : 'Orange juice rating',
    icon    : 'star',
    scope   : 'user',
    disabled: true,
  },
  {
    title   : 'Options',
    scope   : 'admin',
    children: [
      {
        path : '/team',
        title: 'Team',
        icon : 'user-group',
      },
      {
        path : '/audit',
        title: 'Audit',
        icon : 'clock-rotate-left',
      },
      {
        path : '/metrics',
        title: 'Metrics',
        icon : 'chart-line',
      },
    ],
  },
  {
    title   : 'Dev',
    scope   : 'admin',
    children: [
      {
        path : '/components',
        title: 'Components',
        icon : 'cubes',
      },
    ],
  },
  {
    path  : '/me',
    title : 'Profile',
    scope : 'user',
    hidden: true,
  },
]
