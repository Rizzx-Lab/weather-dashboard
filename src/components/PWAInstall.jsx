import React, { useState, useEffect } from 'react';
import { FiDownload, FiCheck, FiX } from 'react-icons/fi';

const PWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsInstalled(isStandalone);

    // Handle beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowButton(true);
    };

    // Handle app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowButton(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check if user dismissed before
    const dismissed = localStorage.getItem('pwa-dismissed');
    if (dismissed) {
      setShowButton(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowButton(false);
      localStorage.setItem('pwa-installed', 'true');
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('pwa-dismissed', 'true');
    setTimeout(() => setShowButton(false), 300);
  };

  if (!showButton || !isVisible || isInstalled) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
      <div className="relative">
        <button
          onClick={handleInstallClick}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 
                   text-white font-semibold shadow-xl hover:shadow-2xl transition-all 
                   flex items-center gap-2 hover:scale-105 active:scale-95"
        >
          <FiDownload className="text-lg" />
          Install App
          <span className="text-xs bg-white/20 px-2 py-1 rounded-full ml-1">
            PWA
          </span>
        </button>
        
        <button
          onClick={handleDismiss}
          className="absolute -top-2 -right-2 w-6 h-6 bg-gray-300 dark:bg-gray-700 
                   rounded-full flex items-center justify-center hover:bg-gray-400 
                   dark:hover:bg-gray-600 transition-colors"
          aria-label="Dismiss"
        >
          <FiX className="text-sm" />
        </button>
        
        <div className="absolute -top-12 right-0 bg-white dark:bg-dark-card p-3 
                      rounded-lg shadow-lg w-64 text-sm text-gray-600 dark:text-gray-300 
                      border border-gray-200 dark:border-dark-border animate-slide-down">
          <p className="font-semibold text-gray-800 dark:text-white mb-1">
            🎉 Install Weather App
          </p>
          <p>Get quick access, offline support, and push notifications!</p>
          <div className="w-3 h-3 bg-white dark:bg-dark-card border-l border-t 
                        border-gray-200 dark:border-dark-border rotate-45 
                        absolute -bottom-1.5 right-6"></div>
        </div>
      </div>
    </div>
  );
};

export default PWAInstall;