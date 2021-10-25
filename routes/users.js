const express = require('express')
// const user = require('../models/user')
const router = express.Router()
const User = require('../model/user')
const auth = require('./../middleware/auth')

//Get all-------------------------------------------------------
router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

//Get one-------------------------------------------------------
router.get('/:id', auth, getUser, (req, res) => {
  res.send(res.user)
})

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjE3NzE1NTdhMzY2MzZkNDljYzk2NmE0IiwiZW1haWwiOiJ1c2VyMkBnbWFpbC5jb20iLCJpYXQiOjE2MzUxOTU5NTgsImV4cCI6MTYzNTIwMzE1OH0.a91IIBj8AHhafo-qgUKN95buVRp1Z5I-72PWQWD7Wrg

// //Create one-------------------------------------------------------
// router.post('/', async (req, res) => {
//   const user = new User({
//     name: req.body.name,
//     lastName: req.body.lastName,
//     password: req.body.password,
//   })

//   try {
//     const newUser = await user.save()
//     res.status(201).json(newUser)
//   } catch (err) {
//     res.status(400).json({ message: err.message })
//   }
// })

// //Update one-------------------------------------------------------
// router.patch('/:id', getUser, async (req, res) => {
//   if (req.body.name != null) {
//     res.user.name = req.body.name
//   }
//   if (req.body.lastName != null) {
//     res.user.lastName = req.body.lastName
//   }
//   try {
//     const updatedUser = await res.user.save()
//     res.json(updatedUser)
//   } catch (err) {
//     res.status(400).json({ message: err.message })
//   }
// })

// //Delete one-------------------------------------------------------
// router.delete('/:id', getUser, async (req, res) => {
//   try {
//     await res.user.remove()
//     res.json({ message: 'Deleted user' })
//   } catch (err) {
//     res.status(500).json({ message: err.message })
//   }
// })

async function getUser(req, res, next) {
  let user
  try {
    user = await User.findById(req.params.id)
    if (user == null) {
      return res.status(404).json({ message: 'Cannot find user' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.user = user
  next()
}

module.exports = router
