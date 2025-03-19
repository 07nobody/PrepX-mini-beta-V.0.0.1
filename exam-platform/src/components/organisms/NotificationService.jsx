import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from '../../utils/api';

const NotificationService = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get(`/notifications/${userId}`);
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId]);

  if (loading) {
    return <p>Loading notifications...</p>;
  }

  return (
    <div>
      <h2>Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications available.</p>
      ) : (
        <ul>
          {notifications.map((notification) => (
            <li key={notification.id}>
              <p>{notification.message}</p>
              <p>{new Date(notification.date).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

NotificationService.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default NotificationService;
