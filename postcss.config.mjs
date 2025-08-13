const config = {
  plugins: ["@tailwindcss/postcss"],
  theme: {
    keyframes: {
      shimmer: {
        '100%': {
          transform: 'translateX(100%)',
        },
      },
    },
  },
};

export default config;
