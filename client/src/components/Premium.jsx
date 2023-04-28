import React, { useEffect, useState } from 'react';
import {registerPayPal,registerPayPalSuccess,changeRoleAndRefundID,refundPaypal,newProfit} from '../api/index'
import {useStateValue} from '../context/StateProvider';
import {actionType} from '../context/reducer';
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const Premium = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [url,setUrl] = useState("");
  const [{user},dispatch] = useStateValue();
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
};

const handleClose = () => {
    setOpen(false);
};
  const registerPremium = () => {
    registerPayPal().then(res => {
      if(res.status === 200){
        setUrl(res.data.url);
        setOpen(true);
        setShow(true)
      }
    })
  }

  const openDialogRefun = () => {
    setOpen(true);
  }

  const refundCoin = () => {
    setOpen(false);
    refundPaypal(user?.user?.id_refund).then(res => {
      if(res.status === 200){
        changeRoleAndRefundID(user?.user?._id, "member","").then((res) => {
          dispatch({
            type: actionType.SET_USER,
            user: res.data
          })
          window.location.reload();
        });
      }
    })
  }

  useEffect(() => {
    var params = { PayerID: "", paymentId: "", token: "" };
    window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (str, key, value) {params[key] = value;});
    if (params.PayerID !== "" && params.paymentId !== "" && params.token !== "" && user !== null) {
      registerPayPalSuccess(params.PayerID, params.paymentId).then((resData) => {
        changeRoleAndRefundID(user?.user?._id, "premium",resData.data.data.transactions[0].related_resources[0].sale.id).then((res) => {
          dispatch({
            type: actionType.SET_USER,
            user: res.data
          })
          navigate("/premium");
      }) 
      });
    }
  })

  return (
    <div className='flex flex-col items-center gap-4 justify-center p-4 border border-gray-300 rounded'>
      <img className='w-[1100px] object-cover' src='https://i.pinimg.com/736x/bd/4b/be/bd4bbe1104ac0be39c7244b47ab5f148.jpg' />
      <div className='absolute overflow-hidden rounded-md text-center top-96'>
        <div className='text-yellow-200'>
      
        </div>
        {user?.user?.role === "premium" || user?.user?.role === "admin" ? "" : <button
          type="button"
          onClick={registerPremium}
          className="mt-2 inline-block rounded bg-warning px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#e4a11b] transition duration-150 ease-in-out hover:bg-warning-600 hover:shadow-[0_8px_9px_-4px_rgba(228,161,27,0.3),0_4px_18px_0_rgba(228,161,27,0.2)] focus:bg-warning-600 focus:shadow-[0_8px_9px_-4px_rgba(228,161,27,0.3),0_4px_18px_0_rgba(228,161,27,0.2)] focus:outline-none focus:ring-0 active:bg-warning-700 active:shadow-[0_8px_9px_-4px_rgba(228,161,27,0.3),0_4px_18px_0_rgba(228,161,27,0.2)]">
          Become a Premium member with just $200
        </button>}
        <div>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {
                  url === null || url === "" ? 
                  (
                    <>
                      {"Notice"}
                    </>
                  )
                  :
                    (
                      <>
                        {"Start your journey right now!!!"}
                      </>
                    )
                }
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {
                  url === null || url === "" ?
                  (
                    <>
                      <p>You will able to refund back to member account with 10% minimum charge fee</p>
                    </>
                  )
                  :
                    (
                      <>
                        <p>You can download music</p>
                        <p>You can listen to all tracks</p>
                        <p>Play music the way you prefer</p>
                      </>
                    )
                }
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}
                variant="outlined" color="error"
                className="mr-1"
              >Disagree</Button>
              {
                url === null || url === "" ? <Button variant="contained" color="success" onClick={refundCoin}>
                  Refund
                </Button> : <Button variant="contained" color="success" onClick={handleClose}>
                  <a className='block text-white mt-2' href={url}>Checkout with Paypal</a>
                </Button>
              }

            </DialogActions>
          </Dialog>
        </div>
        {user?.user?.id_refund !== "" ? (<button className="mt-2 inline-block rounded bg-warning px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#e4a11b] transition duration-150 ease-in-out hover:bg-warning-600 hover:shadow-[0_8px_9px_-4px_rgba(228,161,27,0.3),0_4px_18px_0_rgba(228,161,27,0.2)] focus:bg-warning-600 focus:shadow-[0_8px_9px_-4px_rgba(228,161,27,0.3),0_4px_18px_0_rgba(228,161,27,0.2)] focus:outline-none focus:ring-0 active:bg-warning-700 active:shadow-[0_8px_9px_-4px_rgba(228,161,27,0.3),0_4px_18px_0_rgba(228,161,27,0.2)]" onClick={openDialogRefun}>Refund</button>) : ""}
      </div>
    </div>
  )
}

export default Premium