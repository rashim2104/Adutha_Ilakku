import { useRef } from "react";
import { useQRCode } from 'next-qrcode';

export default function BarCode(props) {
  const Canvas = useQRCode();
  const canvasRef = useRef();
  const downloadQRCode = () => {
    if (canvasRef.current) {
      const canvasUrl = canvasRef.current.toDataURL("image/png");
      const link = document.createElement('a');
      link.href = canvasUrl;
      link.download = "AE_Token.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <>
      <Canvas
        getRef={canvasRef}
        text={props.data}
        options={{
          errorCorrectionLevel: 'M',
          margin: 3,
          scale: 4,
          width: 200,
          color: {
            dark: '#000000',
            light: '#FFFFFF',
          },
        }}
      />
      <button className="bg-green-200 rounded-full p-4 w-1/2 mt-8" onClick={downloadQRCode}>Download</button>
    </>
  );
}