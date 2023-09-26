/** @type {import('tailwindcss').Config} */
export default {
  plugins: [],
  theme: {
    extend: {
      colors: {
        stone: {
          900: '#dee1e3',
          800: '#c3c7cb',
          700: '#a7aeb4', // landing white
          600: '#8c959c',
          500: '#717b84',
          400: '#42484d', // landing bg
          300: '#2a2e32',
          200: '#131516',
          100: '#000000'
        },
        powder: {
          1100: '#eff3f5',
          1000: '#dfe7eb',
          900: '#cfdae2',
          800: '#bfced8', // base bg
          700: '#b0c2ce',
          600: '#90aabb',
          500: '#809eb1',
          400: '#7092a8',
          300: '#61869e',
          200: '#57788e',
          100: '#4d6b7e'
        },
        spoil: {
          1100: '#f8f7f8',
          1000: '#eceaeb',
          900: '#e0dcdf',
          800: '#d3cfd2',
          700: '#c7c2c6',
          600: '#afa7ad',
          500: '#a39aa1',
          400: '#978c94',
          300: '#8b7f88',
          200: '#7e727b',
          100: '#70666e'
        },
        milden: {
          1100: '#fbf9f8',
          1000: '#f5f0ef',
          900: '#efe7e5',
          800: '#e9dfdc',
          700: '#e3d6d3',
          600: '#d7c5c0',
          500: '#d1bcb7',
          400: '#cbb4ad',
          300: '#c5aba4',
          200: '#bfa39b',
          100: '#b99a91'
        },
        velvet: {
          900: '#5500d9',
          800: '#4f00ca',
          700: '#4900ba',
          600: '#4300ab',
          500: '#3d009c', //  hover action
          400: '#31007d',
          300: '#2b006e',
          200: '#25005e',
          100: '#1f004f'
        },
        leather: {
          900: '#e36900',
          800: '#cf6000',
          700: '#ba5600',
          600: '#a64d00',
          500: '#7d3a00', // text-message
          400: '#693100',
          300: '#542700',
          200: '#401e00',
          100: '#2b1400'
        },
        cocoa: {
          900: '#ff490e',
          800: '#f93d00',
          700: '#e43800',
          600: '#d03300',
          500: '#a72900', // logo large, for landing
          400: '#932400',
          300: '#7e1f00',
          200: '#6a1a00',
          100: '#551500'
        },
        garden: {
          900: '#4ce300',
          800: '#45cf00',
          700: '#3fba00',
          600: '#38a600',
          500: '#2a7d00',
          400: '#236900',
          300: '#1c5400',
          200: '#154000',
          100: '#0f2b00'
        }
      }
    },
  },
  purge: ["./index.html",'./src/**/*.{svelte,js,ts}'], //for unused css
  variants: {
    extend: {
    },
  },
  darkmode: false, // or 'media' or 'class'
}
