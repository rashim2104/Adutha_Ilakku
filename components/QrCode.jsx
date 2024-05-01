import React, { useRef } from 'react';
import { useQRCode } from 'next-qrcode';
import domtoimage from 'dom-to-image';
import { saveAs } from 'file-saver';

function QrCode(props) {
  const { Image } = useQRCode();
  const qrRef = useRef();

  const handleDownload = () => {
    if (qrRef.current) {
      domtoimage.toBlob(qrRef.current)
        .then(function (blob) {
          saveAs(blob, `QRCode_${props.data}.png`);
        });
    }
  };

  return (
    <div>
      <div className="bg-white" >
      <div className='bg-white' ref={qrRef}>
      <Image
        text={props.data}
        options={{
          type: 'image/jpeg',
          quality: 0.3,
          errorCorrectionLevel: 'M',
          margin: 3,
          scale: 4,
          width: 200,
          color: {
            dark: '#10283d',
            light: '#FFFFFF',
          },
        }}
      />
      <h1 className='font-mono font-bold'>{props.data}</h1>
      <button className='button' onClick={handleDownload}>Download QR Code</button>
    </div>
  );
}

export default QrCode;