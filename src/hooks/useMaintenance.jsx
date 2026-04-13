import { useState, useEffect } from 'react';
import { announcementsAPI } from '../services/api';

export const useMaintenance = () => {
  const [maintenance, setMaintenance] = useState({ show_banner: false, message: null });

  useEffect(() => {
    let isMounted = true;

    const checkMaintenance = async () => {
      try {
        const data = await announcementsAPI.getMaintenance();
        if (isMounted) {
          setMaintenance(data);
        }
      } catch (error) {
        console.error('Failed to fetch maintenance status:', error);
      }
    };

    // Initial check
    checkMaintenance();

    // Poll every 60 seconds
    const interval = setInterval(checkMaintenance, 60000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return maintenance;
};
