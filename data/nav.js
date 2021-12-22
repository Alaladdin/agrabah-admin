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
    path : '/bots/discord',
    title: 'DIS Bot',
    icon : ['fab', 'discord'],
    scope: ['admin'],
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
    path : '/audit',
    title: 'Audit',
    icon : 'history',
    scope: ['admin'],
  },
  {
    path    : '/metrics',
    title   : 'Metrics',
    icon    : 'chart-bar',
    scope   : ['admin'],
    disabled: true,
  },
  {
    path : '/components',
    title: 'Components Example',
    icon : 'cubes',
    scope: ['admin'],
  },
]
