import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      localsConvention: 'camelCaseOnly', // Ensures that CSS classes in modules are camelCase in JS
      scopeBehaviour: 'local', // Default behavior: all class names are scoped locally
      generateScopedName: '[name]__[local]___[hash:base64:5]', // Custom naming for class names
    },
  },
  resolve: {
    alias: {
      '@': '/src', // Shortcut alias for the 'src' folder
    },
  },
  server: {
    port: 5173, // Specify the port for the dev server
    open: true, // Automatically opens the app in the browser on start
  },
});
