// src/theme.js
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

export const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#1976D2',
          secondary: '#424242',
          background: '#F5F5F5',
          surface: '#FFFFFF',
          accent: '#FF6F00',
          success: '#4CAF50',
          warning: '#FFC107',
          error: '#D32F2F',
          'text-primary': '#212121',
          'text-secondary': '#757575'
        }
      },
      dark: {
        dark: true,
        colors: {
          primary: '#90CAF9',
          secondary: '#BDBDBD',
          background: '#121212',
          surface: '#1E1E1E',
          accent: '#FFAB40',
          success: '#81C784',
          warning: '#FFD54F',
          error: '#E57373',
          'text-primary': '#E0E0E0',
          'text-secondary': '#BDBDBD'
        }
      }
    }
  }
})
