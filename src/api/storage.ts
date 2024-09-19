import EncryptedStorage from 'react-native-encrypted-storage';

export type ITokens = {
  accessToken: string;
  refreshToken: string;
};

export async function getTokens(): Promise<ITokens | undefined> {
  try {
    const data = await EncryptedStorage.getItem('@auth');
    if (data) {
      const tokens: ITokens = JSON.parse(data);
      return tokens;
    } else {
      return;
    }
  } catch (error: any) {
    console.log(error.code);
  }
}

export async function setTokens(tokens: ITokens) {
  try {
    await EncryptedStorage.setItem('@auth', JSON.stringify(tokens));
  } catch (error: any) {
    console.log(error.code);
  }
}

export async function removeToken() {
  await EncryptedStorage.removeItem('@auth');
}
