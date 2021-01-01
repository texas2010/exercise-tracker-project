// console.clear()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const { ObjectID } = require('mongodb')
if (process.env.NODE_ENV !== 'production') { require('dotenv').config() }

const { mongoose } = require('./db/mongoose');
const { User } = require('./models/user')
const { Exercise } = require('./models/exercise')
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
    if (error.errors && error.errors.username) {
      res.send(error.errors.username.message)
    } else if (error.keyValue && error.keyValue.username) {
      res.send('Username already taken')
    } else {
      res.send('error something else')
    }
  })

})

app.get('/api/exercise/users', (req, res) => {
  User.find().then((docs) => {
    if (!docs) {
      return res.send('users is not exist')
    }
    res.json(docs)
  }).catch((error) => {
    res.send('not found')
  })
})

app.post('/api/exercise/add', (req, res) => {
  const {
    userId,
    description,
    duration,
    date
  } = req.body

  if (!ObjectID.isValid(userId)) {
    return res.status(404).send('userId is not found')
  }

  User.findById(userId).then((user) => {
    if (!user) {
      return res.status(404).send('userId is not found')
    }

    const exerciseData = new Exercise({
      userId,
      description,
      duration,
      date: date ? new Date(date) : new Date()
    })

    exerciseData.save().then((doc) => {
      res.json({
        _id: doc.userId,
        username: user.username,
        date: new Date(doc.date).toDateString(),
        duration: doc.duration,
        description: doc.description
      })
    }).catch((error => {
      if (error.errors && error.errors.userId || error.errors.description || error.errors.duration) {
        res.send('Some information is required.')
      } else {
        res.send('something wrong and failed to save data.')
      }
    }))

  }).catch((error) => {
    res.status(400).send()
  })

})

app.get('/api/exercise/log', (req, res) => {
  console.clear()
  console.log(req.query);
  const {
    userId
  } = req.query

  if (!ObjectID.isValid(userId)) {
    return res.status(404).send('userId is not found')
  }

  User.findById(userId).then((userDoc) => {
    if (!userDoc) {
      return res.status(404).send('userId is not found')
    }

    Exercise.find({ userId }).then((docs) => {
      console.log(docs);

      const newDocs = docs.map(item => ({
        description: item.description,
        duration: item.duration,
        date: new Date(item.date).toDateString()
      }))

      res.json({
        _id: userDoc._id,
        username: userDoc.username,
        count: docs.length,
        log: newDocs,
      })

    }).catch((error) => {
      console.log(error);
      res.send('something wrong??')
    })

  }).catch((error) => {
    console.log(error);
    res.send('something wrong??')
  })

})


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
