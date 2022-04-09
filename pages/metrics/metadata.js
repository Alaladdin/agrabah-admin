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
    requestsAvgLatency: {
      title      : 'Requests latency (avg)',
      valueGetter: value => value + 'ms',
    },
    requestsCount: {
      title: 'Requests count',
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
}
