export default [
  {
    path : '/',
    title: 'Home',
    icon : 'home',
  },
  {
    path    : '/team',
    title   : 'Team',
    icon    : 'users',
    disabled: true,
  },
  {
    path    : '/authenticator',
    title   : '2FA',
    icon    : 'fingerprint',
    disabled: true,
  },
  {
    path    : '/short-url',
    title   : 'Short URL',
    icon    : 'link',
    disabled: true,
  },
  {
    path : '/bots/vk',
    title: 'VK Bot',
    icon : ['fab', 'vk'],
  },
  {
    path    : '/bots/discord',
    title   : 'DIS Bot',
    icon    : ['fab', 'discord'],
    disabled: true,
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
    path    : '/metrics',
    title   : 'Metrics',
    icon    : 'chart-bar',
    disabled: true,
  },
  {
    path    : '/settings',
    title   : 'Settings',
    icon    : 'cog',
    disabled: true,
  },
]
