---
title: "Debouncing hecho fácil"
type: post
slug: "debouncing-hecho-facil"
layout: layouts/post.njk
permalink: /debouncing-hecho-facil/index.html
date: "2018-02-27T23:11:22Z"
categories:
  - name: "Experimentos"
    slug: "experimentos"
  - name: "Javascript"
    slug: "javascript"
featuredImage: "/assets/uploads/2021/01/1_W1VKVUbfVfz2yeBS3HcgVA.png"
featuredImageAlt: "1_W1VKVUbfVfz2yeBS3HcgVA"
---

¿Alguna vez les ha pasado que están escuchando un evento y tienen que hacer que reaccione algo a los cambios, pero dicho evento dispara varias decenas de acciones por segundo (o cientos o miles!!!!)?

Peor aún, si tienes que mandar dichos cambios por AJAX al backend, te topas con que saturas el servidor, te truena las conecciones o simplemente te banean por intento de DDoS.

> mi vendors.js pesa 10mb!!!!

Entonces lo que tu necesitas es un debouncer.

Sacado de la [documentación de VueJs](https://vuejs.org/v2/guide/computed.html#Watchers), justamente tienen este problema y lo resuelven con [\_.debounce](https://www.npmjs.com/package/lodash.debounce) que viene en [lodash](https://lodash.com/). Y no me entiendan mal, si ya estás usando lodash, adelante. Pero si vas a cargar toda una librería por solo un elemento, mejor intenta resolverlo tu mismo, si no te vas a enfrentar al clásico "mi vendors.js pesa 10mb!!!!" sin contar que le metes carga excesiva a tu webpack cada que guardas... como sea, aqui mi solución:

```javascript
class Debouncer {
  constructor (fn, timeout) {
    this.fn = fn
    this.timeout = timeout
    this.pile = []
    this.working = false
  }
  execute () {
    if (this.working) return
    this.working = true
    this.pile = []
    this.fn(() => {
      setTimeout(() => {
        this.working = false
        this.tryExecute()
      }, this.timeout)
    })
  }
  tryExecute () {
    if (this.pile.length === 0) return
    this.execute()
  }
  touch () {
    this.pile.push(true)
    this.tryExecute()
  }
}
```

Y la forma de utilizarlo es:

```javascript
const debouncer = new Debouncer(((cb) => {
  // aquí tu llamada de AYAX
  // en el callback, solo llama "cb"
  $.post('endpoint', payload, cb)
}), 1000) // este parámetro es la cantidad de milisegundos para debouncear
```

Obvio si usas promesas, solo cambia los callbacks por promesas.

Aquí un ejemplo funcionando: [https://runkit.com/zerodragon/debouncer-example](https://runkit.com/zerodragon/debouncer-example)

Como pueden ver, se mandó a llamar la función 10 veces, pero solo se ejecutó dos (una al inicio y otra por todas las acumuladas al pasar los 1000 milisegundos de espera)

Zero Out
