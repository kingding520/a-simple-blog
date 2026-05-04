const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/User')

/* ======================
   注册页面
====================== */
router.get('/register', (req, res) => {
  res.render('register')
})

/* ======================
   注册逻辑
====================== */
router.post('/register', async (req, res) => {
  const { username, password } = req.body

  const exist = await User.findOne({ username })
  if (exist) {
    return res.render('register', { error: '用户已存在' })
  }

  const hash = await bcrypt.hash(password, 10)

  await User.create({
    username,
    password: hash
  })

  res.redirect('/login')
})

/* ======================
   登录页面
====================== */
router.get('/login', (req, res) => {
  res.render('login')
})

/* ======================
   登录逻辑
====================== */
router.post('/login', async (req, res) => {
  const user = await User.findOne({ username: req.body.username })

  if (!user) {
    return res.render('login', { error: '用户不存在' })
  }

  const ok = await bcrypt.compare(req.body.password, user.password)

  if (!ok) {
    return res.render('login', { error: '密码错误' })
  }

  req.session.user = {
    _id: user._id,
    username: user.username
  }

  res.redirect('/articles')
})

/* ======================
   登出
====================== */
router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/login')
})

module.exports = router