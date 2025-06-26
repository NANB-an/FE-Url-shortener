import { signOut } from "firebase/auth";
import {auth} from "../firebase";


const Logout = async () => {
    try {
        await signOut(auth);
        localStorage.removeItem('token');
        alert('Logged out');
        window.location.href = '/login';
    } catch (err) {
        alert('Logout failed');
    }
}

export default Logout