import logo from "../assets/BookSlots.svg"
import google_logo from "../assets/GoogleLogo.svg"
import { useState } from "react";
import { useNavigate } from "react-router";
import { fetchSignInMethodsForEmail } from "firebase/auth";
import { getFirestore, doc, updateDoc, getDoc, setDoc } from "firebase/firestore";
import { sendEmailVerification } from "firebase/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";


import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";

export default function Register({user_type}){
const [step,setStep] = useState(0);

const navigate = useNavigate();

const [firstName,setFirstName] = useState("");
const [lastName,setLastName] = useState("");
const [email,setEmail] = useState("");
const [phone,setPhone] = useState("");
const [pass,setPass] = useState("");
const [repass,setRePass] = useState("");
const [errorText,setErrorText] = useState("");

const db = getFirestore();
const provider = new GoogleAuthProvider();


const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidPassword = (password) => {
  return /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password);
};

//google login
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

//signup
const handleSignUp = async () => {
try {
const userCredential = await createUserWithEmailAndPassword(auth,email,pass);
const user = userCredential.user;

 await sendEmailVerification(user);
console.log("Verification email triggered");

await setDoc(doc(db, "users", user.uid),{
firstName,
lastName,
email : user.email,
phone,
createdAt: new Date(),
emailVerified: false,
})
console.log("user creaeted");
setStep(prev => prev + 1);

}
catch (error) {
console.error(error.code, error.message);
}
}

const isEmailTaken = async (email) => {
const methods = await fetchSignInMethodsForEmail(auth, email);
console.log(methods);
return methods.length > 0;
}

const handleStepUp = async () => {

if (step === 0) {
  if (!firstName || !lastName) {
    setErrorText("Fill the fields");
    return;
  }

  setErrorText("");
  setStep(prev => prev + 1);
}

else if (step === 1) {
  if (!email || !phone) {
    setErrorText("Fill the fields");
    return;
  }
else if (!isValidEmail(email)){
setErrorText("Invalid Email");
}  
else if (await isEmailTaken(email)) {
setErrorText("Email is Taken");
}
else{
setErrorText("");
setStep(prev => prev + 1);
}
}

else if (step === 2) {
  if (!pass || !repass) {
    setErrorText("Fill the fields");
    return;
  }
else if (!isValidPassword(pass)) return setErrorText("Use Correct Format");
else if (pass !== repass) return setErrorText("Passwords Dont Match");

  setErrorText("");
  await handleSignUp();
}
}




return(
<>
<div className="outer flex w-screen h-screen ">
<div className="left hidden md:block w-[50%] h-screen "></div>
<div className="right w-[100%] md:w-[50%] h-screen ">
<div className="top w- h-[33%]  flex justify-center items-center">
<img src={logo} alt="Logo" />
</div>
<div className="mid w- h-[33%] flex flex-col gap-3 justify-center items-center">

{(step == 0) && (
<>
<input className="w-[80%] h-[20%] border rounded-xl p-2" type="text" placeholder="Enter your First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)}  />
<input className="w-[80%] h-[20%] border rounded-xl p-2" type="text" placeholder="Enter your Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)}  />
<button className="w-[30%] h-[20%] border rounded-xl bg-[#EACEA7]" onClick={handleStepUp}>Next</button>
</>
)}

{(step == 1) && (
<>
<div className="w-[80%]">
  <p onClick={() => setStep(prev => prev - 1)}>Back</p>
</div>
<input className="w-[80%] h-[20%] border rounded-xl p-2" type="email" placeholder="Enter your Email" value={email} onChange={(e) => setEmail(e.target.value)}   />
<input className="w-[80%] h-[20%] border rounded-xl p-2" type="number" placeholder="Enter your Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)}   />
<button className="w-[30%] h-[20%] border rounded-xl bg-[#EACEA7]" onClick={handleStepUp}>Next</button>
</>
)}

{(step == 2) && (
<>
<div className="w-[80%]">
  <p onClick={() => setStep(prev => prev - 1)}>Back</p>
</div>
<input className="w-[80%] h-[20%] border rounded-xl p-2" type="password" placeholder="Choose a Password" value={pass} onChange={(e) => setPass(e.target.value)}  />
<input className="w-[80%] h-[20%] border rounded-xl p-2" type="password" placeholder="Enter your Password Again" value={repass} onChange={(e) => setRePass(e.target.value)}   />
<button
  className="w-[30%] h-[20%] border rounded-xl bg-[#EACEA7]"
  onClick={handleStepUp}
>
  Next
</button>

</>
)}
 
{(step == 3) && (
<>
<p>Check your Email and Verify</p>
<button className="w-[30%] h-[20%] border rounded-xl bg-[#EACEA7]" >Login</button>
</>
)}

<p className="w-[80%] text-red-600">{errorText}</p>

</div>
<div className="bottom w- h-[33%] flex flex-col gap-5 items-center">
<p>Have an account?
<u className="text-blue-600" onClick={() => navigate('/login')}>Login</u></p>
<button onClick={handleGoogleLogin} className="w-[60%] md:w-[40%] h-[20%] border rounded-xl flex items-center justify-center gap-3">
<img className="w-[5vh]" src={google_logo} alt="" />
<p>Continue with Google</p></button>
</div>
</div>
</div>
</>
);
}