import React, { useState, useEffect } from 'react';
import { FiDownload, FiX, FiInfo } from 'react-icons/fi';

const PWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsInstalled(isStandalone);

    // Handle beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowButton(true);
      // Tampilkan tooltip otomatis saat pertama muncul
      setTimeout(() => setShowTooltip(true), 500);
    };

    // Handle app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowButton(false);
      setShowTooltip(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check if user dismissed before
    const dismissed = localStorage.getItem('pwa-dismissed');
    const installed = localStorage.getItem('pwa-installed');
    
    if (dismissed || installed) {
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
      setShowTooltip(false);
      localStorage.setItem('pwa-installed', 'true');
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('pwa-dismissed', 'true');
    setTimeout(() => setShowButton(false), 300);
  };

  const handleInfoClick = () => {
    setShowTooltip(!showTooltip);
  };

  if (!showButton || !isVisible || isInstalled) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {/* Tooltip Info - Muncul di atas */}
      {showTooltip && (
        <div className="relative animate-fade-in">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-2xl 
                        w-80 text-sm text-gray-600 dark:text-gray-300 
                        border border-gray-200 dark:border-gray-700
                        transform transition-all duration-300">
            <div className="flex justify-between items-start mb-3">
              <p className="font-bold text-gray-900 dark:text-white text-base flex items-center gap-2">
                <span className="text-blue-500">🚀</span>
                Install Weather App
              </p>
              <button
                onClick={() => setShowTooltip(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                aria-label="Close info"
              >
                <FiX className="text-sm" />
              </button>
            </div>
            
            <ul className="space-y-2 mb-4">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-gray-700 dark:text-gray-300">
                  <strong>Quick Access</strong> - Launch from home screen
                </span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-gray-700 dark:text-gray-300">
                  <strong>Offline Support</strong> - Works without internet
                </span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <span className="text-gray-700 dark:text-gray-300">
                  <strong>Push Notifications</strong> - Get weather alerts
                </span>
              </li>
            </ul>
            
            <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-700">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Takes only 10 seconds
              </span>
              <button
                onClick={handleInstallClick}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white 
                         text-sm font-medium rounded-lg transition-colors"
              >
                Install Now
              </button>
            </div>
            
            {/* Arrow pointer */}
            <div className="w-4 h-4 bg-white dark:bg-gray-800 border-r border-b 
                          border-gray-200 dark:border-gray-700 rotate-45 
                          absolute -bottom-2 right-12"></div>
          </div>
        </div>
      )}

      {/* Main Button Container */}
      <div className="relative flex items-center gap-3">
        {/* Info Button (Optional) */}
        <button
          onClick={handleInfoClick}
          className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 
                   flex items-center justify-center hover:bg-gray-200 
                   dark:hover:bg-gray-700 transition-all shadow-lg
                   hover:scale-110 text-gray-600 dark:text-gray-300"
          aria-label="Show info"
        >
          <FiInfo className="text-lg" />
        </button>

        {/* Install Button */}
        <div className="relative">
          <button
            onClick={handleInstallClick}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 
                     text-white font-semibold shadow-xl hover:shadow-2xl transition-all 
                     flex items-center gap-2 hover:scale-105 active:scale-95
                     animate-pulse-slow"
          >
            <FiDownload className="text-lg" />
            Install App
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full ml-1">
              PWA
            </span>
          </button>
          
          {/* Dismiss Button */}
          <button
            onClick={handleDismiss}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 
                     rounded-full flex items-center justify-center hover:bg-red-600 
                     transition-colors text-white shadow-lg hover:scale-110"
            aria-label="Dismiss"
          >
            <FiX className="text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstall;