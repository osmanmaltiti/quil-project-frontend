import { auth, storage } from "../../services/firebase";
import { ref, uploadBytesResumable } from "firebase/storage";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import useInput from "./custom-hooks/input-hook";
import axios from 'axios';
import file from "../../services/offset.txt";

const useSignpage = () => {
  const navigate = useNavigate();
  const [a, reset_username] = useInput('');
  const [b, reset_password] = useInput('');
  const [c, reset_fullname] = useInput('');
  const [d, reset_displayname] = useInput('');
  const [e, reset_email] = useInput('');
  const [f, reset_number] = useInput('');
  const [g, reset_password_reg] = useInput('');
  const [h, reset_con_pass] = useInput('');

  const handleLogIn = async(loggings, event) => {
    event.preventDefault();
    const {username, password} = loggings;
    reset_username(); reset_password();
    try {
        await signInWithEmailAndPassword(auth, username, password);
    } catch (error) {
        alert(`Error message: ${error}`);
        return;
    }
    navigate('/home');
  };

  const handleSignUp = async(signups, event) => {
    event.preventDefault();
    const defaultProfile = "https://firebasestorage.googleapis.com/v0/b/project-one-2c857.appspot.com/o/default%2Fdefaultprofile?alt=media&token=24f68a6b-23f4-4083-b3c0-1ba2471f3e3a";
    const {fullname, displayname, email, number, password_reg, createdAt} = signups;
    reset_fullname(); reset_displayname();
    reset_email(); reset_number();
    reset_password_reg(); reset_con_pass();
    try{
        const newUser = await createUserWithEmailAndPassword(auth, email, password_reg);
        const storageRef = ref(storage, `/users/${auth.currentUser.uid}/profile`);
        await uploadBytesResumable(storageRef, file);
        navigate('/home');
        await axios.post('https://quil.herokuapp.com/user', {
            uid: newUser.user.uid, fullname: fullname, 
            displayname: displayname,
            email: email, number: number,
            profileUrl: defaultProfile, createdAt
        });
    }
    catch(err){ console.log(err); }
  }
  const createdAt = () => {
    const dates = new Date()
    let day = dates.getDate();
    let month = dates.getMonth() + 1;
    let year = dates.getFullYear();
   return `${day}-${month}-${year}`;
  }

  return [handleLogIn, handleSignUp, createdAt]
}
export default useSignpage;

