import React from 'react';
import Webcam from 'react-webcam';

const WebcamComponent: React.FC = () => {
  return (
    <Webcam
      audio={false}
      width="100%"
      height="100%"
      videoConstraints={{ facingMode: 'user' }}
    />
  );
};

export default WebcamComponent;
