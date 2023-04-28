import React, { useEffect, useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate,NavLink } from 'react-router-dom';
import { registerEmailAndPassword } from '../api/index';
import { Logo } from "../assets/img/index";
import { LogoLogin } from "../assets/img/index";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Alert from '@mui/material/Alert';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpPassword, setconfirmpPassword] = useState('');
  const [checkBox,setCheckBox] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [show,setShow] = useState(false);
  const [showErrorPassword,setshowErrorPassword] = useState(false);

const handleClickOpen = () => {
    setOpen(true);
};

const handleClose = () => {
    setOpen(false);
};

  useEffect(() => {
    const interval = setInterval(() => {
      setShow(false);
      setshowErrorPassword(false);
    },3000)
    return () => clearInterval(interval);
  }, []);

  const auth = getAuth();
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    if(password === confirmpPassword && checkBox === true){
          createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
            const data = {
                email: userCredential.user.email,
                password: password,
                name: userCredential.user.displayName === null ? "No Name" : userCredential.user.displayName,
                imageURL: userCredential.user.photoURL === null ? "@" : userCredential.user.photoURL,
                user_id: userCredential.user.uid,
                email_verified: userCredential.user.emailVerified,
                id_refund : "",
                role: "member",
                auth_time: userCredential.user.metadata.createdAt
            }
            registerEmailAndPassword(data).then((res) => {
                if(res.success){
                  window.localStorage.removeItem("auth");
                  setEmail('');
                  setPassword('');
                  setconfirmpPassword('');
                  navigate("/login");
                }
            })
          })
          .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              console.log(errorCode);
              console.log(errorMessage);
              setShow(true);
              setEmail('');
              setPassword('');
              setconfirmpPassword('');
              navigate("/register", { replace: false });
          });
    }else{
      setshowErrorPassword(true);
    }
  };

  const handleChange = event => {
    setCheckBox(current => !current);
  };

  return (
    <div className='relative w-screen h-screen '>
      <section className="bg-gray-50 dark:bg-gray-900" style={{ backgroundImage: `url(${LogoLogin})` }}>
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <a className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
            <img className="w-8 h-8 mr-2" src={Logo} alt="logo" />
            <p style={{ color: "white" }}>Music App</p>
          </a>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Create a new account
              </h1>
              {
              show === true ? (<Alert severity="error">Email already existed!!!</Alert>) : (<></>)
              }
              {
              showErrorPassword === true ? (<Alert severity="error">Password is invalid!!!</Alert>) : (<></>)
              }
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6" action="#">
                <div>
                  <label for="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                  <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@gmail.com" required value={email} onChange={(event) => setEmail(event.target.value)} />
                </div>
                <div>
                  <label for="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                  <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required value={password} pattern="^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$" onChange={(event) => setPassword(event.target.value)} />
                </div>
                <div>
                  <label for="confirm-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
                  <input type="password" name="confirm-password" id="confirm-password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" pattern="^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$" required value={confirmpPassword} onChange={(event) => setconfirmpPassword(event.target.value)} />
                </div>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input value={checkBox} onChange={handleChange} id="terms" aria-describedby="terms" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required />
                  </div>
                  <div className="ml-3 text-sm">
                    <label for="terms" className="font-light text-gray-500 dark:text-gray-300">I accept the <a className="font-medium text-primary-600 hover:underline dark:text-primary-500" onClick={handleClickOpen}>Terms and Conditions</a></label>
                  </div>
                </div>
                <button type="submit" className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Create an account</button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Already have an account?
                  <NavLink to={"/login"} className="font-medium text-primary-600 hover:underline dark:text-primary-500">
                    Login here
                  </NavLink>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
      <div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Tearms of Conditions"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <p>In order to use the Music Service and access any Content, you need to (1) be 13 years of age (or the equivalent minimum age in your home country) or older, (2) have parent or guardian consent if you are a minor in your home country.</p>
              <p>We provide numerous Music Service options. Certain Spotify Service options are provided free-of-charge, while other options require payment before they can be accessed (the "Paid Subscriptions"). We may also offer special promotional plans, memberships, or services, including offerings of third-party products and services. We are not responsible for the products and services provided by such third parties.</p>
              <p>You may need to create a Music account to use all or part of the Music Service. Your username and password are for your personal use only and should be kept confidential. You understand that you are responsible for all use (including any unauthorized use) of your username and password. Notify our Customer Service team immediately if your username or password is lost or stolen, or if you believe there has been unauthorized access to your account.</p>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="info" onClick={handleClose}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
 )
}

export default Register