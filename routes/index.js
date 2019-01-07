const fs = require('fs')

const express = require('express')

const config = require('../i18n-manager.config')

const router = express.Router()

function checkIdMiddleware (req, res, next) {
  const id = req.params.id
  if (!id) {
    return res.sendStatus(404)
  }

  const file = config.files.find((el) => el.id === id)
  if (!file) {
    return res.sendStatus(404)
  }

  res.locals.file = file
  next()
}

router.get('/:id', checkIdMiddleware, (req, res) => {
  // TODO: Also return a name for saving the pdf to a more human readable format
  res.render('index', {
    id: res.locals.file.id
  })
})

router.get('/api/data/:id', checkIdMiddleware, (req, res) => {
  const filename = res.locals.file.path

  res.json({
    languageData: JSON.parse(fs.readFileSync(filename, 'utf8'))
  })
})

router.post('/api/data/:id', checkIdMiddleware, (req, res) => {
  const filename = res.locals.file.path

  fs.copyFileSync(filename, filename.replace('.json', `.${Date.now()}.json`))
  fs.writeFileSync(filename, JSON.stringify(req.body.language))

  res.sendStatus(200)
})

module.exports = router
