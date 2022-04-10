/**
 * plain: true - default "from-to" value
 * html: true - insert value as html
 * valueGetter() - custom value
 * title only - no popup
 * no key - render field key as title
 *
 * # NOTES
 * don't use "plain: true" with "html: true"
 */

export default {
  fieldsInfo: {
    content: {
      title: 'main actuality',
      plain: true,
    },
    lazyContent: {
      title: 'lazy actuality',
      plain: true,
    },
    processToggled: {
      title      : 'Process managed',
      html       : true,
      valueGetter: (data) => {
        const onlineClass = data.enable ? '#14b8a6' : '#dc2626'

        return `
        <div>
          <div><strong>Process:</strong> ${data.title || data.processName}</div>
          <div><strong>Enabled:</strong> <span style="color: ${onlineClass}">${data.enable}</span></div>
        </div>
        `
      },
    },
  },
}
