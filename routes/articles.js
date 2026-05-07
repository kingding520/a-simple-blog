const express = require('express')
const Article = require('../models/Article')

const router = express.Router()

/* ======================
   列表
====================== */
router.get('/', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: -1 })
  res.render('articles/index', { articles })
})

/* ======================
   新建页面
====================== */
router.get('/new', (req, res) => {
  res.render('articles/new', { article: {} })
})

/* ======================
   创建
====================== */
router.post('/', async (req, res) => {
  try {
    const article = new Article({
      title: req.body.title,
      description: req.body.description,
      markdown: req.body.markdown
    })

    await article.save()

    res.redirect(`/articles/${article._id}`)
  } catch (e) {
    console.log(e)
    res.render('articles/new', { article: req.body })
  }
})

/* ======================
   编辑页面
====================== */
router.get('/:id/edit', async (req, res) => {
  const article = await Article.findById(req.params.id)

  if (!article) {
    return res.redirect('/articles')
  }

  res.render('articles/edit', { article })
})

/* ======================
   更新
====================== */
router.put('/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)

    if (!article) {
      return res.redirect('/articles')
    }

    article.title = req.body.title
    article.description = req.body.description
    article.markdown = req.body.markdown

    await article.save()

    res.redirect(`/articles/${article._id}`)
  } catch (e) {
    console.log(e)
    res.render('articles/edit', { article: req.body })
  }
})

/* ======================
   删除
====================== */
router.delete('/:id', async (req, res) => {
  await Article.findByIdAndDelete(req.params.id)

  res.redirect('/articles')
})

/* ======================
   详情（⚠️ 最后）
====================== */
router.get('/:id', async (req, res) => {
  const article = await Article.findById(req.params.id)

  if (!article) {
    return res.redirect('/articles')
  }

  res.render('articles/show', { article })
})

module.exports = router
//本段代码由chatgpt生成