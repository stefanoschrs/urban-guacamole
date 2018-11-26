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
      saveAll: () => {
        fetch(apiBase + '/data', {
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

  fetch(apiBase + '/data')
    .then((res) => res.json())
    .then((res) => {
      originalLanguage = JSON.parse(JSON.stringify(res.languageData))
      vueData.language = JSON.parse(JSON.stringify(res.languageData))
    })
    .catch((error) => console.log(error))
})()
