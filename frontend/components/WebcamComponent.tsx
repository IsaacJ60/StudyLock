import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import Webcam from 'react-webcam';

interface WebcamComponentProps {
  // any additional props if needed
}

export interface WebcamComponentRef {
  getImage: () => string | null; // define getImage function's signature
}

const WebcamComponent = forwardRef<WebcamComponentRef, WebcamComponentProps>((props, ref) => {
  const webcamRef = useRef<Webcam | null>(null); // Reference to the Webcam component

  // Exposing the getImage method using useImperativeHandle
  useImperativeHandle(ref, () => ({
    getImage: () => {
      if (webcamRef.current) {
        return webcamRef.current.getScreenshot(); // Capture the screenshot and return it
      }
      return null;
    }
  }));

  return (
    <div>
      <Webcam
        audio={false}
        width="100%"
        height="100%"
        videoConstraints={{ facingMode: 'user' }}
        ref={webcamRef} // Attach the ref to the Webcam component
        screenshotFormat="image/jpeg" // Ensure the screenshot is in JPEG format
        screenshotQuality={1} // Optional: Set quality (0 to 1)
      />
    </div>
  );
});

export default WebcamComponent;
