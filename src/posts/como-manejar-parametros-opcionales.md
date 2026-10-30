---
title: "Cómo manejar parámetros opcionales"
type: post
slug: "como-manejar-parametros-opcionales"
layout: layouts/post.njk
permalink: /como-manejar-parametros-opcionales/index.html
date: "2021-01-20T15:15:49Z"
categories:
  - name: "Experimentos"
    slug: "experimentos"
  - name: "Javascript"
    slug: "javascript"
featuredImage: "/assets/uploads/2021/01/Untitled.png"
featuredImageAlt: ""
---

Una de las problemáticas más comunes en desarrollo es cuando tienes una función que requiere varios parámetros y varios de ellos son opcionales. Siendo honestos, si pensamos en la forma en que [haskell](https://www.haskell.org/ "haskell") maneja sus funciones:

> Puedes definir una función de n parámetros, pero es equivalente a una función que toma 1 parámetro y regresa otra función que toma (n-1) parámetros. [Yusent](https://twitter.com/yus3nt)

Cambiando el paradigma un poco o pensando más en programación funcional, puedes empezar a partir la función de 10 parámetros en funciones más pequeñas que te permitan un mejor manejo de este paradigma.

Por otro lado, si ya estás en este camino de una función con muchos parámetros, uno de los problemas principales está en que tus llamadas a las funciones se vuelven muy verbosas. Esta fué una pregunta que me hizo [@ulisesBas](https://twitter.com/ulisesBas) el día de ayer.

Veamos el ejercicio:

```javascript
const myFn1 = (param1, param2, param3, param4) => {
  console.log(param1, param2, param3, param4)
}
myFn1('one', 'two', 'three', 'four') // one, two, three, four
myFn1('one', 'two', 'three', 'four') // one, two, three, four
myFn1('one', 'two', 'three', 'four') // one, two, three, four
```

Ahora digamos que algunos de estos parámetros son opcionales (porque, razones). Entonces tienes que empeazar a llenar tu función de excepciones y validaciones.

Afortunadamente, Javascript trae una forma de agregarle defaults a tus parámetros y puedes tener algo así:

```javascript
const myFn2 = (param1, param2 = 'bar', param3 = 'bool', param4 = 'w00t') => {
  console.log(param1, param2, param3, param4)
}
myFn2('one', 'two', 'three', 'four') // one, two, three, four
myFn2('one') // one, two, three, four
myFn2('one', 'two', 'three') // one, two, three, four
myFn2('one', null, 'three', 'four') // one, two, three, four
```

Aqui lo que sucede, es que puedes prescindir de poner los parámetros que están más a la derecha, sin embargo, si el parámetro que quieres omitir está antes de otro, vas a tener que definir su posición; porque a fin de cuentas son parámetros posicionales.

Una forma de combatir esto es organizando los parámetros para poner a la derecha los mas prescindibles, de esa forma puedas usar esta particularidad de la mejor forma. Pero, esto no es siempre posible y estarás llenándote de excepciones en tu código.

### Objeto como único parámetro

Una forma inteligente de manejar este problema es en vez de tener `n` cantidad de parámetros, es solo mandarle un único objeto con los parámetros como propiedades del mismo.

```javascript
const myFn3 = params => {
  console.log(params)
}
myFn3({param1: 'one', param2: 'two', param3: 'three', param4: 'four'})
// {param1: 'one', param2: 'two', param3: 'three', param4: 'four'}
```

> Espera. ¿No se supone que esto debería ser mejor? Esto está más verboso aun que lo anterior y no hay opcionales

Cierto, hay que hacer ciertos ajustes para poderlo hacer opcional:

```javascript
const myFn4 = _params => {
  const params = Object.assign({
    param1: 'one',
    param2: 'two',
    param3: 'three',
    param4: 'four'
  }, _params)
  const { param1, param2, param3, param4 } = params
  console.log(param1, param2, param3, param4)
}
myFn4({ param1: 'one' }) // one, two, three, four
myFn4({ param2: 'two' }) // one, two, three, four
myFn4({ param4: 'four' }) // one, two, three, four
```

Ok ahora nos comimos el trabajo de validar los parámetros, redujimos la cantidad de parámetros obligatorios y ya no hay que preocuparse por los parámetros posicionales. Esto en la implementación es mucho más fácil de meter (aunque precisamente no más fácil de leer).

Sin embargo, aun se siente un poco verboso; ahora bien, en javascript podemos usar [Destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) para darle la vuelta a esta verbosidad:

```javascript
const myFn5 = ({ param1 = 'one', param2 = 'two', param3 = 'three', param4 = 'four' }) => {
  console.log(param1, param2, param3, param4)
}
myFn5({ param1: 'one' }) // one, two, three, four
myFn5({ param2: 'two' }) // one, two, three, four
myFn5({ param4: 'four' }) // one, two, three, four
```

Vaia vaia, ahora está mucho más bonito y obtenemos el mismo resultado. Seamos críticos por un minuto y pensemos ... realmente una función con más de 4 parámetros ya es algo raro, sin embargo, es muy probable que te encuentres con funciones con muchisimos parámetros.. entonces tu definición de la función se va a volver muy larga.

Para estos casos, podemos simplemente reacomodar un poco mejor la definción y de paso podemos hacer que ni siquiera tengas que mandar un objeto en el caso de que el primer parémetro pueda tener un default. Veamos como hacer esto:

```javascript
const parseParams = paramOrObject => {
  const defParams = {
    param1: 'one',
    param2: 'two',
    param3: 'three',
    param4: 'four'
  }
  if (typeof paramOrObject === 'object') {
    return Object.assign(defParams, paramOrObject)
  }
  return Object.assign(defParams, { param1: paramOrObject || defParams.param1 })
}

const myFn6 = params => {
  const { param1, param2, param3, param4 } = parseParams(params)
  console.log(param1, param2, param3, param4)
}

myFn6() // one, two, three, four
myFn6('one') // one, two, three, four
myFn6({ param4: 'four' }) // one, two, three, four
```

Ok ahora tenemos una función que si no le llega nada, regresa todos los default, si le llega un elemento que no es un objeto en el primer valor, lo considera `param1` y si le llega un objeto completo, lo convierte a parámetros (todos opcionales).

Pero algo no se siente bien... además ahora tienes dos funciones.

```javascript
const myFn7 = paramOrObject => {
  const defParams = {
    param1: 'one',
    param2: 'two',
    param3: 'three',
    param4: 'four'
  }
  let params = Object.assign({ ...defParams }, { param1: paramOrObject || defParams.param1 })
  if (typeof paramOrObject === 'object') {
    params = Object.assign(defParams, paramOrObject)
  }
  const { param1, param2, param3, param4 } = params
  console.log(param1, param2, param3, param4)
} 

myFn7() // one, two, three, four
myFn7('one') // one, two, three, four
myFn7({ param4: 'four' }) // one, two, three, four
```

Ok ahora está todo en una sola función, validada y todo es opcional... Aunque, a mi parecer esto ya es mucho overkill, todo depende de como utilices tu función que tanto la estés mandando a llamar y/o que tan complicada sea tu operación. Si tu operación es muy complicada, incluso sería mejor tener dos funciones, una para validar los parámetros y otra para hacer las operaciones.

Como sea, si tienes dudas de algo como esto o algo relacionado al javascript, puedes escribirme en Telegram, estoy como [@ZeroDragon](https://telegram.me/zerodragon)

Si te gustó esto, no olvides compartir :)

Zero Out
