import React, { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { getAuth, GoogleAuthProvider, signInWithPopup,signInWithEmailAndPassword  } from "firebase/auth";
import { app } from "../config/firebase.js";
import { useNavigate, NavLink } from "react-router-dom";
import { useStateValue } from "../context/StateProvider";
import { validateUser,loginWithEmailAndPassword,changePassword } from "../api/index";
import { actionType } from "../context/reducer";
import { LogoLogin,Logo } from "../assets/img/index";
import Alert from '@mui/material/Alert';

const Login = ({ setAuth }) => {
  const firebaseAuth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();
  const [{ user,userEmail }, dispatch] = useStateValue();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show,setShow] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const auth = getAuth();
    await signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        changePassword(user.uid,password).then(res => {
          loginWithEmailAndPassword(res.user.email, password, res.user.user_id).then((data) => {
            dispatch({
              type: actionType.SET_USER,
              user: data,
            });
            setEmail('');
            setPassword('');
          })
          window.localStorage.setItem("auth", "true");
          navigate("/", { replace: true });
        })
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setEmail('');
        setPassword('');
        setShow(true);
      });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setShow(false);
    },3000)
    return () => clearInterval(interval);
  }, []);

  const loginWithGoogle = async () => {
    await signInWithPopup(firebaseAuth, provider).then((userCred) => {
      if (userCred) {
        setAuth(true);
        window.localStorage.setItem("auth", "true");
        firebaseAuth.onAuthStateChanged((userCred) => {
          if (userCred) {
            userCred.getIdToken().then((token) => {
              window.localStorage.setItem("auth", "true");
              validateUser(token).then((data) => {
                dispatch({
                  type: actionType.SET_USER,
                  user: data,
                });
              });
            });
            navigate("/", { replace: true });
          } else {
            setAuth(false);
            dispatch({
              type: actionType.SET_USER,
              user: null,
            });
            navigate("/login");
          }
        });
      }
    });
  };

  useEffect(() => {
    if (window.localStorage.getItem("auth") === "true") {
      navigate("/", { replace: true });
    }
  }, []);
  return (
    <div className="relative w-screen h-screen" >
    <section class="bg-gray-50 dark:bg-gray-900" style={{backgroundImage: `url(${LogoLogin})`}}>
      <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
        <img className="w-8 h-8 mr-2" src={Logo} alt="logo" />
            <p style={{color: "white"}}>Music App</p>
        </a>
        <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            {
              show === true ? (<Alert severity="error">Invalid password or email!!!</Alert>) : (<></>)
            }
            <form onSubmit={handleSubmit} class="space-y-4 md:space-y-6">
              <div>
                <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                <input type="email" name="email" id="email" value={email} onChange={(event) => setEmail(event.target.value)} class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@gmail.com" required />
              </div>
              <div>
                <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" name="password" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" pattern="^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$" required />
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-start">
                  <div class="flex items-center h-5">
                    <input id="remember" aria-describedby="remember" type="checkbox" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required="" />
                  </div>
                  <div class="ml-3 text-sm">
                    <label for="remember" class="text-gray-500 dark:text-gray-300">Remember me</label>
                  </div>
                </div>
                <NavLink to={"/forgotPassword"} className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">
                  Forgot Password?
                </NavLink>  
              </div>
              <div
                onClick={loginWithGoogle}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-md border bg-cardOverlay cursor-pointer hover:bg-card hover:shadow-md duration-100 ease-in-out transition-all"
              >
                <FcGoogle className="text-xl" />
                Sign in with Google
              </div>
              <button type="submit" class="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign in</button>
              <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                Don't have an account yet?
                <NavLink to={"/register"} className="font-medium text-primary-600 hover:underline dark:text-primary-500">
                Sign up
                </NavLink>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
</div>
  );
};


export default Login;