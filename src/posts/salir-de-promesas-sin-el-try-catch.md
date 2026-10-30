---
title: "Salir de promesas sin el try/catch"
type: post
slug: "salir-de-promesas-sin-el-try-catch"
layout: layouts/post.njk
permalink: /salir-de-promesas-sin-el-try-catch/index.html
date: "2021-08-02T15:45:31Z"
categories:
  - name: "Experimentos"
    slug: "experimentos"
  - name: "Javascript"
    slug: "javascript"
  - name: "NodeJS"
    slug: "nodejs"
featuredImage: "/assets/uploads/2021/08/brand-promise-2.jpg.png"
featuredImageAlt: "una-promesa.jpg"
---

Hace unas horas estaba leyendo [este post](https://dev.to/avishkardalvi/migrating-from-promise-chains-to-async-await-and-escaping-the-try-catch-hell-191l) donde una persona explica como poder cambiar de cadenas de promesas a un mundo síncrono con async/await. Sin emgargo, el problema con async/await es la necesidad de usar try/catch para poder tener un fallback de cuando una promesa truena. Efectivamente cambias esto:

```javascript
const myFn = () => {
  myPromise
    .then(response => {
      console.log('here')
    })
    .catch(error => {
      console.log('error here')
    })
}
```

a

```javascript
const myFn = async () => {
  let response
  try {
    response = await myPromise
  } catch (error) {
    response = error
  }
}
```

Básicamente no hay mejora, pues el código sigue siendo igual de complicado de leer, además si no manejas el catch de la promesa rota, el intérprete te va a regresar una excepción.

Entonces en el post, [@avishkardalvi](https://dev.to/avishkardalvi) nos explica una forma de poder escapar del async/await hell concentrando varias respuestas de estas promesas en un solo lugar y posteriormente regresando una tupla `[error, respuesta]`. Siento que es una buena forma de darle la vuelta a este problema, pero le faltó un poquito para que fuera redonda. Entonces ESTE es mi approach para el mismo problema, basado en la propuesta original.

```javascript
const aP = async promise => {
  let res, err
  try {
    res = await promise
  } catch (e) {
    err = e
  }
  return [err, res]
}

const algo = async _ => {
  const p = new Promise(resolve => resolve('success'))
  const s = await aP(p)
  const p2 = new Promise((_, reject) => reject('error'))
  const s2 = await aP(p2)
  console.log(s, s2)
}

algo()
```

Esto nos va a contestar en cada respuesta de `aP` una tupla con el formato `[error, response]` y eliminando todas las necesidades de tener que meter try/catch en cada una de las promesas y al mismo tiempo conservando la legibilidad del código resultante.

Esto se compone de dos partes:

### Parte 1

El helper

```javascript
const aP = async promise => {
  let res, err
  try {
    res = await promise
  } catch (e) {
    err = e
  }
  return [err, res]
}
```

aP (corto para async promise) es una función que recibe una promesa tal cual, define los dos posibles resultados, intenta ejecutar la promesa y aqui está el único try/catch necesario, observemos que aP es una función async, es decir que incluso la función misma regresa una promesa que se pude encolar con otras promesas.

### Parte 2

La implementación

```javascript
const algo = async _ => {
  const p = new Promise(resolve => resolve('success'))
  const s = await aP(p)
  const p2 = new Promise((_, reject) => reject('error'))
  const s2 = await aP(p2)
  console.log(s, s2)
}

algo()
```

Aquí simplemente definimos una función async donde tenermos dos ejemplos de promesas `p` y `p2`, donde `p` contesta con un resolve (ejemplo todo cool) y `p2` contesta con un reject (ejemplo de una promesa rota) Ambas promesas las pasamos por el `aP` quien intenta resolverlas y regresarnos una respuesta. El resultado es el siguiente:

```javasript
Promise { <pending> }
[ undefined, 'success' ] [ 'error', undefined ]
```

Como pueden ver, en ambos casos, la tupla se genera corréctamente y no hay ningún warning acerca de que hubo un reject sin catch que rompiera la promesa.

¿Qué piensan de esta solución? ¿Les sería útil?

Coméntame en el [telegram](https://t.me/zerodragon) :D

Recuerda si algo de lo que escribo te sirve, no dudes en compartirlo, o [éntrale al patreon](https://patreon.com/zerodragon) si deseas ayudarme con un cafecin para seguir escribiendo este tipo de babosadas :D

Zero out
