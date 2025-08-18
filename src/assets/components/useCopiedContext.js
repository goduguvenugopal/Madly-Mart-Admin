import React, { useEffect } from "react";

const useCopiedContext = ({ signature }) => {
  useEffect(() => {
    const copiedToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(signature);

        alert("copied to clipboard");
      } catch (error) {
        console.error(error);
      }
    };

    if (signature !== "") {
      copiedToClipboard();
    }
  }, [signature]);

  return null;
};

export default useCopiedContext;
