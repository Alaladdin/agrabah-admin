<template>
  <div class="space-y-25 mb-25">
    <div>
      <b-button class="mb-10" text="Toggle disabled state" @click="toggleDisabled" />

      <h2 class="mb-4 font-bold text-4xl"># Button</h2>
      <div class="flex space-x-3">
        <b-button text="Default button" :disabled="isDisabled" />
        <b-button text="Before icon" before-icon="dragon" :disabled="isDisabled" />
        <b-button text="After icon" after-icon="dragon" :disabled="isDisabled" />
        <b-button text="White button" variant="white" :disabled="isDisabled" />
        <b-button text="Indigo button" variant="indigo" :disabled="isDisabled" />
        <b-button text="Danger button" variant="danger" :disabled="isDisabled" />
        <b-button text="Link button" variant="link" :disabled="isDisabled" />
      </div>
    </div>

    <div class="space-y-4">
      <h2 class="font-bold text-4xl"># Input</h2>
      <b-input value="Default" label="Label" placeholder="Default" :disabled="isDisabled" />
      <b-input value="Danger" placeholder="Danger" variant="danger" :disabled="isDisabled" />
      <b-input value="Success" placeholder="Success" variant="success" :disabled="isDisabled" />
    </div>

    <div>
      <h2 class="mb-4 font-bold text-4xl"># Textarea</h2>
      <t-textarea placeholder="textarea" :disabled="isDisabled" />
    </div>

    <div class="space-y-4">
      <h2 class="font-bold text-4xl"># Select</h2>
      <t-select :options="['Bloom', 'Musa', 'Stella', 'Aisha', 'Daphne', 'Flora', 'Tecna', 'Roxy']" :disabled="isDisabled">Choose...</t-select>
    </div>

    <div class="space-y-4 space-x-2">
      <h2 class="font-bold text-4xl"># Dropdown</h2>
      <b-dropdown text="Choose..." :disabled="isDisabled">
        <div>Item 1</div>
        <div>Item 2</div>
      </b-dropdown>

      <b-dropdown text="Choose..." variant="white" :disabled="isDisabled">
        <div>Item 1</div>
        <div>Item 2</div>
      </b-dropdown>

      <b-dropdown text="Choose..." variant="indigo" :disabled="isDisabled">
        <div>Item 1</div>
        <div>Item 2</div>
      </b-dropdown>

      <b-dropdown text="Choose..." variant="danger" :disabled="isDisabled">
        <div>Item 1</div>
        <div>Item 2</div>
      </b-dropdown>

      <b-dropdown text="Choose..." variant="link" :disabled="isDisabled">
        <div>Item 1</div>
        <div>Item 2</div>
      </b-dropdown>
    </div>

    <div>
      <h2 class="mb-4 font-bold text-4xl"># Checkbox</h2>
      <b-checkbox v-model="checkbox1Value" class="block">Like</b-checkbox>
      <b-checkbox v-model="checkbox2Value" class="block">Super like</b-checkbox>
      <b-checkbox class="block" checked disabled>Disabled checked</b-checkbox>
      <b-checkbox class="block" disabled>Disabled unchecked</b-checkbox>
    </div>

    <div class="space-y-3">
      <h2 class="mb-4 font-bold text-4xl"># Alert</h2>
      <t-alert :dismissible="false" show>Not dismissible</t-alert>
      <t-alert show>Default alert</t-alert>
      <t-alert variant="warn" show>Warn alert</t-alert>
      <t-alert variant="danger" show>Danger alert</t-alert>
      <t-alert variant="success" show>Success alert</t-alert>
    </div>

    <div>
      <h2 class="mb-4 font-bold text-4xl"># Modal</h2>
      <div class="flex">
        <b-button class="mr-2" @click="$modal.show('default')">Default modal</b-button>
        <b-button variant="danger" @click="$modal.show('danger')">Danger modal</b-button>
      </div>
      <t-modal name="default" header="Header" footer="Footer" @closed="$modal.hide('default')">Content</t-modal>
      <t-modal name="danger" header="Header" footer="Footer" variant="danger" @closed="$modal.hide('danger')">Content</t-modal>
    </div>

    <div>
      <h2 class="mb-4 font-bold text-4xl"># Avatar</h2>
      <div class="flex space-x-5">
        <b-avatar :url="user.avatar" size="extraSmall" />
        <b-avatar :url="user.avatar" size="small" />
        <b-avatar :url="user.avatar" size="medium" />
        <b-avatar :url="user.avatar" size="large" />
        <b-avatar :url="user.avatar" size="extraLarge" />
      </div>
    </div>

    <div>
      <h2 class="mb-4 font-bold text-4xl"># User info</h2>
      <div class="p-4 rounded-lg w-max bg-white">
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
    ...mapGetters({ user: 'user/getUserData' }),
  },
  methods: {
    toggleDisabled () {
      this.isDisabled = !this.isDisabled
    },
  },
}
</script>
