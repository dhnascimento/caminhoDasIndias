import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import yaml from '@modyfi/vite-plugin-yaml';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), yaml()],
    base: './', // Enables serving from any path, including local files
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
    },
});
