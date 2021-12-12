/**
 * plain: true - default "from-to" value
 * html: true - insert value as html
 * valueGetter() - custom value
 * title only - no popup
 * no key - render field key as title
 *
 * # NOTES
 * don't use plain: true with html: true
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
  },
}
