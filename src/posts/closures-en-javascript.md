---
title: "Closures en Javascript"
type: post
slug: "closures-en-javascript"
layout: layouts/post.njk
permalink: /closures-en-javascript/index.html
date: "2017-10-04T22:59:44Z"
categories:
  - name: "Experimentos"
    slug: "experimentos"
  - name: "Javascript"
    slug: "javascript"
featuredImage: "/assets/uploads/2021/01/1_PRW3_d0_k9wAM3mwz2TnZA.jpg"
featuredImageAlt: "1_PRW3_d0_k9wAM3mwz2TnZA"
---

> Yo dagw, una función que regresa una función para que puedas llamar una función mientras ejecutas otra…

Ok digamos que tienes una librería (casi siempre una de base de datos) que te regresa los valores usando un callback. Por lo general dichos callbacks requieren un formato básico (error, respuesta).

Pero digamos que necesitas inyectarle una o varias variables extras al callback. Como no tienes control sobre la forma en que te manda de regreso los valores el módulo.

Claro que siempre puedes hacer anidaciones sobre anidaciones y usar diferentes scopes para pasar valores en variables de un lado a otro… O puedes hacer closures. Primero veamos un ejemplo de un closure sencillo en javascript (ES6):

```javascript
const mockDBCall = (query, callback) => {
 console.dir({ query }, { colors: true });
 callback(null, true);
};
const miCallback = envVar => (err, data) => {
 console.dir({ envVar, err, data }, { colors: true });
};
const miFuncion = envVar => {
 mockDBCall(“esta es mi query”, miCallback(envVar));
};
miFuncion(“development”);
```

Esto nos va a regresar el siguiente output:

```javascript
{ query: ‘esta es mi query’ }
{ envVar: ‘development’, err: null, data: true }
```

Como podemos ver, la función `miCallback` recibe un valor extra al inicio, pero al mismo tiempo funciona de forma transparente como un callback normal de tipo `(Error, Response)`

Esto es en especial importante, pues no rompe la funcionalidad existente, de hecho funciona de forma transparente.

Bien, ahora vamos a verlo parte por parte:\\ Las funciones `mockDBcall` y `miFuncion` son solo funciones de apoyo, toda la magia se ejecuta dentro de `miCallback`

Ahora vamos a descomponer esta función. Traduciendola a [ES5](http://ecma-international.org/ecma-262/5.1/), pues como está presentada ahora está en [ES6](http://es6-features.org/). Esto quedaría así:

```javascript
var miCallback = function(envVar) {
 return function(err, data) {
 console.dir({ envVar, err, data }, { colors: true });
 };
};
```

Ya empieza a tomar un poco más de forma... Ahora bien, vamos a ver que está sucediendo aquí...

La función miCallback es ejecutada con una variable (en este caso es `envVar`) y regresa una función anónima, la cual cumple con los parámetros requeridos de un callback normal.

Sin embargo, como recibe una variable inicial, esta variable existe dentro del scope de la función y se hereda en la anónima. Por lo tanto esta co-existe y se puede acceder a ella.

Al final del día esto se puede hacer dinámico, de esta forma puedes tener una sola función que (por ejemplo) maneje logins de facebook y de google y dependiendo del servicio le mandas una u otra variable, o incluso podrías regresar una u otra estrategia de login... las posibilidades son ilimitadas xD.

Hasta aquí con eso. Si te gustó lo que leíste, no olvides compartirlo!

Zero out
