"use client";

import { useState } from "react";
import { ClipboardDocumentIcon } from "@heroicons/react/16/solid";

export default function CopyToClipboard({ data }: { data: string }) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(data);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="h-full w-full">
      <button
        className="h-full w-full p-1 rounded-lg flex items-center bg-blue-500 text-white"
        onClick={copyToClipboard}
      >
        {isCopied ? "Copied!" : <ClipboardDocumentIcon className="h-5 w-5" />}
      </button>
    </div>
  );
}
