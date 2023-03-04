const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config();
const Visit = require('./visit.js');
const PageView = require('./page_view.js');
const Win = require('./win.js');

app.use(cors());


app.get('/api', async function(req, res) {

    if(req.url == '/favicon.ico') {
        res.end();
    }

    await mongoose.connect(process.env.MONGO_URL);
     
    const visit = await Visit.findOne();
    const pageView = await PageView.findOne();
    const win = await Win.findOne();
    
    pageView.amount += 1;
    win.amount += 1;

    pageView.save();
    win.save();

    const json = fs.readFileSync('count.json', 'utf-8');
    const obj = JSON.parse(json);

    obj.pageviews = pageView.amount;
    obj.wins = win.amount;
    if(req.query.type === 'visit-pageview') {
        visit.amount += 1;
        visit.save();
        obj.visits = visit.amount;
    }

    const newJSON = JSON.stringify(obj);

    fs.writeFileSync('count.json', newJSON);

    res.send(newJSON);

})

app.listen(3002, () =>{
    console.log('server running on port 3002');
}) 