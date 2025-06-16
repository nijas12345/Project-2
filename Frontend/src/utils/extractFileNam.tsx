export const extractFileNameFromUrl = (url: string, fallback = "File") => {
  const name = url?.split("/").pop()?.slice(0, 4) || fallback;
  return `${name}_Image.jpg`;
};
