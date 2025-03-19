import { useState, useEffect } from 'react';
import { saveExamProgress, getExamProgress } from '../utils/indexedDB';
import { registerServiceWorker } from '../utils/serviceWorker';

const useOfflineExam = (examId) => {
  const [progress, setProgress] = useState(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      syncProgress();
    };

    const handleOffline = () => {
      setIsOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const fetchProgress = async () => {
      const savedProgress = await getExamProgress(examId);
      if (savedProgress) {
        setProgress(savedProgress);
      }
    };

    fetchProgress();
  }, [examId]);

  const saveProgress = async (newProgress) => {
    setProgress(newProgress);
    await saveExamProgress({ id: examId, ...newProgress });
  };

  const syncProgress = async () => {
    if (!isOffline) {
      // Sync with server
      await fetch('/api/v1/exams/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(progress),
      });
    }
  };

  useEffect(() => {
    registerServiceWorker();
  }, []);

  return { progress, saveProgress, isOffline };
};

export default useOfflineExam;
