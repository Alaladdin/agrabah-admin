import Vue from 'vue'
import VueTailwind from 'vue-tailwind'
import { TButton, TInput, TInputGroup, TTextarea, TAlert, TSelect, TTag, TCheckbox, TModal } from 'vue-tailwind/dist/components'

const VueTailwindSettings = {
  't-button': {
    component: TButton,
    props    : {
      fixedClasses: 'flex items-center justify-center px-4 py-1 rounded font-semibold text-sm font-sans shadow-sm select-none transition duration-200 ease-in-out focus:outline-none active:ring disabled:pointer-events-none disabled:cursor-default disabled:opacity-60',
      classes     : 'text-white bg-gray-800 hover:bg-gray-900 active:ring-gray-400',
      variants    : {
        icon  : '!p-0 text-gray-600 shadow-none',
        white : 'text-gray-800 bg-white hover:bg-light-400 active:ring-gray-300',
        indigo: 'text-white bg-indigo-500 hover:bg-indigo-600 active:ring-indigo-300',
        danger: 'text-white bg-red-500 hover:bg-red-600 active:ring-red-300',
        link  : '!p-0 text-indigo-500 shadow-none hover:text-indigo-600 active:text-indigo-300 bg-none',
      },
    },
  },
  't-textarea': {
    component: TTextarea,
    props    : {
      fixedClasses: 'px-3 py-2 rounded shadow-sm transition duration-100 ease-in-out focus:outline-none focus:ring focus:ring-indigo-400 focus:ring-opacity-50 disabled:bg-gray-100',
      classes     : 'text-gray-800 placeholder-gray-400 bg-white',
      variants    : {
        danger: 'placeholder-red-400 focus:ring-red-400',
      },
    },
  },
  't-alert': {
    component: TAlert,
    props    : {
      fixedClasses: {
        wrapper  : 'relative flex items-center p-4 border-l-4 rounded shadow-sm',
        body     : 'flex-grow',
        close    : 'relative flex items-center justify-center ml-4 flex-shrink-0 w-6 h-6 transition duration-100 ease-in-out rounded focus:outline-none focus:ring focus:ring-opacity-50',
        closeIcon: 'fill-current h-4 w-4',
      },
      classes: {
        wrapper: 'bg-indigo-50 border-indigo-500',
        body   : 'text-indigo-700',
        close  : 'text-indigo-500 bg-indigo-100 hover:bg-indigo-200 focus:ring-indigo-500',
      },
      variants: {
        warn: {
          wrapper: 'bg-orange-50 border-orange-500',
          body   : 'text-orange-700',
          close  : 'text-orange-500 bg-orange-100 hover:bg-orange-200 focus:ring-orange-500',
        },
        danger: {
          wrapper: 'bg-red-50 border-red-500',
          body   : 'text-red-700',
          close  : 'text-red-500 bg-red-100 hover:bg-red-200 focus:ring-red-500',
        },
        success: {
          wrapper: 'bg-green-50 border-green-500',
          body   : 'text-green-700',
          close  : 'text-green-500 bg-green-100 hover:bg-green-200 focus:ring-green-500',
        },
      },
    },
  },
  't-select': {
    component: TSelect,
    props    : {
      fixedClasses: 'block px-3 py-1.5 transition duration-100 ease-in-out rounded shadow-sm focus:outline-none focus:ring focus:ring-opacity-50 disabled:opacity-50',
      classes     : 'bg-white focus:ring-indigo-400',
    },
  },
  't-tag': {
    component: TTag,
    props    : {
      variants: {
        title   : 'text-3xl leading-8 font-bold text-gray-800 text-center',
        subtitle: 'text-lg leading-6 font-medium text-gray-900',
      },
    },
  },
  't-input': {
    component: TInput,
    props    : {
      fixedClasses: 'px-4 py-2 transition duration-100 ease-in-out border rounded shadow-sm focus:ring focus:outline-none focus:ring-opacity-50 disabled:opacity-50',
      classes     : 'bg-white focus:ring-gray-400',
      variants    : {
        danger : 'border-red-300 bg-red-50 text-red-900 placeholder-red-400 focus:ring-red-400',
        success: 'border-green-300 text-green-900 bg-green-50 placeholder-green-400 focus:ring-green-400',
      },
    },
  },
  't-input-group': {
    component: TInputGroup,
    props    : {
      fixedClasses: {
        label      : 'block mb-1',
        feedback   : 'text-sm text-sm',
        description: 'mt-1 text-sm',
      },
      classes: {
        feedback   : 'text-gray-400',
        description: 'text-gray-400',
      },
      variants: {
        danger: {
          label      : 'text-red-500',
          feedback   : 'text-red-500',
          description: 'text-red-400',
        },
        success: {
          label      : 'text-green-500',
          feedback   : 'text-green-500',
          description: 'text-green-400',
        },
      },
    },
  },
  't-checkbox': {
    component: TCheckbox,
    props    : {
      wrapped     : true,
      fixedClasses: {
        label       : 'ml-1 text-sm text-gray-700',
        inputWrapper: 'inline-flex items-center leading-none',
        wrapper     : 'flex items-center',
      },
    },
  },
  't-modal': {
    component: TModal,
    props    : {
      fixedClasses: {
        overlay  : 'fixed justify-center items-center flex z-40 inset-0 overflow-auto scrolling-touch left-0 top-0 bottom-0 right-0 w-full h-full bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm',
        wrapper  : 'relative mx-auto max-w-1/2 w-full z-50',
        modal    : 'relative rounded overflow-visible shadow',
        header   : 'p-3 border-b-1 rounded-t font-semibold',
        body     : 'px-5 py-7',
        footer   : 'p-3 border-t-1 rounded-b',
        close    : 'flex items-center justify-center rounded-full absolute right-0 top-0 -m-3 h-8 w-8 transition duration-100 ease-in-out focus:outline-none focus:ring focus:ring-opacity-50',
        closeIcon: 'h-4 w-4',
      },
      classes: {
        header: 'border-b-1',
        modal : 'bg-gray-50',
        footer: 'border-t-1',
        close : 'bg-dark-100 text-light-800 hover:bg-dark-200 focus:ring-dark-600',
      },
      variants: {
        danger: {
          header: 'border-red-100 text-red-600',
          modal : 'bg-red-50 text-red-500',
          footer: 'border-red-100 text-red-500',
          close : 'bg-red-200 text-red-700 hover:bg-red-300 focus:ring-red-500',
        },
      },
    },
  },
}

Vue.use(VueTailwind, VueTailwindSettings)
