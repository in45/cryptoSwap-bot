const express = require("express")
const bodyParser = require("body-parser")
var cors = require('cors')
const fs = require('fs')
var swap = require("./bot.js");
const axios = require('axios')


const PORT = process.env.PORT || 5000
const app = express()
var prix = 0
var amount_in = 0
var test = 0
app.use(cors())

app.set("json spaces", 2)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get("/config", (req, res) => {
  fs.readFile('config.json', 'utf-8', (err, data) => {
    if (err) {
         console.log(err);
    }

    // parse JSON object
    else{
      const d = JSON.parse(data.toString());

    // print JSON object
    console.log(d);
    res.status(200).json(d);
  }
    
});
  

})

async function conv(s1,s2){
  try {
    var a = await axios.get('https://nomics.com/data/currencies-ticker?filter=any&include-fiat=true&interval=1d,7d,30d,ytd,365d&quote-currency='+s2+'&symbols='+s1)
    //console.log("a:",a.data.items[0].price)
    return a.data.items[0].price
  } catch (error) {
    console.error(error)
  }
}


app.post("/script", async (req, res) => {
console.log(req.body);
const data = JSON.stringify(req.body);

// write JSON string to a file
fs.writeFile('config.json', data, (err) => {
    if (err) {
        console.log(err);
    }
    console.log("JSON data is saved.");
});
let pourc_enter = req.body.pourc/100
if(test == 0) amount_in = req.body.amount_in
else  amount_in = req.body.amount_in*req.body.amount_in2
console.log("pourc enter=",pourc_enter) 
console.log("amount step2 =",req.body.amount_in*req.body.amount_in2)
let tx = await swap.a(req.body,req.body.token1,req.body.token2,amount_in);
console.log("tx =",tx)
setInterval( async function () {
  let a = await conv(req.body.symbole1,req.body.symbole2)  //1 T1 = a T2
  console.log("1 "+req.body.symbole1+" = "+a+" "+req.body.symbole2)
  prix = a * amount_in // amount_in T1 = prix T2
  console.log(amount_in+req.body.symbole1+" = "+prix+" "+req.body.symbole2)
 
   // if(tx){

    let b = await conv(req.body.symbole2,req.body.symbole1) //1 T2 = b T1
    console.log("1 "+req.body.symbole2+" = "+b+" "+req.body.symbole1)
    let z = b * prix // prix T2 = z T1
    console.log(prix+" "+req.body.symbole2+" = "+z+" "+req.body.symbole1)
    test = 1
    let pourc = (z-amount_in)/amount_in
    console.log("pourc =",pourc) 
    if(z-pourc>=pourc_enter) await swap.a(req.body,req.body.token2,req.body.token1,prix)
  // }

},5000);

 res.status(200).json({message: 'ok'});    

})

app.listen(PORT, function () {
  console.log(`Express server listening on port ${PORT}`)
})


