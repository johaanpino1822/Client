import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Polyfills para módulos de Node.js (necesarios para Webpack 5+)
import { Buffer } from 'buffer';
import process from 'process';
  

// Configurar polyfills en el objeto global (window)
window.Buffer = Buffer;
window.process = process;

const root = createRoot(document.getElementById('root'));
root.render(<App />);