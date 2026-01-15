import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { reload } from "firebase/auth";
import { getFirestore, doc, updateDoc, getDoc, setDoc } from "firebase/firestore";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import { useState } from "react";
import logo from "../assets/BookSlots.svg"
import google_logo from "../assets/GoogleLogo.svg"
import { useNavigate } from "react-router";

export default function Login() {

const [email,setEmail] = useState("");
const [pass,setPass] = useState("");
const [error, setError] = useState("");

const navigate = useNavigate();

//firebase
const db = getFirestore();
const provider = new GoogleAuthProvider();


const handleGoogleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const nameParts = user.displayName?.split(" ") || [];
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      await setDoc(userRef, {
        firstName,
        lastName,
        email: user.email,
        phone: user.phoneNumber || "",
        emailVerified: user.emailVerified, // true for Google
        provider: "google",
        createdAt: new Date(),
      });
    } else {
      await updateDoc(userRef, {
        emailVerified: user.emailVerified,
        lastLogin: new Date(),
      });
    }

    navigate("/dashboard");
  } catch (error) {
    console.error(error.code, error.message);
  }
};



const handleLogin = async () => {
setError("");

if(!email || !pass){
setError("Email and Password Required");
return;
}
try{
await signInWithEmailAndPassword(auth,email,pass);
await reload(auth.currentUser);
console.log("Email verified:", auth.currentUser.emailVerified);

if (auth.currentUser.emailVerified) {
await updateDoc(
doc(db, "users", auth.currentUser.uid),
{ emailVerified: true }
);
console.log("firestore updated");
} else {
setError("Please Verify Your Email")
return;
}

navigate("/dashboard");
}
catch (err) {
setError("Invalid Credentials");
console.log(err);

}
};


return (

<>
<div className="outer flex w-screen h-screen ">
<div className="left hidden md:block w-[50%] h-screen "></div>
<div className="right w-[100%] md:w-[50%] h-screen ">
<div className="top w- h-[33%]  flex justify-center items-center">
<img src={logo} alt="Logo" />;
</div>
<div className="mid w- h-[33%] flex flex-col gap-3 justify-center items-center">
<input className="w-[80%] h-[20%] border rounded-xl p-2" type="text" placeholder="Enter your Email" value={email} onChange={(e) => setEmail(e.target.value)} />
<input className="w-[80%] h-[20%] border rounded-xl p-2" type="Password" placeholder="Enter your Password" value={pass} onChange={(e) => setPass(e.target.value)} />
<p className="w-[80%] text-red-500">{error}</p>
<button className="w-[30%] h-[20%] border rounded-xl bg-[#EACEA7]" onClick={handleLogin}>Login</button>
</div>
<div className="bottom w- h-[33%] flex flex-col gap-5 items-center">
<p>Don’t have an account?
<u className="text-blue-600" onClick={() => navigate('/register') }>Register Now</u></p>
<button onClick={handleGoogleLogin} className="w-[60%] md:w-[40%] h-[20%] border rounded-xl flex items-center justify-center gap-3">
<img className="w-[5vh]" src={google_logo} alt="" />
<p>Continue with Google</p></button>
</div>
</div>
</div>
</>
);  
}
