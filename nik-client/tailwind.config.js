module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        mist: '#F4F8F7',
        foam: '#E7F1EE',
        ink: '#10211D',
        slate: {
          soft: '#5B6B66',
        },
        teal: {
          DEFAULT: '#1F7A6B',
          deep: '#155E52',
          soft: '#D7EDE8',
        },
        pulse: {
          high: '#C23B3B',
          mid: '#C9851A',
          low: '#2F6FED',
          calm: '#1F7A6B',
        },
      },
      fontFamily: {
        display: ['Fraunces_600SemiBold'],
        sans: ['DMSans_400Regular'],
        'sans-medium': ['DMSans_500Medium'],
        'sans-bold': ['DMSans_700Bold'],
      },
    },
  },
  plugins: [],
};
