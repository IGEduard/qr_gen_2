const baseUrl = import.meta.env.VITE_API_URL || window.location.origin;
const smartLinkUrl = `${baseUrl}/api/links/${link.shortId}`;

return (
  <div>
    <span>{smartLinkUrl}</span>
    <button onClick={() => navigator.clipboard.writeText(smartLinkUrl)}>Copy</button>
    {/* ...other UI... */}
  </div>
);