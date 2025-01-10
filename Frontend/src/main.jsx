import React from 'react';
import ReactDOM from 'react-dom/client'; // Use 'react-dom/client' for React 18+
import { Provider } from 'react-redux';
import store from './store/store';
import App from './App';

// Create a root element using createRoot()
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the app inside the root element
root.render(
    <Provider store={store}>
        <App />
    </Provider>
);
