import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

const page = p => fileURLToPath(new URL(p, import.meta.url));

// Three pages: the home page, /pricing/ and /docs/.
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: { main: page('./index.html'), docs: page('./docs/index.html'), pricing: page('./pricing/index.html') },
    },
  },
});
