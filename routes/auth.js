require('dotenv').config()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('./../model/user')
const auth = require('./../middleware/auth')
const express = require('express')
const router = express.Router()

router.post('/register', async (req, res) => {
  try {
    // Get user input
    const { first_name, last_name, email, password } = req.body

    // Validate user input
    if (!(email && password && first_name && last_name)) {
      res.status(400).send('All input is required')
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email })

    if (oldUser) {
      return res.status(409).send('User Already Exist. Please Login')
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10)

    // Create user in our database
    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    })

    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: '2h',
      }
    )
    // save user token
    user.token = token

    // return new user
    res.status(201).json(user)
  } catch (err) {
    console.log(err)
  }
})

router.post('/login', async (req, res) => {
  try {
    // Get user input
    const { email, password } = req.body

    // Validate user input
    if (!(email && password)) {
      res.status(400).send('All input is required')
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email })

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: '2h',
        }
      )

      // save user token
      user.token = token

      // user
      res.status(200).json(user)
    }
    res.status(400).send('Invalid Credentials')
  } catch (err) {
    console.log(err)
  }
})

router.get('/welcome', auth, (req, res) => {
  console.log(req.user)
  res.status(200).send('Welcome 🙌 ')
})

//Get user id-------------------------------------------------------
router.get('/id', auth, (req, res) => {
  try {
    res.send(req.user.user_id)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
