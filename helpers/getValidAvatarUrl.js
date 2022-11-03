/**
 * Gets a valid avatar url
 * @param {string} path
 * @return {string} 
 */
export default async (path) => {
  if (/^\/\_nuxt\//.test(path)) {
    return path;
  }

  const url = await require(`@/avatars/${path}`);

  return /^\/\_nuxt\//.test(url) ? url : "";
};