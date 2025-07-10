export default function Image({src,...rest}) {
  if (!src) return '';
  
  // Handle both forward and back slashes
  const cleanSrc = src.replace(/\\/g, '/');
  
  src = cleanSrc.includes('https://')
    ? cleanSrc
    : `${import.meta.env.VITE_API_BASE_URL}/api/uploads/` + cleanSrc.split('/').pop();
    
  return (
    <img {...rest} src={src} alt={''} />
  );
}