const getRedirectURL = () => {
  let prodURL: string =
    import.meta.env.VITE_PRODUCTION_URL ??
    import.meta.env.VITE_VERCEL_URL ??
    'http://localhost:3000';

  const devURL = import.meta.env.VITE_DEVELOPMENT_URL.endsWith('/')
    ? import.meta.env.VITE_DEVELOPMENT_URL
    : import.meta.env.VITE_DEVELOPMENT_URL.concat('/');

  prodURL = prodURL.startsWith('http') ? prodURL : `https://${prodURL}`;
  prodURL = prodURL.endsWith('/') ? prodURL : `${prodURL}/`;

  return { prodURL, devURL };
};

export default getRedirectURL;
