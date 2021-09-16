// Matt Franchi // Project 3 // CPSC 3750

// from example
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// time code
app.get('/time', (req, res) => {
	const today = new Date();
	// toString automatically returns specified output
	res.send(today.toString())
})

// all other cases
// uses : regexp to get path
app.get('*',(req,res) => {
	res.send('The path was ' + req.path)
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
