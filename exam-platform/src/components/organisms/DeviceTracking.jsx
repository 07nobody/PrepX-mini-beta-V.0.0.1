import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import api from '../../utils/api';

const DeviceTracking = ({ userId }) => {
  useEffect(() => {
    const trackDevice = async () => {
      try {
        const response = await api.post('/device-tracking', { userId });
        console.log('Device tracked successfully:', response.data);
      } catch (error) {
        console.error('Error tracking device:', error);
      }
    };

    trackDevice();
  }, [userId]);

  return (
    <div>
      <h2>Device Tracking</h2>
      <p>Your device is being tracked for security purposes.</p>
    </div>
  );
};

DeviceTracking.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default DeviceTracking;
