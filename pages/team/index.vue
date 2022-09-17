<template>
  <div class="team">
    <b-team-page-loader v-if="isLoading" />

    <template v-if="data && !isLoading">
      <b-button class="flex self-end mb-5" text="Refresh" variant="white" @click="refresh" />
      <div class="grid grid-cols-2 gap-4">
        <b-team-item
          v-for="user in data"
          :key="user._id"
          :user="user"
          :activity-info="onlineUsers[user._id]?.activity"
        />
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import BTeamPageLoader from './components/b-team-page-loader'
import PageDefaultMixin from '@/mixins/m-page-default'
import BTeamItem from '@/pages/team/components/b-team-item'
import BButton from '@/components/b-button'

export default {
  name      : 'team',
  components: {
    'b-button'          : BButton,
    'b-team-item'       : BTeamItem,
    'b-team-page-loader': BTeamPageLoader,
  },
  mixins: [PageDefaultMixin('team')],
  data  : () => ({
    clearDataOnDestroy: false,
  }),
  computed: {
    ...mapGetters({ onlineUsers: 'getOnlineUsers' }),
  },
}
</script>
