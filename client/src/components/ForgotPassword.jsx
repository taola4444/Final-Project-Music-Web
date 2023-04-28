import React, { useState } from 'react'
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { LogoLogin,Logo } from "../assets/img/index";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const ForgotPassword = () => {
  const [email, setEmail] = useState("")
  const auth = getAuth();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
};

  const handleClose = () => {
      setOpen(false);
  };
  const handleSubmit = async () => {
    await sendPasswordResetEmail(auth, email).then(res => {
      navigate("/login");
    });
  }
    
  return (
    <div className="relative w-screen h-screen">
      <section class="bg-gray-50 dark:bg-gray-900" style={{backgroundImage: `url(${LogoLogin})`}}>
        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <a class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <img className="w-8 h-8 mr-2" src={Logo} alt="logo" />
              <p style={{color: "white"}}>Music App</p>
          </a>
          <div class="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
            <h1 class="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Forgot your password?
            </h1>
            <p class="font-light text-gray-500 dark:text-gray-400">Don't fret! Just type in your email and we will send you a code to reset your password!</p>
            <form onSubmit={handleSubmit} class="mt-4 space-y-4 lg:mt-5 md:space-y-5">
              <div>
                <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                <input type="email" name="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@gmail.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
              </div>
              <div class="flex items-start">
                <div class="flex items-center h-5">
                  <input id="terms" aria-describedby="terms" type="checkbox" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required/>
                </div>
                <div class="ml-3 text-sm">
                  <label for="terms" class="font-light text-gray-500 dark:text-gray-300">I accept the <a class="font-medium text-primary-600 hover:underline dark:text-primary-500" onClick={handleClickOpen}>Terms and Conditions</a></label>
                </div>
              </div>
              <button type="submit" class="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Reset password</button>
            </form>
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

export default ForgotPassword

