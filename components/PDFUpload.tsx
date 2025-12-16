import React, { useState, useRef } from "react";
import { Button } from "./Button";

interface PDFUploadProps {
  onUploadComplete: (knowledgeId: string) => void;
  isUploading: boolean;
  setIsUploading: (isUploading: boolean) => void;
}

export const PDFUpload: React.FC<PDFUploadProps> = ({
  onUploadComplete,
  isUploading,
  setIsUploading,
}) => {
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file");
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("pdf", file);

      const response = await fetch("/api/process-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to process PDF");
      }

      const data = await response.json();
      setUploadedFile(file.name);
      onUploadComplete(data.knowledgeId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload PDF");
      console.error("Error uploading PDF:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="hidden"
      />
      <Button
        onClick={handleButtonClick}
        disabled={isUploading}
        className="w-full"
      >
        {isUploading
          ? "Processing PDF..."
          : uploadedFile
            ? `Uploaded: ${uploadedFile}`
            : "Upload PDF Knowledge Base"}
      </Button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {uploadedFile && !error && (
        <p className="text-green-500 text-sm">
          PDF processed successfully! Ready to start chat.
        </p>
      )}
    </div>
  );
};

