import { useEffect, useRef } from 'react';
import { useAuth } from './useAuth';
import socketService from '../services/socket';

export const useSocket = () => {
  const { user } = useAuth();
  const socketInitialized = useRef(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (user && token && !socketInitialized.current) {
      const socket = socketService.connect(token);
      
      socket.on('workout_update', (data) => {
        console.log('Workout update:', data);
        // You can show notifications here
      });

      socket.on('goal_update', (data) => {
        console.log('Goal achievement:', data);
        // Handle goal achievements
      });

      socket.on('metrics_update', (data) => {
        console.log('Metrics updated:', data);
        // Update metrics in real-time
      });

      socketInitialized.current = true;
    }

    return () => {
      if (socketInitialized.current) {
        socketService.disconnect();
        socketInitialized.current = false;
      }
    };
  }, [user]);

  return {
    emit: socketService.emit.bind(socketService),
    on: socketService.on.bind(socketService),
    off: socketService.off.bind(socketService)
  };
};
