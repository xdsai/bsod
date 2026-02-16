import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://jndl.dev',
  output: 'static',
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    build: {
      cssMinify: 'lightningcss',
    },
  },
});
