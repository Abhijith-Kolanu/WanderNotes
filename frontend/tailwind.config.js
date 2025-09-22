module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    fontFamily: {
      display: ["Poppins", "sans-serif"]
    },
    extend: {
      colors: {
        primary: "#05B6D3",
        secondary: "#EF863E"
      },
      backgroundImage: {
        "login-bg-img": "url('/login-bg-image.jpg')",
        "signup-bg-img": "url('/signup-bg-img.jpeg')",
      }
    },
  },
  plugins: [],
}