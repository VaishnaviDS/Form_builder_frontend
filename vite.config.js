import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),       // ✅ Enables JSX + React fast refresh
    tailwindcss(), // ✅ Tailwind plugin
  ],
});
