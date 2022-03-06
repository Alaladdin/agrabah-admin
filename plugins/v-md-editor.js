import Vue from 'vue'
import Prism from 'prismjs'
import VueMarkdownEditor from '@kangc/v-md-editor'
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js'
import enLang from '@kangc/v-md-editor/lib/lang/en-US'

import 'prismjs/components/prism-json'
import '@kangc/v-md-editor/lib/style/base-editor.css'
import '@kangc/v-md-editor/lib/theme/style/vuepress.css'

VueMarkdownEditor.lang.use('en-US', enLang)
VueMarkdownEditor.use(vuepressTheme, { Prism })

Vue.use(VueMarkdownEditor)
