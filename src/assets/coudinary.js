const api = import.meta.env.VITE_CLOUDINARY_API;

const cloudinaryFunc = async (event) => {
  const selectedFile = event.target.files[0];
  if (selectedFile) {
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("upload_preset", "venu_image");

    try {
      const res = await fetch(api, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Failed to upload image: ${res.statusText}`);
      }

      const data = await res.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      return null;
    }
  }
  return null;
};

export default cloudinaryFunc;
