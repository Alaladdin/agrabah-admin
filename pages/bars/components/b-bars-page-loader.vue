<template>
  <div class="relative w-full animate-pulse">
    <div class="absolute w-full h-full bg-gradient-to-b from-transparent to-gray-200" />

    <div class="bars__table !shadow-none rounded w-full bg-white">
      <div
        v-for="i in plugsCounts.rows"
        :key="i"
        class="bars__table-row"
      >
        <div class="bars__table-row__header flex justify-center items-center !py-4">
          <div class="rounded-full w-20 h-3 bg-purple-300" />
        </div>

        <div
          v-for="k in plugsCounts.semesterMarks + plugsCounts.finalMarks"
          :key="k"
          class="bars__table-row__mark flex justify-center !py-4"
          :class="`bars__table-row__mark--${k <= plugsCounts.semesterMarks ? 'semester' : 'final'}`"
        >
          <div class="rounded-full w-25 h-3 bg-purple-100" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'b-bars-page-loader',
  data: () => ({
    plugsCounts: {
      rows         : 10,
      semesterMarks: 4,
      finalMarks   : 3,
    },
  }),
}
</script>
