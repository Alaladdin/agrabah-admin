export default [
  {
    name : 'index',
    title: 'Home',
    icon : 'house',
  },
  {
    name : 'actuality',
    title: 'Actuality',
    icon : 'newspaper',
  },
  {
    name : 'schedule',
    title: 'Schedule',
    icon : 'calendar-days',
  },
  {
    name : 'bots/vk',
    title: 'VK Bot',
    icon : ['fab', 'vk'],
    scope: 'admin',
  },
  {
    name : 'short-url',
    title: 'Short URL',
    icon : 'link',
    scope: 'user',
  },
  {
    title   : 'Options',
    scope   : 'admin',
    children: [
      {
        name : 'team',
        title: 'Team',
        icon : 'user-group',
      },
      {
        name : 'audit',
        title: 'Audit',
        icon : 'clock-rotate-left',
      },
      {
        name : 'metrics',
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
        name : 'components',
        title: 'Components',
        icon : 'cubes',
      },
    ],
  },
  {
    name  : 'metrics/processName',
    title : 'Stats',
    scope : 'admin',
    hidden: true,
  },
  {
    name  : 'user/username',
    title : 'Profile',
    scope : 'user',
    hidden: true,
  },
]
