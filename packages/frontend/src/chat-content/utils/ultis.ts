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

export async function fakeAPI () {
  async function delay (ms: number) {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }

  await delay(250);
  return true;
}