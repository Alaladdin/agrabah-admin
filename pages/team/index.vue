<template>
  <div class="team">
    <b-team-page-loader v-if="isLoading" />

    <div v-if="!isLoading && data" class="grid grid-cols-2 gap-4">
      <b-team-item
        v-for="user in data"
        :key="user._id"
        :user="user"
      />
    </div>
  </div>
</template>

<script>
import BTeamPageLoader from './components/b-team-page-loader'
import PageDefaultMixin from '@/mixins/m-page-default'
import BTeamItem from '@/pages/team/components/b-team-item'

export default {
  name      : 'team',
  components: {
    'b-team-item'       : BTeamItem,
    'b-team-page-loader': BTeamPageLoader,
  },
  mixins: [PageDefaultMixin('team')],
}
</script>
