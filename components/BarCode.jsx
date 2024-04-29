import { useBarcode } from "next-barcode";
import { useEffect, useRef, useState } from "react";



export default function BarCode(props) {
  const { inputRef } = useBarcode({
    value: props.data,
    options: {
      background: "#ffffff",
      width: 3,
      height: 90,
    },
  });

  const downloadRef = useRef();

  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    if (inputRef.current && !downloaded) {
      const svgData = new XMLSerializer().serializeToString(inputRef.current);
      const svgBlob = new Blob([svgData], {
        type: "image/svg+xml;charset=utf-8",
      });
      const svgUrl = URL.createObjectURL(svgBlob);
      downloadRef.current.href = svgUrl;
      downloadRef.current.download = "AE_Token.svg";
      // downloadRef.current.click();
      setDownloaded(true); // mark as downloaded
    }
  }, [downloaded]);

  return (
    <>
      <svg ref={inputRef} />
      <button className="bg-green-200 rounded-full p-4 w-1/2 mt-8"><a ref={downloadRef} href="#">Download</a></button>
    </>
  );
}
