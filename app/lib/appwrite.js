import {Client, Account, Avatars, Databases} from 'react-native-appwrite';

export const client = new Client().setProject('6827a46100150290dfd7').setPlatform('com.shreyd.bbb').setEndpoint('https://fra.cloud.appwrite.io/v1');

export const account = new Account(client);
export const avatars = new Avatars(client);

export const databases = new Databases(client);