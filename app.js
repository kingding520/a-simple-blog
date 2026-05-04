const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const methodOverride = require('method-override')  

const app = express()

// 数据库
mongoose.connect('mongodb://127.0.0.1:27017/blog')

// 中间件
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'))

// 支持 PUT / DELETE
app.use(methodOverride('_method'))

app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false
}))

// 全局 user
app.use((req, res, next) => {
  res.locals.user = req.session.user || null
  next()
})

// 模板引擎
app.set('view engine', 'ejs')

// 首页
app.get('/', (req, res) => {
  res.redirect('/articles')
})

// 路由
const authRouter = require('./routes/auth')
const articlesRouter = require('./routes/articles')

app.use(authRouter)
app.use('/articles', articlesRouter)

// 启动
app.listen(3000, () => {
  console.log('http://localhost:3000')
})