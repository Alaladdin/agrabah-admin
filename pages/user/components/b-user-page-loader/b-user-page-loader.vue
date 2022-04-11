<template>
  <div class="b-user-page-loader">
    <div class="b-user-page-loader__avatar animate-pulse" />
    <div class="b-user-page-loader__username badge">
      <p class="animate-pulse rounded h-3 w-30 bg-gray-200" />
    </div>

    <div class="b-user-page-loader__fields">
      <div v-for="field in 3" :key="field" class="options !py-4">
        <p v-for="fieldItem in 2" :key="fieldItem" class="animate-pulse rounded h-3 w-30 bg-gray-200" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'b-user-page-loader',
}
</script>

<style lang='scss'>
@import 'b-user-page-loader';
</style>
