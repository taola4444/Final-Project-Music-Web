const router = require("express").Router();
const account = require("./models/account");

router.post("/register",async (req,res) => {
    const newAccount = account(
        {
            displayName: req.body.displayName,
            email: req.body.email,
            photoURL: req.body.photoURL,
            uid: req.body.uid,
            role: "member"
        }
    );

    try {
        const saveAccount = await newAccount.save();
        return res.status(200).send({success: true, account: saveAccount});
    } catch (error) {
        return res.status(400).send({success: false, msg: error})
    }
})

router.get("/getOne/:id",async (req,res) => {
    const filter = {uid: req.params.id};

    const data = await account.findOne(filter);

    if(data){
        return res.status(200).send({success: true, account: data});
    }else{
        return res.status(400).send({success: false, msg: "Email or Password invalid!!!!"})
    }
})

module.exports = router;