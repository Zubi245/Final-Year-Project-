// Mock API service for data initialization
export function initializeData() {
  // Initialize any required data on app startup
  if (!localStorage.getItem('appInitialized')) {
    localStorage.setItem('appInitialized', 'true');
    console.log('App data initialized');
  }
}
