const router = require("express").Router();
const paypal = require("paypal-rest-sdk");
const paypal1 = require('@paypal/checkout-server-sdk');

paypal.configure({
    'mode': 'sandbox',
    'client_id': "AchX1v_MM8q3XH5DFNtxfnT6pF29uoARl7HOvGnieXDtYRtoUvHQ-f18OvhRU1IxBWPTFNUzKijiWSeD",
    'client_secret': "EGgv5BRHMRqUc91gOiLqngiP3mDthoEObWqVw7tlt8R-hWsYT0bQbSEkQFcp2xuSxIMhAx7WVPnts2iC"
})

var items = [{
  "name": "Premeum Account",
  "sku": "001",
  "price": "200",
  "currency": "USD",
  "quantity": 1
}];

var total = 0;
for(i = 0;i<items.length;i++)
{
total += parseFloat(items[i].price)*items[i].quantity;
}

router.post("/refund", async (req, res) => {
  const originalTransactionId = req.body.data.id_refund;
  const refundReq = {
    amount: {
      total: "180.00",
      currency: "USD",
    },
    description: "Refund for order Premeum",
  };
  paypal.sale.refund(originalTransactionId, refundReq, (err, refund) => {
    if (err) {
      res.status(400).send({ success: false, msg: err });
    } else {
      res.status(200).send({ success: true, data: refund });
    }
  });
});

router.post("/pay", async (req,res) => {
  const create_payment_json = {
      "intent": "sale",
      "payer": {
          "payment_method": "paypal"
      },
      "redirect_urls": {
          "return_url": "http://localhost:3000/premium",
          "cancel_url": "http://localhost:3000/home"
      },
      "transactions": [{
          "item_list": {
              "items": items
          },
          "amount": {
              "currency": "USD",
              "total": total.toString()
          },
          "description": "Hat for the best team ever"
      }]
  };

  paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
        res.render('cancle');
      } else {
          for(let i = 0;i < payment.links.length;i++){
            if(payment.links[i].rel === 'approval_url'){
              res.send({success: true, url: payment.links[i].href})
            }
          }
      }
    });
});

router.get('/cancle', function(req, res){
    res.send({success: false, msg: "Cancle"})
});

router.get("/success/:PayerID&:paymentId",async (req, res) => {
  const payerId = req.params.PayerID;
  const paymentId = req.params.paymentId;

  const execute_payment_json = {
    payer_id: payerId,
    transactions: [
      {
        amount: {
          currency: "USD",
          total: total.toString(),
        },
      },
    ],
  };

  await paypal.payment.execute(
    paymentId,
    execute_payment_json,
    function (error, payment) {
      if (error) {
        res.status(400).send({ success: false, msg: error });
      } else {
        console.log(payment);
        res.status(200).send({ success: true, data: payment });
      }
    }
  );
});

module.exports = router;




