import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import Footer from './components/common/Footer';
import AppRoutes from './routes/AppRoutes';

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="relative min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-[#0b0f19] dark:text-slate-100 transition-colors overflow-hidden">
            
            {/* Ambient Animated Light Spheres (Mesh Background) */}
            <div className="fixed top-0 left-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/15 rounded-full filter blur-3xl animate-blob pointer-events-none -z-0"></div>
            <div className="fixed top-1/3 right-1/4 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full filter blur-3xl animate-blob animation-delay-2000 pointer-events-none -z-0"></div>
            <div className="fixed bottom-10 left-1/3 w-96 h-96 bg-purple-500/10 dark:bg-purple-600/15 rounded-full filter blur-3xl animate-blob animation-delay-4000 pointer-events-none -z-0"></div>

            <Navbar />
            <div className="relative z-10 flex-1 flex max-w-7xl w-full mx-auto">
              <Sidebar />
              <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
                <AppRoutes />
              </main>
            </div>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
