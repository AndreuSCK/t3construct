import { useState } from "react";
import { UploadButton } from "~/utils/uploadthing";

export const UploadHandler = ({
  setImage,
  image,
}: {
  setImage: (url: string | undefined) => void;
  image: string | undefined;
}) => {
  const [error, setError] = useState<string | undefined>(undefined);
  return (
    <div className=" flex w-full flex-col items-center justify-center">
      <div className="relative flex w-full justify-center">
        <label className="text-sm font-bold text-black ">Company profile Image</label>
        <p className="absolute  right-0 text-sm">optional</p>
      </div>
      <UploadButton
        className="mt-2 ut-button:bg-slate-500
         ut-button:ut-readying:bg-slate-500
         ut-button:ut-ready:bg-slate-500
         ut-button:ut-uploading:bg-slate-500
          ut-button:ut-uploading:text-white
          after:ut-button:ut-uploading:bg-slate-800/40
         "
        onUploadBegin={() => {
          setError(undefined);
          setImage(undefined);
        }}
        onUploadProgress={(progress) => {
          return "Uploading...";
        }}
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          res[0]?.url;
          if (res[0]?.url) {
            setImage(res[0]?.url);
          }
        }}
        onUploadError={(error: Error) => {
          setError("Server error or file too large. Please try again.");
        }}
        content={{
          button({ ready }) {
            if (ready) return <div>Upload Image</div>;
            return "Getting ready...";
          },
          allowedContent({ ready, fileTypes, isUploading }) {
            if (!ready) return "Checking...";
            if (isUploading) return "Uploading...";
            return `max 4mb ${fileTypes.join(", ")}`;
          },
        }}
      />
      {error && <p className="text-red-600">{error}</p>}
      {image && <img src={image} className="mt-2 h-40" />}
    </div>
  );
};
