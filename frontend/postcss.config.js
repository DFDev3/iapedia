export default {
  plugins: {
    'postcss-nesting': {},
    'tailwindcss/nesting': {}, // Add this BEFORE tailwindcss
    tailwindcss: {},
    autoprefixer: {},
  },
}