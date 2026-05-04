const mongoose = require('mongoose')
const slugify = require('slugify')
const marked = require('marked')

const articleSchema = new mongoose.Schema({
  title: String,
  description: String,
  markdown: String,
  html: String,
  slug: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// ⭐ 统一在这里处理
articleSchema.pre('save', function(next) {
  this.slug = slugify(this.title, { lower: true, strict: true })
  this.html = marked.parse(this.markdown)
  next()
})

module.exports = mongoose.model('Article', articleSchema)