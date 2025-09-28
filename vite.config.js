import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Replace 'task-manager' with your GitHub repository name
export default defineConfig({
  plugins: [react()],
  base: '/task-manager/',
});
