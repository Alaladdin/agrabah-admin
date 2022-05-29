<template>
  <div class="space-y-25 mb-25">
    <b-button class="mb-10 !w-max" text="Toggle disabled state" @click="toggleDisabled" />

    <div class="space-y-10">
      <div class="space-y-4">
        <h2 class="font-bold text-4xl"># Button</h2>
        <div class="flex space-x-3">
          <b-button text="Default button" :disabled="isDisabled" />
          <b-button text="White button" variant="white" :disabled="isDisabled" />
          <b-button text="Indigo button" variant="indigo" :disabled="isDisabled" />
          <b-button text="Danger button" variant="danger" :disabled="isDisabled" />
          <b-button text="Link button" variant="link" :disabled="isDisabled" />
        </div>
      </div>

      <div class="space-y-4">
        <h3 class="mb-4 font-bold text-2xl">— With color</h3>

        <div class="flex space-x-3">
          <b-button text="With color" color="#fff" :disabled="isDisabled" />
          <b-button text="With color" color="#14b8a6" variant="white" :disabled="isDisabled" />
        </div>
      </div>

      <div class="space-y-4">
        <h3 class="mb-4 font-bold text-2xl">— With icon</h3>

        <div class="flex space-x-3">
          <b-button text="Before icon" before-icon="dragon" :disabled="isDisabled" />
          <b-button text="After icon" after-icon="dragon" :disabled="isDisabled" />
        </div>
      </div>
    </div>

    <div class="space-y-4">
      <h2 class="font-bold text-4xl"># Input</h2>
      <b-input v-model="inputValue" placeholder="No label" :disabled="isDisabled" />
      <b-input v-model="inputValue" label="Auto placeholder" :disabled="isDisabled" />
      <b-input v-model="inputValue" label="Danger via object" :variant="{ 'danger': !inputValue }" :disabled="isDisabled" />
      <b-input v-model="inputValue" label="Default" placeholder="Default" :disabled="isDisabled" />
      <b-input v-model="inputValue" label="Danger" placeholder="Danger" variant="danger" :disabled="isDisabled" />
      <b-input v-model="inputValue" label="Success" placeholder="Success" variant="success" :disabled="isDisabled" />
      <b-input v-model="inputValue" label="Required" :disabled="isDisabled" required />
    </div>

    <div>
      <h2 class="mb-4 font-bold text-4xl"># Textarea</h2>
      <t-textarea placeholder="textarea" :disabled="isDisabled" />
    </div>

    <div class="space-y-4">
      <h2 class="font-bold text-4xl"># Select</h2>
      <div class="space-x-4">
        <b-select
          v-model="selectVariant"
          :options="buttonVariants"
          :variant="selectVariant !== 'default' ? selectVariant : ''"
          :disabled="isDisabled"
        />
      </div>
    </div>

    <div class="space-y-4">
      <h2 class="font-bold text-4xl"># Dropdown</h2>

      <div class="flex items-center space-x-4">
        <b-dropdown
          v-for="variant in buttonVariants"
          :key="variant.value"
          text="Choose"
          :options="winxOptions"
          :variant="variant.value !== 'default' ? variant.value : ''"
          :disabled="isDisabled"
        />
      </div>
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
        <b-avatar :user="user" size="extraSmall" />
        <b-avatar :user="user" size="small" />
        <b-avatar :user="user" size="medium" />
        <b-avatar :user="user" size="large" />
        <b-avatar :user="user" size="extraLarge" />
      </div>
    </div>

    <div>
      <h2 class="mb-4 font-bold text-4xl"># User info</h2>
      <div class="p-4 rounded-lg w-max bg-white">
        <b-user-info :user="user" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import BUserInfo from '@/components/b-user-info'
import BAvatar from '@/components/b-avatar'
import BButton from '@/components/b-button'
import BCheckbox from '@/components/b-checkbox'
import BDropdown from '@/components/b-dropdown'
import BInput from '@/components/b-input'
import BSelect from '@/components/b-select'
import { getOptionsFromFlatArray } from '@/helpers'

const winxPersons = ['Bloom', 'Musa', 'Stella', 'Aisha', 'Daphne', 'Flora', 'Tecna', 'Roxy']
const buttonVariants = ['default', 'white', 'indigo', 'danger', 'link']

export default {
  name      : 'components',
  components: {
    'b-input'    : BInput,
    'b-select'   : BSelect,
    'b-dropdown' : BDropdown,
    'b-checkbox' : BCheckbox,
    'b-button'   : BButton,
    'b-avatar'   : BAvatar,
    'b-user-info': BUserInfo,
  },
  data: () => ({
    inputValue      : '',
    selectVariant   : 'default',
    buttonVariants  : getOptionsFromFlatArray(buttonVariants),
    winxOptions     : getOptionsFromFlatArray(winxPersons),
    checkbox1Value  : true,
    checkbox2Value  : false,
    progressBarValue: 15,
    isDisabled      : false,
  }),
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
