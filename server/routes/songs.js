const router = require("express").Router();
const song = require("./models/song");

router.post("/save",async (req,res) => {
    const newSong = song(
        {
            name: req.body.name,
            imageURL: req.body.imageURL,
            songURL: req.body.songURL,
            album: req.body.album,
            artist: req.body.artist,
            language: req.body.language,
            category: req.body.category,
            role: req.body.role
        }
    );

    try {
        const saveSong = await newSong.save();
        return res.status(200).send({success: true, song: saveSong});
    } catch (error) {
        return res.status(400).send({success: false, msg: error})
    }
})

router.get("/getOne/:id",async (req,res) => {
    const filter = {_id: req.params.id};

    const data = await song.findOne(filter);

    if(data){
        return res.status(200).send({success: true, song: data});
    }else{
        return res.status(400).send({success: false, msg: "Data not found"})
    }
})

router.get("/getAll", async (req,res) => {
    const data = await song.find().sort([['updatedAt', -1]]);

    if(data){
        return res.status(200).send({success: true, song: data});
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
        const update = await song.updateOne(filter,{
            name: req.body.name,
            imageURL: req.body.imageURL,
            songURL: req.body.songURL,
            album: req.body.album,
            artist: req.body.artist,
            language: req.body.language,
            category: req.body.category,
            role: req.body.role
        },options);
        return res.status(200).send({success: true, data: update});
    } catch (error) {
        return res.status(400).send({success: false, msg: "Update faild!!!"})
    }
})

router.delete("/delete/:id", async (req,res) => {
    const filter = {_id: req.params.id};
    const deleteData = await song.deleteOne(filter);

    if(deleteData){
        return res.status(200).send({success: true, msg: "Data delete success!!!"});
    }else{
        return res.status(400).send({success: false, msg: "Data delete faild!!!"})
    }
})

router.get("/getFavouritesSongs", async (req, res) => {
    const query = req.query.songId;
    res.send(query);
});

module.exports = router;