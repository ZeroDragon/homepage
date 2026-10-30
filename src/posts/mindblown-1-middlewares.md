---
title: "Mindblown #1 Middlewares"
type: post
slug: "mindblown-1-middlewares"
layout: layouts/post.njk
permalink: /mindblown-1-middlewares/index.html
date: "2015-07-09T21:54:23Z"
categories:
  - name: "Experimentos"
    slug: "experimentos"
  - name: "Javascript"
    slug: "javascript"
  - name: "Legacy Blog"
    slug: "legacy-blog"
featuredImage: "/assets/uploads/2021/01/2015-07-09-mindblown-1-middlewares.png"
featuredImageAlt: "2015-07-09-mindblown-1-middlewares"
---

## Rutinas asíncronas sincronizadas

Comenzamos una nueva sección en mi blog: **El MindBlown**

En esta sección les pondré unos ejemplos sencillos de algunos códigos bien locos que aveces surgen mientras desarrollo.

En este ejemplo burdo tenemos una función que antes de ejecutarse primero pasa por dos middlewares, cada uno muta el objeto que se le va pasando y al final regresa un solo callback con todas las mutaciones.

Alternativamente, como todo es asíncrono, ejecuta unos dummys de unas rutinas imaginarias. Esto solo es un MVP, pero las utilidades son grandes.

Cabe mencionar que este demo es solo posible gracias a la simplicidad que da [coffeescript](http://coffeescript.org/) para anidar callbacks en una misma línea sin afectar las indentaciones.

```coffeescript
middle1 = (obj,cb)->
obj = [obj,'1st middle']
console.log 'Making sure we are connected to DB'
cb(obj)

middle2 = (obj,cb)->
obj = obj.concat ['2nd middle']
console.log 'Checking for data consistency'
cb(obj)

funcA = (obj,cb)-> middle1 obj, (objM1)-> middle2 objM1, (objM2)->
console.log 'Updating records on DB'
cb objM2

funcA 'init', (objM3)->
console.log 'Update done'
console.log objM3

# Output
###
Making sure we are connected to DB
Checking for data consistency
Updating records on DB
Update done
[ 'init', '1st middle', '2nd middle' ]
###
```

Hasta aquí con el mindblown. ¿Qué te pareció?, ¿Lo usarías en tu código?, ¿Tienes alguna aportación? coméntame en [telegram](http://telegram.me/zerodragon) o en [twitter](http://twitter.com/zerodragon)
