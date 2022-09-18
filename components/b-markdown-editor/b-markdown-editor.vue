<template>
  <div class="b-markdown-editor">
    <div v-if="editable" class="b-markdown-editor__bar">
      <b-button
        class="b-markdown-editor__bar-button"
        :class="{ 'active': currentVariant === 'edit' }"
        title="Editor only"
        before-icon="code"
        variant="link"
        @click="changeVariant('edit')"
      />
      <b-button
        class="b-markdown-editor__bar-button"
        :class="{ 'active': currentVariant === 'preview' }"
        title="Preview only"
        before-icon="eye"
        variant="link"
        @click="changeVariant('preview')"
      />
      <b-button
        class="b-markdown-editor__bar-button"
        :class="{ 'active': !currentVariant }"
        title="Editor and preview"
        before-icon="table-columns"
        variant="link"
        @click="changeVariant(null)"
      />
    </div>

    <div class="w-full h-full" :class="{ 'pb-7': editable, 'b-markdown-editor__columns': !currentVariant }">
      <textarea
        v-if="currentVariant !== 'preview'"
        :class="['b-markdown-editor__editor', { 'disabled': disabled }]"
        :value="value"
        :placeholder="placeholder"
        :autofocus="!!$attrs.autofocus"
        :disabled="disabled"
        @input="onInput"
      />
      <div
        v-if="currentVariant !== 'edit'"
        :class="['b-markdown-editor__preview', { 'disabled': disabled }]"
        v-html="markedPreview"
      />
    </div>
  </div>
</template>

<script>
import escape from 'lodash/escape'
import { marked } from 'marked'
import BButton from '@/components/b-button'

export default {
  name      : 'b-markdown-editor',
  components: {
    'b-button': BButton,
  },
  props: {
    value: {
      type   : String,
      default: '',
    },
    placeholder: {
      type   : String,
      default: '',
    },
    editable: {
      type   : Boolean,
      default: true,
    },
    disabled: {
      type   : Boolean,
      default: false,
    },
  },
  data () {
    return {
      currentVariant: this.editable ? null : 'preview',
    }
  },
  computed: {
    markedPreview () {
      return marked.parse(escape(this.value))
    },
  },
  methods: {
    onInput (e) {
      this.$emit('input', e.target.value)
    },
    changeVariant (variant) {
      this.currentVariant = variant
    },
  },
}
</script>

<style lang='scss'>
@import 'b-markdown-editor';
</style>
