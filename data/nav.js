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
    name : 'mail',
    title: 'Mail',
    icon : 'envelope',
    scope: 'user',
  },
  {
    groupName  : 'Manage',
    name       : 'team',
    title      : 'Team',
    icon       : 'user-group',
    scope      : 'admin',
    needDivider: true,
  },
  {
    groupName  : 'Development',
    name       : 'components',
    title      : 'Components',
    icon       : 'cubes',
    scope      : 'admin',
    needDivider: true,
  },
  {
    name  : 'user/username',
    title : 'Profile',
    scope : 'user',
    hidden: true,
  },
]
