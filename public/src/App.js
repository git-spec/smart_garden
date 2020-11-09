import React from 'react';
import Navigation from './components/Navigation';
import Router from './components/Router';
import ViewportProvider from './components/ViewportProvider';

function App() {
  return (
    <ViewportProvider>
      <div className="cover"></div>
      <Navigation />
      <Router />
    </ViewportProvider>
  );
}

export default App;