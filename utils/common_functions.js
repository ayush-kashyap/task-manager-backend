export const getHighQualityGoogleImage = (photoURL) => {
  if (!photoURL) return null;

  return photoURL.replace(/=s\d+-c$/, "=s512-c");
};