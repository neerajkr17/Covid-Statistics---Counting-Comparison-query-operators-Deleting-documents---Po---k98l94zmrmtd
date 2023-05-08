const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const port = 8080
const roundTo = require('round-to');

// Parse JSON bodies (as sent by API clients)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const { connection } = require('./connector')

const {data} = require('./data');
app.get('/totalRecovered', (req, res) => {
    let recoveredCount = 0;
    data.map(item => {
        recoveredCount += item.recovered;
    });
    res.send({
        data: {
            _id: "total",
            recovered: recoveredCount
        }
    });
    return;
});

app.get('/totalActive', (req, res) => {
    let activeCount = 0;
    data.map(item => {
        activeCount += (item.infected - item.recovered);
    });
    res.send({
        data: {
            _id: "total",
            active: activeCount
        }
    });
    return;
});

app.get('/totalDeath', (req, res) => {
    let deathCount = 0;
    data.map(item => {
        deathCount += item.death;
    });
    res.send({
        data: {
            _id: "total",
            death: deathCount
        }
    });
    return;
});

app.get('/hotspotStates', (req, res) => {
    let hotspotStates = [];
    data.map(item => {
        let infected = item.infected;
        let recovered = item.recovered;

        if((infected - recovered) / infected > 0.1) {
            let obj = {
                state : item.state,
                rate : roundTo((infected - recovered) / infected, 5)
            }
            hotspotStates.push(obj);
        }
    });
    res.send({
        data: hotspotStates.map(item => item)
    });
    return;
});

app.get('/healthyStates', (req, res) => {
    let healthyStates = [];
    data.map(item => {
        let infected = item.infected;
        let death = item.death;

        if(death / infected < 0.005) {
            let obj = {
                state : item.state,
                mortality : roundTo(death / infected, 5)
            }
            healthyStates.push(obj);
        }
    });
    res.send({
        data: healthyStates.map(item => item)
    });
    return;
});





app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;
