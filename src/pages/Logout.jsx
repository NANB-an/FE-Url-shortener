import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { showSuccess, showError } from "../utils/toast";

const Logout = async () => {
  try {
    await signOut(auth);
    showSuccess('Logged out!');
    localStorage.removeItem('token');
    
  } catch (err) {
    showError('Logout failed');
  }
};

export default Logout;
