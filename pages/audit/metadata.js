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

import { find } from 'lodash'
import { vkChats } from '@/data'

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
    vkMessage: {
      title      : 'Message sent via VK bot',
      html       : true,
      valueGetter: (data) => {
        const chat = find(vkChats, { chatId: data.chatId }) || {}

        return `
        <div>
          <div><strong>Chat:</strong>${chat.title || 'unknown'}</div>
          <div><strong>Message:</strong>${data.message}</div>
        </div>
        `
      },
    },
  },
}
