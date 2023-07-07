export function generateUniqueId (): string {
  const alphanumeric: string = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const idLength: number = 10;
  let uniqueId: string = '';

  for (let i: number = 0; i < idLength; i++) {
    const randomIndex: number = Math.floor(Math.random() * alphanumeric.length);
    uniqueId += alphanumeric.charAt(randomIndex);
  }

  return uniqueId;
}