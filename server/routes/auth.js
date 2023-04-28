const router = require("express").Router();

const user = require("./models/user");

const admin = require("./config/firebase");

const bcrypt = require("bcrypt");

router.get("/loginWithEmailAndPassword/:email&:password&:user_id", async (req,res) => {
    try {
        const email = await user.findOne({email: req.params.email});
        const user_id = await user.findOne({user_id: req.params.user_id});
        if(!email){
            return res.status(400).json("Wrong email!!!")
        }
        if(!user_id){
            return res.status(400).json("Account not yet register, please try again!!!")
        }
    
        const validPassword = await bcrypt.compareSync(
            req.params.password,user_id.password
        )

        if(!validPassword){
            return res.status(400).json("Wrong password!!!")
        }
        
        if(validPassword && user_id) {
            res.status(200).send({user: user_id});
        }
    } catch (error) {
        res.status(400).send({success: false, data: "Login faild!!!"})
    }
})

router.get("/login", async (req,res) => {
    if(!req.headers.authorization){
        return res.status(500).send({message : "Invalid Token"});
    }
    const token = req.headers.authorization.split(" ")[1];
    try {
        const decodeValue = await admin.auth().verifyIdToken(token);
        if(!decodeValue){
            return res.status(505).json({message: "User unauthorization"});
        }

        const userExists = await user.findOne({"user_id" : decodeValue.user_id});
        if(decodeValue.email_verified){
            if (!userExists) {
                newUserData(decodeValue,req,res);
              } else {
                updateUserData(decodeValue,req,res);
            }
        }else{
            updateUserData(decodeValue,req,res);
        }

    } catch (error) {
        return res.status(505).json({message : error});
    }
})

router.post("/register", async(req,res) => {
    const salt = bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(req.body.data.password.toString(),parseInt(salt));
        const newUser = new user({
            email: req.body.data.email,
            password: hashed,
            name:req.body.data.name,
            imageURL:req.body.data.imageURL,
            user_id:req.body.data.user_id,
            email_verified:req.body.data.email_verified,
            id_refund: "",
            role: "member",
            auth_time: req.body.data.auth_time
        });
    try {
        const savedData = await newUser.save();
        res.status(200).send({success: true, data: savedData})
    } catch (error) {
        res.status(400).send({success: false, msg: error})
    }
})

// new user mongoose
const newUserData = async (decodeValue,req,res) => {
    const newUser = new user({
        name: decodeValue.name,
        email: decodeValue.email,
        imageURL: decodeValue.email,
        email_verified: decodeValue.email_verified,
        role: "member",
        user_id: decodeValue.user_id,
        id_refund: "",
        auth_time: decodeValue.auth_time
    })
    try {
        const savedData = await newUser.save();
        res.status(200).send({user: savedData});
    } catch (error) {
        res.status(400).send({success: false,msg: error});
    }
}

//update user mongoose
const updateUserData = async (decodeValue, req,res) => {
    const filter = {user_id: decodeValue.user_id};
    const option = {
        upsert: true,
        new: true
    };
    try {
        const result = await user.findOneAndUpdate(filter,{auth_time: decodeValue.auth_time},option);
        res.status(200).send({user:result})
    } catch (error) {
        res.status(400).send({success: false,msg: error});
    }
}

router.get("/getUsers", async (req,res) => {
    const cursor = await user.find().sort([['createdAt', -1]]);

    if(cursor){
        res.status(200).send({success: true, data: cursor})
    }else{
        res.status(400).send({success: false,msg: "No data found"});
    }
});

router.get("/getUserById/:userId", async (req,res) => {
    const filter = {_id: req.params.userId};

    try {
        const result = await user.findById(filter);
        res.status(200).send({user: result})

    } catch (error) {
        res.status(400).send({success: false,msg: error})
    }
});

router.put("/updateRole/:userId", async (req,res) => {
    const filter = {_id: req.params.userId};
    const role = req.body.data.role;

    try {
        const result = await user.findByIdAndUpdate(filter,{role: role});
        res.status(200).send({user: result})

    } catch (error) {
        res.status(400).send({success: false,msg: error})
    }
})

router.put("/changePassword/:userId&:password",async (req,res) => {
    const filter = {user_id: req.params.userId};
    const salt = bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(req.params.password.toString(),parseInt(salt));
    const data = {
        password: hashed
    };
    try {
        const result = await user.findOneAndUpdate(filter,data);
        console.log(result);
        res.status(200).send({user: result})
    } catch (error) {
        return res.status(400).send({success: false, msg: error})
    }
})

router.put("/updateUser/:userId", async (req,res) => {
    const filter = {_id: req.params.userId};
    const data = {
        name: req.body.name,
        imageURL: req.body.imageURL,
    };

    try {
        const result = await user.findByIdAndUpdate(filter,data);
        res.status(200).send({user: result});
    } catch (error) {
        res.status(400).send({success: false, msg: error})
    }    
})

router.put("/updateRoleAndRefund/:userId", async (req,res) => {
    const filter = {_id: req.params.userId};
    const role = req.body.data.role;
    const id_refund = req.body.data.id_refund;
    const payer_id = req.body.data.payer_id;
    const create_time = req.body.create_time;
    const amount = req.body.amount;

    try {
        const result = await user.findByIdAndUpdate(filter,{role: role,id_refund: id_refund,payer_id: payer_id,create_time: create_time,amount: amount});
        res.status(200).send({user: result})

    } catch (error) {
        res.status(400).send({success: false,msg: error})
    }
})

router.delete("/deleteFirebase/:uid", async (req,res) => {
    try {
        await admin.auth().deleteUser(req.params.uid);
        res.status(200).send({success: true,msg: "Delete success!!!"});
      } catch (error) {
        res.status(400).send({success: true,msg: "Delete faild!!!"});      
    }
})

router.delete("/delete/:id", async (req,res) => {
    const filter = {_id: req.params.id};
    const deleteData = await user.deleteOne(filter);

    if(deleteData.deletedCount === 1){
        res.status(200).send({success: true, msg: "Data delete success!!!"});
    }else{
        res.status(400).send({success: false, msg: "Data delete faild!!!"})
    }
})

// add favorite

router.put("/favourites/:userId", async (req, res) => {
  const filter = { _id: req.params.userId };
  const song_id = req.query;
  try {
    const result = await user.updateOne(filter, {
      $push: { favourites: song_id },
    });
    res.status(200).send({ success: true, msg: "Song added to favourites" });
  } catch (error) {
    res.status(400).send({ success: false, msg: error });
  }
});

router.put("/removeFavourites/:userId", async (req, res) => {
  const filter = { _id: req.params.userId };
  const song_id = req.query;

  try {
    const result = await user.updateOne(filter, {
      $pull: { favourites: song_id },
    });
    res.status(200).send({ success: true, msg: "Song removed from favourites" });
  } catch (error) {
    res.status(400).send({ success: false, msg: error });
  }
});

router.get("/getUser/:userId", async (req, res) => {
    const filter = { _id: req.params.userId };
    const userExists = await user.findOne({ _id: filter });
    if (!userExists)
      return res.status(400).send({ success: false, msg: "Invalid User ID" });
    if (userExists.favourites) {
      res.status(200).send({ success: true, data: userExists });
    } else {
      res.status(400).send({ success: false, data: null });
    }
});

module.exports = router;