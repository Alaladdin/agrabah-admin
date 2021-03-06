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
    name  : 'actuality/actualityId',
    title : 'Actuality',
    hidden: true,
  },
  {
    name : 'schedule',
    title: 'Schedule',
    icon : 'calendar-days',
  },
  {
    name : 'bars',
    title: 'Bars',
    icon : 'book',
    scope: 'user',
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
    name  : 'user/username',
    title : 'Profile',
    scope : 'user',
    hidden: true,
  },
]
