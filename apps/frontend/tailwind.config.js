export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17202A",
        ocean: "#0F766E",
        mint: "#A7F3D0",
        coral: "#F97368",
        amber: "#F59E0B"
      },
      boxShadow: {
        panel: "0 16px 50px rgba(15, 23, 42, 0.10)"
      }
    }
  },
  plugins: []
};
