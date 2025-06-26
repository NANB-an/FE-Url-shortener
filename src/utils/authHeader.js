import { auth } from '../firebase';
import { getIdToken } from 'firebase/auth';

export const getAuthHeader = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not logged in');
  const token = await getIdToken(user, true); // force refresh
  return { Authorization: `Bearer ${token}` };
};
