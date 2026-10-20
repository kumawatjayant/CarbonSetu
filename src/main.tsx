import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Suppress unhandled promise rejections originating from third-party browser extensions
window.addEventListener('unhandledrejection', (event) => {
  if (
    event.reason &&
    (
      (typeof event.reason.message === 'string' && event.reason.message.includes('fetch')) ||
      (typeof event.reason.stack === 'string' && event.reason.stack.includes('chrome-extension://'))
    )
  ) {
    event.preventDefault();
  }
});

createRoot(document.getElementById('root')!).render(<App />);
