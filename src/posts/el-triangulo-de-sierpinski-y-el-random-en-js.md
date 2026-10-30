---
title: "El Triángulo de Sierpinski y el random en JS"
type: post
slug: "el-triangulo-de-sierpinski-y-el-random-en-js"
layout: layouts/post.njk
permalink: /el-triangulo-de-sierpinski-y-el-random-en-js/index.html
date: "2022-04-25T14:21:23Z"
categories:
  - name: "Experimentos"
    slug: "experimentos"
  - name: "Javascript"
    slug: "javascript"
featuredImage: "/assets/uploads/2022/04/triangle-1.png"
featuredImageAlt: "triangle-1"
---

Hace poco vi este [Tiktok](https://www.tiktok.com/@mathletters/video/7081424281309170986) donde explican como el triángulo de Sierpinski se puede reproducir siguiendo dos simples reglas:

> 1) Dibujas un punto medio entre dos puntos de un triángulo  
> 2) Dibujas un punto medio entre este nuevo punto y cualquier esquina del triángulo y repites"
> 
> Y dije "naaaaaaah" y me puse a hacer el algoritmo para poder jugarle con javascript y hacerlo.

Este es el código completo:

```
const ctx = document.getElementById('canvas').getContext('2d')
const W = 1000
const H = 1000
const triangle = [
  { x: W / 2, y: 10 },
  { x: W - 10, y: H - 10 },
  { x: 10, y: H - 10 }
]

const drawPoint = (p) => {
  ctx.fillStyle = "#FF0"
  ctx.beginPath()
  ctx.arc(p.x, p.y, 0.05, 0, 2 * Math.PI)
  ctx.fill()
}

const getMidPoint = ({ x: x1, y: y1 }, { x: x2, y: y2 }) => {
  return { x: (x1 + x2) / 2, y: (y1 + y2) / 2 }
}

const drawPoints = (last) => {
  const randomPoint = triangle[rando(2)]
  const midPoint = getMidPoint(last, randomPoint)
  drawPoint(midPoint)
  setTimeout(() => {
    drawPoints(midPoint)
  }, 1)
}

drawPoints(triangle[rando(2)])
```

Segúramente se están preguntando "Qué diablos es rando"? pues aqui lo interesante. Mi primer approach fue usar `Math.random()` para obtener los puntos al azar del triángulo. Pero el resultado fué este:

![](/assets/uploads/2022/04/uno-1.png)

Como un nepe, tiene tendencia a ladearse hacia un lado

Parece que el random built-in en javascript está dándole preferencia a la derecha (elemento 1 entre 0 y 2 del arreglo de esquinas del triángulo).

Así que me puse a investigar alternativas para tener un mejor "true random" en javascript. Que si somos estrictos, eso no existe, porque no se puede tener un proceso real de random en un sistema computacional. Debido a que requiere una instrucción precisa para poder determinar un random.

Sin embargo existen!, solo que son tan aleatorios en su proceso de caos que al ojo humano (y para cualquier proceso práctico) se le puede considerar un "true random".

Uno de estos algoritmos son los que se usan en la criptociencia, cifrado de datos y demás cosas divertidas. Así que me puse a buscar algo que me sirviera (y que fuera ligeo). Obtuve esto:

[https://randojs.com/](https://randojs.com/)

RandoJs se presumen tener un sistema de random que es compatible con cifrados digitales y realmente genera una aleatoriedad bastante aceptable. Lo mejor: ligero y se instala en frontend como cualquier otro <script>.

Al final este fué el resultado:

![](/assets/uploads/2022/04/dos.png)

Este random si se puede ver

Finalmente solo me quedó dejar corriendo el proceso para que empezara a llenar pixel por pixel el resultado final.

Cabe señalar que el resultado fractal me gustó mucho y sobre todo la simplicidad con la que está hecho.

Para terminar les dejo este [codepen](https://codepen.io/ZeroDragon/pen/GRybgxy) con mi approach para este desarrollo en HTML+JS

https://codepen.io/ZeroDragon/pen/GRybgxy

Como siempre, si les gusta mi contenido, no olviden sharear, mencionar, publicar, lo que más les guste. Además tengo un [Patreon](https://www.patreon.com/zerodragon) por si gustan fomentar que siga haciendo cosas como estas :D

Zero out
