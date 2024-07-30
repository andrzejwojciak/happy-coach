"use client";

import { useState } from "react";
import { ClipboardDocumentIcon } from "@heroicons/react/16/solid";

const unsecuredCopyToClipboard = (text: string) => {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand("copy");
  } catch (err) {
    console.error("Unable to copy to clipboard", err);
  }
  document.body.removeChild(textArea);
};

export default function CopyToClipboard({ data }: { data: string }) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      if (window.isSecureContext && navigator.clipboard) {
        await navigator.clipboard.writeText(data);
      } else {
        unsecuredCopyToClipboard(data);
      }

      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);

      try {
        unsecuredCopyToClipboard(data);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error("Failed to unsecure copy text: ", err);
      }
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
