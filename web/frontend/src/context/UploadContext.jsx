import { createContext, useContext, useState } from "react";

const UploadContext = createContext();

export function UploadProvider({ children }) {
  const [uploadState, setUploadState] = useState({
    fileName: null,
    status: "idle", // idle | uploading | processing | done | error
    jobId: null,
    result: null
  });

  return (
    <UploadContext.Provider value={{ uploadState, setUploadState }}>
      {children}
    </UploadContext.Provider>
  );
}

export function useUpload() {
  return useContext(UploadContext);
}
