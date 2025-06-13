const toBase64 = (file: File): Promise<string> =>
   new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file); // includes mime type like "data:image/png;base64,..."
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
   });

export default toBase64