const fs = require('fs')

const express = require('express')

const config = require('../i18n-manager')

const router = express.Router()

router.get('/', (req, res) => {
  res.render('index')
})

router.get('/api/data', (req, res) => {
  const filename = config.files[0].path

  res.json({
    languageData: JSON.parse(fs.readFileSync(filename, 'utf8'))
  })
})

router.post('/api/data', (req, res) => {
  const filename = config.files[0].path

  fs.copyFileSync(filename, filename.replace('.json', `.${Date.now()}.json`))
  fs.writeFileSync(filename, JSON.stringify(req.body.language))

  res.sendStatus(200)
})

module.exports = router
