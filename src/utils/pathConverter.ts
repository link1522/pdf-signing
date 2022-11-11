export const pathConverter = (path: string) => {
  if (import.meta.env.MODE === 'production') {
    return '/pdf-signing' + path
  }
  return path
}
