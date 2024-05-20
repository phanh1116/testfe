import path from "path";
import react from "@vitejs/plugin-react"; // Correct import
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()], // Use the imported plugin function here
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
