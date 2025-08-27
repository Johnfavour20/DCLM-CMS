/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  safelist: [
    'bg-blue-100',
    'border-blue-500',
    'text-blue-500',
    'bg-green-100',
    'border-green-500',
    'text-green-500',
    'bg-orange-100',
    'border-orange-500',
    'text-orange-500',
    'bg-red-100',
    'border-red-500',
    'text-red-500',
    'bg-purple-100',
    'border-purple-500',
    'text-purple-500',
    'bg-yellow-100',
    'border-yellow-500',
    'text-yellow-500',
    'bg-cyan-100',
    'border-cyan-500',
    'text-cyan-500',
  ],
  plugins: [],
}