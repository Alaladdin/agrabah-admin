import { mapActions, mapGetters } from 'vuex'
import { clone } from 'lodash'

export default (storeName) => {
  return {
    data () {
      return {
        data              : null,
        clearDataOnDestroy: true,
        isLoading         : true,
      }
    },
    computed: {
      ...mapGetters(storeName, { inData: 'getData' }),
    },
    watch: {
      inData: {
        immediate: true,
        handler (data) {
          if (!data)
            this.initData()
          else
            this.applyData(data)
        },
      },
    },
    destroyed () {
      if (this.clearDataOnDestroy)
        this.clearData()
    },
    methods: {
      ...mapActions(storeName, ['init']),

      initData () {
        this.beforeInit()
        this.isLoading = true // bad?

        this.init(this.getInitData())
          .then(this.afterInit)
          .catch(this.$handleError)
      },
      beforeInit () {},
      getInitData () {
        return {}
      },
      afterInit () {},
      refresh () {
        this.clearData()
      },
      applyData (data) {
        this.data = this.getPreparedData(data)
        this.isLoading = false
      },
      getPreparedData (data) {
        return clone(data)
      },
      openModal (field) {
        this[field] = true
      },
      closeModal (field) {
        this[field] = false
      },
      clearData () {
        this.$store.commit(`${storeName}/CLEAR_DATA`)
      },
    },
  }
}
