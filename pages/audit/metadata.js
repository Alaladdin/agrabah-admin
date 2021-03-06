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
  changesInfo: {
    actualitySection: {
      title   : 'Act. Section',
      getRoute: () => ({ name: 'actuality' }),
      created : {
        title      : 'created',
        valueGetter: change => change.name,
      },
      deleted: {
        title      : 'deleted',
        valueGetter: change => change.name,
      },
      name: {
        title: 'name',
        plain: true,
      },
    },
    actuality: {
      title   : 'Actuality',
      getRoute: (change) => {
        if (!change.changedId) return null

        return {
          name  : 'actuality/actualityId',
          params: { actualityId: change.changedId },
        }
      },
      created: {
        title      : 'created',
        valueGetter: change => change.name,
      },
      deleted: {
        title      : 'deleted',
        valueGetter: change => change.name,
      },
      name: {
        title: 'name',
        plain: true,
      },
      data: {
        title: 'content',
        plain: true,
      },
    },
  },
}
