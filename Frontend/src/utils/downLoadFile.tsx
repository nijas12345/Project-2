export const downloadFileFromUrl = async (url: string, filename: string) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch file");

  const blob = await response.blob();
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
