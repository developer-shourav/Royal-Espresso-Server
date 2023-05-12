const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 7000 ;




// Middleware 
app.use(cors())
app.use(express.json())


// Home Route 

app.get( '/' , (req, res) => {
    res.send('Welcome to Royal Espresso Server')
})






// Must have 
app.listen( port , () => {
    console.log(`Our Coffee shop server is Running on the PORT: ${port}`);
})