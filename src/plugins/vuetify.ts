/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { adapter } from '@/plugins/i18n'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import { fa } from 'vuetify/iconsets/fa'

import colors from 'vuetify/lib/util/colors.mjs'
// Composables
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { VBtn } from 'vuetify/components/VBtn'
import { VTreeview } from 'vuetify/labs/VTreeview'
const theme = {
  options: {
    customProperties: true
  },
  defaultTheme: 'light',
  themes: {
    light: {
      dark: false,
      colors: {
        primary: colors.blue.darken2,
        secondary: colors.grey.darken1,
        accent: colors.blue.darken3,
        error: colors.red.accent2,
        info: colors.blue.darken1,
        success: colors.green.base,
        warning: colors.orange.darken2,
        anchor: colors.blue.base,
        loader: colors.blue.lighten3,
        primaryiconbtn: colors.orange.darken3,
        secondaryiconbtn: colors.shades.white,
        addbtn: colors.green.base,
        requiredfield: colors.red.base,
        textcolor: colors.grey.darken4,
        inactiveitem: colors.grey.darken1,
        textwithbackground: colors.shades.white
      }
    },
    dark: {
      dark: true,
      colors: {
        primary: colors.blue.base,
        secondary: colors.grey.darken1,
        accent: colors.blue.darken3,
        error: colors.red.accent2,
        info: colors.blue.darken1,
        success: colors.green.base,
        warning: colors.orange.darken2,
        anchor: colors.blue.base,
        loader: colors.blue.lighten3,
        primaryiconbtn: colors.orange.darken3,
        secondaryiconbtn: colors.shades.white,
        addbtn: colors.green.base,
        requiredfield: colors.red.base,
        textcolor: colors.shades.white,
        inactiveitem: colors.grey.lighten1,
        textwithbackground: colors.shades.white
      }
    }
  }
}

const opts = {
  locale: {
    adapter
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
      fa
    }
  },
  theme,
  components: {
    ...components,
    VTreeview
  },
  directives,
  aliases: {
    VBtnPrimary: VBtn,
    VBtnSecondary: VBtn,
    VBtnApprove: VBtn,
    VBtnReject: VBtn
  },
  defaults: {
    VAlert: {
      class: 'text-center ma-1',
      density: 'compact'
    },
    VBtnPrimary: {
      class: 'text-textwithbackground',
      variant: 'elevated',
      color: 'primary',
      density: 'comfortable'
    },
    VBtnSecondary: {
      class: 'text-textwithbackground',
      variant: 'elevated',
      color: 'secondary',
      density: 'comfortable'
    },
    VToolbar: {
      class: 'text-textwithbackground',
      color: 'primary',
      density: 'compact'
    },
    VDatePicker: {
      noTitle: true,
      scrollable: true,
      firstDayOfWeek: 1,
      hideHeader: true,
      color: 'primary',
      weekdays: [ 1, 2, 3, 4, 5, 6, 0]
    },
    VPagination: {
      color: 'primary'
    },
    VProgressLinear: {
      color: 'loader',
      indeterminate: true,
      height: 5
    },
    VProgressCircular: {
      color: 'loader',
      indeterminate: true
    },
    VTooltip: {
      location: 'bottom'
    },
    VCheckbox: {
      color: 'primary'
    },
    VSwitch: {
      color: 'primary'
    },
    VSelect: {
      variant: 'underlined',
      density: 'default'
    },
    VTextField: {
      variant: 'underlined',
      density: 'default'
    },
    VCombobox: {
      variant: 'underlined',
      density: 'default'
    },
    VTextarea: {
      variant: 'underlined',
      density: 'default'
    },
    VSnackbar: {
      variant: 'flat',
      location: 'top',
      multiLine: true,
      VBtn: {
        color: 'red',
        variant: 'tonal',
        density: 'comfortable'
      }
    },
    VCardActions: {
      VBtnPrimary: {
        variant: 'elevated',
        color: 'primary',
        density: 'comfortable'
      },

      VBtnApprove: {
        variant: 'elevated',
        color: 'success',
        density: 'comfortable'
      },
      VBtnReject: {
        variant: 'elevated',
        color: 'warning',
        density: 'comfortable'
      },
      VBtn: {
        variant: 'elevated',
        color: 'primary',
        density: 'comfortable'
      }
    },
    VTabs: {
      mobileBreakPoint: 400,
      grow: true,
      alignTabs: 'title',
      density: 'compact',
      bgColor: 'primary',
      VTab: {
        color: 'textwithbackground'
      }
    },
    VCard: {
      VToolbar: {
        flat: true,
        color: 'primary',
        density: 'compact',
        VToolbarTitle: {
          color: 'textwithbackground'
        }
      },
      VBtnSecondary: {
        variant: 'elevated',
        color: 'secondary',
        density: 'comfortable'
      },
      VBtn: {
        variant: 'elevated',
        color: 'primary',
        density: 'comfortable'
      }
    },
    VStepperActions: {
      VBtnPrimary: {
        variant: 'elevated',
        color: 'primary',
        density: 'comfortable'
      },
      VBtnSecondary: {
        variant: 'elevated',
        color: 'secondary',
        density: 'comfortable'
      }
    },
    VMenu: {
      location: 'bottom',
      closeOnContentClick: false,
      offset: 40,
      transition: 'scale-transition',
      contentClass: 'v-sheet',
      persistent: false,
      VCard: {
        VCardActions: {
          VBtnPrimary: {
            class: 'text-primary',
            variant: 'text',
            color: 'primary',
            density: 'comfortable'
          },
          VBtnSecondary: {
            class: 'text-secondary',
            variant: 'text',
            color: 'secondary',
            density: 'comfortable'
          }
        }
      },
      VBtnPrimary: {
        variant: 'text',
        color: 'primary',
        density: 'comfortable'
      },
      VBtnSecondary: {
        variant: 'text',
        color: 'secondary',
        density: 'comfortable'
      }
    }
  }
}
// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify(opts)
