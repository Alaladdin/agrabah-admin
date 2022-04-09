<template>
  <client-only>
    <t-dropdown :disabled="disabled">
      <template #default="{ hide: closeDropdown }">
        <div @click="closeDropdown">
          <div
            v-for="option in options"
            :key="option.value"
            class="dropdown__item"
            @click="onInput(option.value)"
          >
            <span
              v-if="option.color"
              class="inline-block mr-2 rounded w-2 h-2"
              :style="{ backgroundColor: option.color }"
            />
            <span>{{ option.title }}</span>
          </div>
        </div>
      </template>

      <template #trigger="{ mousedownHandler, blurHandler }">
        <b-button
          :class="buttonClass"
          :text="text"
          :color="color"
          :variant="variant"
          type="button"
          after-icon="caret-down"
          :disabled="disabled"
          @mousedown="mousedownHandler"
          @blur="blurHandler"
        />
      </template>
    </t-dropdown>

    <template #placeholder>
      <b-button
        :text="text"
        :color="color"
        :variant="variant"
        type="button"
        after-icon="caret-down"
        :disabled="disabled"
      />
    </template>
  </client-only>
</template>

<script>
import BButton from '@/components/b-button'

export default {
  name      : 'b-dropdown',
  components: {
    'b-button': BButton,
  },
  props: {
    text: {
      type   : String,
      default: '',
    },
    color: {
      type   : String,
      default: '',
    },
    options: {
      type   : Array,
      default: () => ([]),
    },
    buttonClass: {
      type   : String,
      default: '',
    },
    variant: {
      type   : String,
      default: '',
    },
    disabled: {
      type   : Boolean,
      default: false,
    },
  },
  methods: {
    onInput (value) {
      this.$emit('input', value)
    },
  },
}
</script>
