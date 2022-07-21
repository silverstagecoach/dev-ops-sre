const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')

app.use(express.json())
app.use(cors())

var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: '48c22cee1b0643f29c6d141de9ad6b1a',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

rollbar.log('Hello world!')

const students = ['Jimmy', 'Timothy', 'Jimothy']

app.get('/', (req, res) => {
    rollbar.info('Someone loaded your HTML')
    res.sendFile(path.join(__dirname, '/index.html'))
})

app.get('/api/democrat', (req, res) => {
    try {
        fundDemocrats(lotsOfMoney)
    }
    catch {
        rollbar.critical('Someone tried to pay the democrats')
        res.status(400).send('Uh uh uh!')
    }
})

app.get('/api/students', (req, res) => {
    rollbar.info('someone got the list of students to load')
    res.status(200).send(students)
})

app.post('/api/students', (req, res) => {
   let {name} = req.body

   const index = students.findIndex(student => {
       return student === name
   })

   try {
       if (index === -1 && name !== '') {
           rollbar.log('a new name was added', {author: "Jon", type:"manual entry"})
           students.push(name)
           res.status(200).send(students)
       } else if (name === ''){
           rollbar.error('No name provided.')
           res.status(400).send('You must enter a name.')
       } else {
           rollbar.warning('Student already exists.')
           res.status(400).send('That student already exists.')
       }
   } catch (err) {
       console.log(err)
   }
})

app.delete('/api/students/:index', (req, res) => {
    const targetIndex = +req.params.index
    rollbar.info('A student was deleted from the list')    
    students.splice(targetIndex, 1)
    res.status(200).send(students)
})

const port = process.env.PORT || 5050

app.listen(port, () => console.log(`Server listening on ${port}`))
