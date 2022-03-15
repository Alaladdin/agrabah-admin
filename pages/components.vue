<template>
  <div>
    <div class="block mb-25">
      <b-button class="mb-10" text="Toggle disabled state" @click="toggleDisabled" />

      <h2 class="mb-4 font-bold text-4xl"># Button</h2>
      <div class="flex">
        <b-button class="mr-3" text="Default button" :disabled="isDisabled" />
        <b-button class="mr-3" text="Before icon" before-icon="dragon" :disabled="isDisabled" />
        <b-button class="mr-3" text="After icon" after-icon="dragon" :disabled="isDisabled" />
        <b-button class="mr-3" text="White button" variant="white" :disabled="isDisabled" />
        <b-button class="mr-3" text="Indigo button" variant="indigo" :disabled="isDisabled" />
        <b-button class="mr-3" text="Danger button" variant="danger" :disabled="isDisabled" />
        <b-button text="Link button" variant="link" :disabled="isDisabled" />
      </div>
    </div>

    <div class="block mb-25 space-y-4">
      <h2 class="font-bold text-4xl"># Input</h2>
      <b-input class="w-full" value="Default" placeholder="Default" :disabled="isDisabled" />
      <b-input class="w-full" value="Danger" placeholder="Danger" variant="danger" :disabled="isDisabled" />
      <b-input class="w-full" value="Success" placeholder="Success" variant="success" :disabled="isDisabled" />
      <b-input class="w-full" value="Label" label="Label" :disabled="isDisabled" />
    </div>

    <div class="block mb-25">
      <h2 class="mb-4 font-bold text-4xl"># Textarea</h2>
      <div>
        <t-textarea placeholder="textarea" :disabled="isDisabled" />
      </div>
    </div>

    <div class="block mb-25">
      <h2 class="mb-4 font-bold text-4xl"># Select</h2>
      <t-select :options="['Bloom', 'Musa', 'Stella', 'Aisha', 'Daphne', 'Flora', 'Tecna', 'Roxy']" :disabled="isDisabled">Choose...</t-select>
    </div>

    <div class="block mb-25">
      <h2 class="mb-4 font-bold text-4xl"># Checkbox</h2>
      <b-checkbox v-model="checkbox1Value" class="block">Like</b-checkbox>
      <b-checkbox v-model="checkbox2Value" class="block">Super like</b-checkbox>
      <b-checkbox class="block" checked disabled>Disabled checked</b-checkbox>
      <b-checkbox class="block" disabled>Disabled unchecked</b-checkbox>
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
      <h2 class="mb-4 font-bold text-4xl"># Modal</h2>
      <div class="flex">
        <b-button class="mr-2" @click="$modal.show('default')">Default modal</b-button>
        <b-button variant="danger" @click="$modal.show('danger')">Danger modal</b-button>
      </div>
      <t-modal name="default" header="Header" footer="Footer" @closed="$modal.hide('default')">Content</t-modal>
      <t-modal name="danger" header="Header" footer="Footer" variant="danger" @closed="$modal.hide('danger')">Content</t-modal>
    </div>

    <div class="block mb-25">
      <h2 class="mb-4 font-bold text-4xl"># Avatar</h2>
      <div class="flex">
        <b-avatar class="mr-5" :url="user.avatar" size="extraSmall" />
        <b-avatar class="mr-5" :url="user.avatar" size="small" />
        <b-avatar class="mr-5" :url="user.avatar" size="medium" />
        <b-avatar class="mr-5" :url="user.avatar" size="large" />
        <b-avatar :url="user.avatar" size="extraLarge" />
      </div>
    </div>

    <div class="block mb-25">
      <h2 class="mb-4 font-bold text-4xl"># Progress bar</h2>
      <b-progress-bar value="0" />
      <b-progress-bar value="30" />
      <b-progress-bar value="60" />
      <b-progress-bar value="100" />
      <b-progress-bar value="100" text="hundred percent" />
    </div>

    <div class="block mb-25">
      <h2 class="mb-4 font-bold text-4xl"># User info</h2>
      <div class="p-4 rounded bg-white w-1/7">
        <b-user-info :user="$auth.$state.user" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'example',
  data () {
    return {
      checkbox1Value: true,
      checkbox2Value: false,
      isDisabled    : false,
    }
  },
  computed: {
    ...mapGetters({ user: 'getUserData' }),
  },
  methods: {
    toggleDisabled () {
      this.isDisabled = !this.isDisabled
    },
  },
}
</script>
