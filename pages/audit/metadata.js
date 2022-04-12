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
      title      : 'process managed',
      html       : true,
      valueGetter: (data) => {
        const onlineClass = data.enable ? '#14b8a6' : '#dc2626'
        const onlineText = data.enable ? 'turned on' : 'turned off'
        const link = `<a href='/metrics/${data.processName}' class='text-indigo-500'>${data.title || data.processName}</a>`

        return `
        <div>
          <div><strong>Process:</strong> ${link}</div>
          <div><strong>Status:</strong> <span style="color: ${onlineClass}">${onlineText}</span></div>
        </div>
        `
      },
    },
  },
}
