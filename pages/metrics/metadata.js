import { formatDate } from '@/helpers'

export default {
  statsInfo: {
    cpuUsage: {
      title      : 'CPU usage',
      icon       : 'microchip',
      valueGetter: value => value + '%',
    },
    memoryUsage: {
      title      : 'Memory usage',
      icon       : 'memory',
      valueGetter: value => value + ' mb',
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
      valueGetter: value => formatDate(value, 'DD.MM'),
    },
    requestsAvgLatency: {
      title      : 'Requests latency (avg)',
      valueGetter: value => value + 'ms',
    },
    requestsCount: {
      title      : 'Requests count',
      valueGetter: value => value + 'ms',
    },
  },
}
