const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');

app.use(cors());


app.get('/api', function(req, res) {

    if(req.url == '/favicon.ico') {
        res.end();
    }

    const json = fs.readFileSync('count.json', 'utf-8');
    const obj = JSON.parse(json);

    obj.pageviews++;
    if(req.query.type === 'visit-pageview') {
        obj.visits++;
    }

    const newJSON = JSON.stringify(obj)

    fs.writeFileSync('count.json', newJSON);

    res.send(newJSON);

})

app.listen(3002, () =>{
    console.log('server running on port 3002');
}) 