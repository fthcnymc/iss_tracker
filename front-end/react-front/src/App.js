import React, { useState, useEffect } from 'react';
import axios from 'axios';

import mapBackground from './world.svg';
import issIcon from './iss-icon.png';

const ISSPosition = () => {
  const [position, setPosition] = useState({ latitude: '', longitude: '' });
  const [positionHistory, setPositionHistory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/data');
        const { latitude, longitude } = response.data.iss_position;
        setPosition({ latitude, longitude });
        setPositionHistory((prevHistory) => [...prevHistory, { latitude, longitude }]);
      } catch (error) {
        console.error('Error fetching ISS position:', error);
      }
    };

    const intervalId = setInterval(() => {
      fetchData();
    }, 10000);

    fetchData();

    return () => clearInterval(intervalId);
  }, []);

  const showIcon = position.latitude !== '' && position.longitude !== '';

  const calculateTopPosition = (rawLatitude) => {
    const latitude = parseFloat(rawLatitude);
    return ((latitude + 90) / 180) * 100;
  };

  const normalizeLeftPosition = (rawLeft) => {
    const normalizedLeft = (parseFloat(rawLeft) + 180) / 360;
    return Math.max(0, Math.min(100, normalizedLeft * 100));
  };

  return (
    <div
      style={{
        position: 'relative',
        backgroundImage: `url(${mapBackground})`,
        backgroundSize: 'cover',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
      }}
    >
      {showIcon && (
        <img
          src={issIcon}
          alt="ISS Icon"
          style={{
            position: 'absolute',
            top: `${calculateTopPosition(position.latitude)}%`,
            left: `${normalizeLeftPosition(position.longitude)}%`,
            width: '50px',
            height: 'auto',
          }}
        />
      )}
      <h1>ISS Position</h1>
      {positionHistory.length > 1 && (
        <svg
          width="100%"
          height="100%"
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          <polyline
            points={positionHistory.map(
              ({ latitude, longitude }) =>
                `${normalizeLeftPosition(longitude)}% ${calculateTopPosition(latitude)}%`
            )}
            fill="none"
            stroke="red"
            strokeWidth="20"
          />
        </svg>
      )}
    </div>
  );
};

export default ISSPosition;