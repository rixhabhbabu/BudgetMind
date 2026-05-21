export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B1220",
        ocean: "#1D4ED8",
        mint: "#DBEAFE",
        coral: "#DC2626",
        amber: "#F59E0B"
      },
      boxShadow: {
        panel: "0 16px 50px rgba(15, 23, 42, 0.10)"
      }
    }
  },
  plugins: []
};
