import moment from 'moment'
import { formatDate } from '@/helpers'

const todayFormatted = formatDate()

export default {
  periodsList: ['day', 'week', 'month'],
  statsInfo  : {
    cpuUsage: {
      title      : 'CPU usage',
      icon       : 'microchip',
      valueGetter: value => value + '%',
    },
    memoryUsage: {
      title      : 'Memory usage',
      icon       : 'memory',
      valueGetter: value => value + 'mb',
    },
    restartsCount: {
      title      : 'Restarts count',
      icon       : 'arrow-rotate-right',
      valueGetter: value => value,
    },
    uptime: {
      title      : 'Uptime',
      icon       : 'clock',
      valueGetter: value => value,
    },
    lastCommitDate: {
      title      : 'Last commit',
      icon       : 'calendar',
      valueGetter: value => value ? formatDate(value, 'DD.MM.YY') : '—',
    },
  },
  periodDates: {
    day: {
      start : todayFormatted,
      finish: todayFormatted,
    },
    week: {
      start : formatDate(moment().subtract(7, 'days')),
      finish: todayFormatted,
    },
    month: {
      start : formatDate(moment().subtract(30, 'days')),
      finish: todayFormatted,
    },
  },
  themesOptions: [
    { title: 'purple', value: 'purple', color: '#8b5cf6' },
    { title: 'indigo', value: 'indigo', color: '#6366f1' },
    { title: 'teal', value: 'teal', color: '#14b8a6' },
    { title: 'cyan', value: 'cyan', color: '#06b6d4' },
    { title: 'pink', value: 'pink', color: '#ec4899' },
    { title: 'lime', value: 'lime', color: '#84cc16' },
    { title: 'yellow', value: 'yellow', color: '#f59e0b' },
    { title: 'stone', value: 'stone', color: '#78716c' },
    { title: 'gray', value: 'gray', color: '#6b7280' },
  ],
}
