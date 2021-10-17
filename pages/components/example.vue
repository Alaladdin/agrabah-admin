<template>
  <div>
    <div class="block mb-25">
      <h2 class="mb-4 font-bold text-4xl"># Buttons</h2>
      <div class="flex">
        <t-button class="mr-3" :disabled="isDisabled" @click="toggleDisabled">Default button</t-button>
        <t-button class="mr-3" variant="white" :disabled="isDisabled" @click="toggleDisabled">White button</t-button>
        <t-button class="mr-3" variant="indigo" :disabled="isDisabled" @click="toggleDisabled">Indigo button</t-button>
        <t-button class="mr-3" variant="blue" :disabled="isDisabled" @click="toggleDisabled">Blue button</t-button>
        <t-button variant="danger" :disabled="isDisabled" @click="toggleDisabled">Danger button</t-button>
      </div>
    </div>

    <div class="block mb-25">
      <h2 class="mb-4 font-bold text-4xl"># Textarea</h2>
      <t-textarea placeholder="textarea" :disabled="isDisabled" />
    </div>

    <div class="block mb-25">
      <h2 class="mb-4 font-bold text-4xl"># Alert</h2>
      <t-alert class="mb-3" :dismissible="false" show>Not dismissible</t-alert>
      <t-alert class="mb-3" show>Default alert</t-alert>
      <t-alert class="mb-3" variant="warn" show>Warn alert</t-alert>
      <t-alert class="mb-3" variant="danger" show>Danger alert</t-alert>
      <t-alert variant="success" show>Success alert</t-alert>
    </div>

    <div class="block mb-25">
      <h2 class="mb-4 font-bold text-4xl"># Select</h2>
      <t-select :options="['Bloom', 'Musa', 'Stella', 'Aisha', 'Daphne', 'Flora', 'Tecna', 'Roxy']" :disabled="isDisabled">Choose...</t-select>
    </div>

    <div class="block mb-25">
      <h2 class="mb-4 font-bold text-4xl"># Input</h2>
      <t-input class="w-full mb-3" value="Default" placeholder="Default" :disabled="isDisabled" />
      <t-input class="w-full mb-3" value="Danger" placeholder="Danger" variant="danger" :disabled="isDisabled" />
      <t-input class="w-full" value="Success" placeholder="Success" variant="success" :disabled="isDisabled" />
    </div>

    <div class="block mb-25">
      <h2 class="mb-4 font-bold text-4xl"># Radio</h2>
      <t-radio class="block" value="Default">Like</t-radio>
      <t-radio class="block" value="Default">Dislike</t-radio>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Example',
  data () {
    return {
      isDisabled: false,
    }
  },
  methods: {
    toggleDisabled () {
      this.isDisabled = true

      setTimeout(() => {
        this.isDisabled = false
      }, 7000)
    },
  },
}
</script>
