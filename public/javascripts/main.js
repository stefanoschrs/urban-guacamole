(function () {
  const apiBase = '/api'

  const vueData = {
    dirty: false,
    language: {}
  }
  const app = new Vue({
    el: '#app',
    data: vueData,
    methods: {
      hasChanged: (key) => {
        const [a, b] = getKeyContent(key)

        const languages = Object.keys(a.translations)

        for (let i = 0; i < languages.length; i++) {
          if (a.translations[languages[i]].content !== b.translations[languages[i]].content) {
            return true
          }
        }

        return false
      },
      update: (key) => {
        const [a, b] = getKeyContent(key)

        Object
          .keys(a.translations)
          .forEach((lan) => {
            b.translations[lan].content = a.translations[lan].content
            b.translations[lan].lastModified = new Date()
          })

        vueData.dirty = true

        // HACK: Remove this
        app.$forceUpdate()
      },
      clear: (key) => {
        const [a, b] = getKeyContent(key)

        Object
          .keys(a.translations)
          .forEach((lan) => {
            a.translations[lan].content = b.translations[lan].content
          })
      },
      saveFile () {
        fetch(`${apiBase}/data/${window.I18N_ID}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            language: originalLanguage
          })
        })
          .then((res) => res.json())
          .then((res) => {
            console.log(res)
          })
          .catch((error) => console.log(error))

        vueData.dirty = false
      },
      exportPDF () {
        const docDefinition = {
          content: []
        }

        let text

        Array.prototype.forEach.call(document.querySelectorAll('.content-row'), (el) => {
          text = el.querySelector('.key').innerText
          docDefinition.content.push({ text, fontSize: 15 })
          console.log(text)

          Array.prototype.forEach.call(el.querySelectorAll('input'), (input) => {
            text = input.value
            docDefinition.content.push(text)
            console.log(text)
          })

          docDefinition.content.push(' ')
        })

        pdfMake.createPdf(docDefinition).download(`${window.I18N_ID}-i18n.pdf`)
      }
    }
  })

  let originalLanguage

  function getKeyContent (key) {
    return [
      vueData.language.index.content[key],
      originalLanguage.index.content[key]
    ]
  }

  fetch(`${apiBase}/data/${window.I18N_ID}`)
    .then((res) => res.json())
    .then((res) => {
      originalLanguage = JSON.parse(JSON.stringify(res.languageData))
      vueData.language = JSON.parse(JSON.stringify(res.languageData))
    })
    .catch((error) => console.log(error))
})()
