export default [
  {
    path : '/',
    title: 'Home',
    icon : 'home',
  },
  {
    path : '/actuality',
    title: 'Actuality',
    icon : 'bell',
  },
  {
    path : '/schedule',
    title: 'Schedule',
    icon : 'calendar-alt',
  },
  {
    path : '/bots/vk',
    title: 'VK Bot',
    icon : ['fab', 'vk'],
    scope: ['admin'],
  },
  {
    path    : '/bots/discord',
    title   : 'DIS Bot',
    icon    : ['fab', 'discord'],
    scope   : ['admin'],
    disabled: true,
  },
  {
    path    : '/authenticator',
    title   : '2FA',
    icon    : 'fingerprint',
    scope   : ['user'],
    disabled: true,
  },
  {
    path    : '/short-url',
    title   : 'Short URL',
    icon    : 'link',
    scope   : ['user'],
    disabled: true,
  },
  {
    path : '/team',
    title: 'Team',
    scope: ['admin'],
    icon : 'users',
  },
  {
    path    : '/audit',
    title   : 'Audit',
    icon    : 'history',
    scope   : ['admin'],
    disabled: true,
  },
  {
    path    : '/metrics',
    title   : 'Metrics',
    icon    : 'chart-bar',
    scope   : ['admin'],
    disabled: true,
  },
  {
    path    : '/settings',
    title   : 'Settings',
    icon    : 'cog',
    scope   : ['admin'],
    disabled: true,
  },
]
