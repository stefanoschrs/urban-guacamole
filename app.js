const path = require('path')

const express = require('express')
const logger = require('morgan')
const sassMiddleware = require('node-sass-middleware')

const indexRouter = require('./routes/index')

const app = express()

app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(sassMiddleware({
  src: path.join(__dirname),
  dest: path.join(__dirname),
  debug: true,
  indentedSyntax: false
}))

app.use(express.json())

app.use('/public', express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)

module.exports = app
