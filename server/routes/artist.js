const router = require("express").Router();

const artist = require('./models/artist');

router.post("/save",async (req,res) => {
    const newArtist = artist(
        {
            name: req.body.name,
            imageURL: req.body.imageURL,
            twitter: req.body.twitter,
            instagram: req.body.instagram,
        }
    );

    try {
        const saveArtist = await newArtist.save();
        return res.status(200).send({success: true, artist: saveArtist});
    } catch (error) {
        return res.status(400).send({success: false, msg: error})
    }
})

router.get("/getOne/:id",async (req,res) => {
    const filter = {_id: req.params.id};

    const data = await artist.findOne(filter);

    if(data){
        return res.status(200).send({success: true, artist: data});
    }else{
        return res.status(400).send({success: false, msg: "Data not found"})
    }
})

router.get("/getAll", async (req,res) => {
    const data = await artist.find().sort([['updatedAt', -1]]);

    if(data){
        return res.status(200).send({success: true, artist: data});
    }else{
        return res.status(400).send({success: false, msg: "Data not found"})
    }
})

router.put("/update/:id", async (req,res) => {
    const filter = {_id: req.params.id};

    const options = {
        upsert: true,
        new: true
    };

    try {
        const update = await artist.updateOne(filter,{
            name: req.body.name,
            imageURL: req.body.imageURL,
            twitter: req.body.twitter,
            instagram: req.body.instagram,
        },options);
        return res.status(200).send({success: true, data: update});
    } catch (error) {
        return res.status(400).send({success: false, msg: "Update faild!!!"})
    }
})

router.delete("/delete/:id", async (req,res) => {
    const filter = {_id: req.params.id};
    const deleteData = await artist.deleteOne(filter);

    if(deleteData){
        return res.status(200).send({success: true, msg: "Data delete success!!!"});
    }else{
        return res.status(400).send({success: false, msg: "Data delete faild!!!"})
    }
})

module.exports = router;