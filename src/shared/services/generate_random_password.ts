export function generateRandomPassword(): string {
  const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  const specialCharacters = '!@#$%^&*'

  const randomCharacter = (options: string) => {
    const index = Math.floor(Math.random() * options.length)
    return options.charAt(index)
  }

  const password: string[] = [
    randomCharacter(uppercaseLetters),
    randomCharacter(lowercaseLetters),
    randomCharacter(numbers),
    randomCharacter(specialCharacters),
  ]

  const remainingCharacters = uppercaseLetters + lowercaseLetters + numbers + specialCharacters

  for (let i = password.length; i < 8; i++) {
    password.push(randomCharacter(remainingCharacters))
  }

  // Shuffle the password to ensure randomness
  password.sort(() => Math.random() - 0.5)

  return password.join('')
}