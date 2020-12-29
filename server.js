// console.clear()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
if (process.env.NODE_ENV !== 'production') { require('dotenv').config() }

const { mongoose } = require('./db/mongoose');
const { User } = require('./models/user')
const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/exercise/new-user', (req, res) => {
  const username = req.body.username;

  const userData = new User({
    username
  })

  userData.save().then((doc) => {
    res.json({
      username: doc.username,
      _id: doc._id
    })
  }).catch((error) => {
    console.log('first error', error);
    if (error.errors && error.errors.username) {
      res.send(error.errors.username.message)
    } else if (error.keyValue && error.keyValue.username) {
      res.send('Username already taken')
    } else {
      res.send('error something else')
    }
  })

})


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
