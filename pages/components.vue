<template>
  <div>
    <div class="block mb-25">
      <h2 class="mb-4 font-bold text-4xl"># Buttons</h2>
      <div class="flex">
        <t-button class="mr-3" :disabled="isDisabled" @click="toggleDisabled">Default button</t-button>
        <t-button class="mr-3" variant="white" :disabled="isDisabled" @click="toggleDisabled">White button</t-button>
        <t-button class="mr-3" variant="indigo" :disabled="isDisabled" @click="toggleDisabled">Indigo button</t-button>
        <t-button class="mr-3" variant="danger" :disabled="isDisabled" @click="toggleDisabled">Danger button</t-button>
        <t-button variant="link" :disabled="isDisabled" @click="toggleDisabled">Link button</t-button>
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
      <h2 class="mb-4 font-bold text-4xl"># Checkbox</h2>
      <t-checkbox class="block">Like</t-checkbox>
      <t-checkbox class="block">Super like</t-checkbox>
    </div>

    <div class="block mb-25">
      <h2 class="mb-4 font-bold text-4xl"># Radio</h2>
      <t-radio class="block" name="radio">Like</t-radio>
      <t-radio class="block" name="radio">Dislike</t-radio>
    </div>

    <div class="block mb-25">
      <h2 class="mb-4 font-bold text-4xl"># Modal</h2>
      <div class="flex">
        <t-button class="mr-2" @click="$modal.show('default')">Default modal</t-button>
        <t-button variant="danger" @click="$modal.show('danger')">Danger modal</t-button>
      </div>
      <t-modal name="default" header="Header" footer="Footer" @closed="$modal.hide('default')">Content</t-modal>
      <t-modal name="danger" header="Header" footer="Footer" variant="danger" @closed="$modal.hide('danger')">Content</t-modal>
    </div>

    <div class="block mb-25">
      <h2 class="mb-4 font-bold text-4xl"># Avatar</h2>
      <div class="flex">
        <Avatar class="mr-5" :user="user" size="small" />
        <Avatar class="mr-5" :user="user" size="medium" />
        <Avatar class="mr-5" :user="user" size="large" />
        <Avatar :user="user" size="extraLarge" />
      </div>
    </div>

    <div class="block mb-25">
      <h2 class="mb-4 font-bold text-4xl"># Progress bar</h2>
      <ProgressBar value="0" />
      <ProgressBar value="30" />
      <ProgressBar value="60" />
      <ProgressBar value="100" />
      <ProgressBar value="100" text="hundred percent" />
    </div>

    <div class="block mb-25">
      <h2 class="mb-4 font-bold text-4xl"># User info</h2>
      <div class="p-4 rounded bg-white w-1/7">
        <UserInfo :user="$auth.$state.user" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Example',
  data () {
    return {
      isDisabled: false,
    }
  },
  computed: {
    ...mapGetters({ user: 'getUserData' }),
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
