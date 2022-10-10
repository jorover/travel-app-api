const express = require('express');
const routes = express.Router();
const multer = require('multer');
const Model = require('../Model/model');
const storage = require('../Storage/storage')


const upload = multer({ storage: storage })


routes.use((req, res, next) => {
    console.log('Time: ', Date.now())
    next()
})


routes.get('/', async(req, res) => {
    try {
        const data = await Model.find();
        res.status(200).json(data);  
    } catch (error) {
      res.status(400).json({ errorMessage: error})
      console.log(error)  
    }
})

routes.get('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const getItem = await Model.findById(id)
        res.status(200).json(getItem)
    } catch (error) {
        res.status(400).json({errorMessage: 'User Not Found'})
    }
})


routes.post('/', upload.array('uploadFile', 3), async(req, res, next) => {
    const newData = new Model({
        name: req.body.name,
        city: req.body.city,
        imageOne: req.body.imageOne,
        imageTwo: req.body.imageTwo,
        imageThree: req.body.imageThree,
        cost:req.body.cost,
        heritage: req.body.heritage,
        places: req.body.places,
        information: req.body.information
    })


    try {
        const dataToSave = await newData.save();
        res.status(200).json(dataToSave);
    } catch (error) {
        res.status(400).json({errorMessage: error})
    }

})


routes.put('/:id', upload.array('uploadFile', 3), async(req, res, next) => {
    const id = req.params.id;
    const newData = req.body;
    const options = {new: true}

    try {   
    const updateData = await Model.findByIdAndUpdate(id, newData, options)
    res.send(updateData)     
    } catch (error) {   
        res.status(400).json({errorMessage: 'Cant update User'})
    }

})

routes.delete('/:id', async(req, res) => {
    const id = req.params.id;
    try {
    const del = await Model.findByIdAndDelete(id)
    res.status(200).send(`${del.name}'s experience has been deleted `)   
    } catch (error) {
       res.status(400).json('Data is yet to be removed') 
    }
})




module.exports = routes;