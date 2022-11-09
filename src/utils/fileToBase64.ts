export const fileTobase64 = (file: Blob | File | null): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (file) {
      const reader = new FileReader()
  
      reader.addEventListener('load', () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result)
        }
      })
      reader.addEventListener('error', reject)

      reader.readAsDataURL(file)
    } else {
      throw reject('file is null')
    }
  })
}