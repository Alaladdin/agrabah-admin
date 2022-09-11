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
    groupName  : 'Manage',
    name       : 'team',
    title      : 'Team',
    icon       : 'user-group',
    scope      : 'admin',
    needDivider: true,
  },
  {
    name : 'audit',
    title: 'Audit',
    icon : 'clock-rotate-left',
    scope: 'admin',
  },
  {
    name    : 'api-key',
    title   : 'Api Keys',
    icon    : 'key',
    disabled: true,
    scope   : 'owner',
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
