'use strict';

const express = require('express');
const server = express();
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

server.use(cors());
server.use(express.json());
// Port:
const PORT = process.env.REACT_APP_PORT || 8001;

var mongoose = require("mongoose");

const drinkSchema = new mongoose.Schema({
    strDrink: String,
    strDrinkThumb: String,
    idDrink: String
});
const drinkModel = mongoose.model('drink', drinkSchema);


// : Returned data from api.
server.get('/getDataFromApi' , (req,res)=>{
    const url = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic`;
    axios.get(url).then(result => {
        res.status(200).send(result.data.drinks)
    }).catch(err => {
        console.log(err);
    })
})

//Post: 
server.post('addToFav' , (req,res)=>{
    const {strDrink,strDrinkThumb,idDrink} = req.body;
    const newObj = new drinkModel(
        {strDrink : strDrink,
        strDrinkThumb : strDrinkThumb,
        idDrink: idDrink
    })
    newObj.save();
})

// Get
server.get('getDataFromDB' , (req,res)=>{
    drinkModel.find({} , (err, data)=>{
        if(err){
            console.log('error in getDataFromDB');
        }
        else{
            res.status(200).send(data);
        }
    })
})

// Delte: id: idDrink
server.delete('/deleteDataFromDB/:id' , (req,res)=>{
    const {idDrink} = req.params;
    drinkModel.findOneAndRemove({idDrink:idDrink}, (err,data) => {
        if(err){
            console.log('error in deleteDataFromDB');
        }
        else{
            drinkModel.find({} , (error,data) => {
                if (error){
                    console.log('err');
                }
                else{
                    res.statue(200).send(data);
                }
            })
        }
    })
})

// Update:
server.put('/updateDataFromDB' , (req,res) => {
    const {strDrink,strDrinkThumb,idDrink} = req.body
    drinkModel.findOne({idDrink:idDrink} , (err,data)=>{
        if (err){
            console.log('error in update');
        }
        else{
            data.strDrink=strDrink;
            data.strDrinkThumb=strDrinkThumb;
            data.save().then(()=>{
                drinkModel.find({} , (err,data)=>{
                    if(err){
                        console.log(err)
                    }
                    else{
                        res.status(200).send(data);
                    }
                })
            })
        }

    })
})

mongoose.connect('mongodb://localhost:27017/DB_NAME', { useNewUrlParser: true, useUnifiedTopology: true });



//Routes:
server.get('/', (req, res) => {
    res.send('Welcome in 401 entrance exam.');
})
server.listen(PORT, () => {
    console.log(`Port value = ${PORT}`);
})