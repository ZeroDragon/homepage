---
title: "Probando el café helado"
type: post
slug: "probando-el-cafe-helado"
layout: layouts/post.njk
permalink: /probando-el-cafe-helado/index.html
date: "2015-04-07T21:46:25Z"
categories:
  - name: "Javascript"
    slug: "javascript"
  - name: "Legacy Blog"
    slug: "legacy-blog"
  - name: "NodeJS"
    slug: "nodejs"
featuredImage: "/assets/uploads/2021/01/2015-04-07-probando-el-cafe-helado.jpg"
featuredImageAlt: "2015-04-07-probando-el-cafe-helado"
---

## Entrando al mundo del Iced CoffeeScript

Hace ya un año que estoy trabajando en [SocialDecode](http://www.socialdecode.com/) y poco a poco empecé a implementar [coffeescript](http://coffeescript.org/) en todos los lugares que pude. En un principio hubo algo de fricción por parte de mis colegas de trabajo, pero hoy es el día en que todos los _scripts_ nuevos los hacemos en CoffeeScript.

No me quiero adentrar mucho en CoffeeScript pues eso puede ser tema de otro post. Así que vamos a las _goodies_ del Iced CoffeeScript.

> En un principio fuí excéptico porque "defer" es una palabra que me recordó mucho a los _promises_ y el "promiselandia" que algunos _scripts_ terminaron siendo. Y el problema que era debuggearlos (el horror, el horrooooooooooor).

### Como funciona NodeJs

Si tú al igual que yo trabajas bastante en [NodeJS](https://nodejs.org/) te habrás dado cuenta de algo bien útil y al mismo tiempo frustrante en un inicio: **NodeJS es asíncrono**, esto quiere decir que tú puedes mandar a hacer una función y continuar tu código. Dicha función se ejecuta en otro plano hasta que termine. Para muchos casos esto es genial, puedes acelerar el tiempo de respuesta sin depender de un proceso externo, esto hace que tu aplicación escrita en NodeJS sea mucho más rápida que una en PHP (por decir un ejemplo). Sin embargo, cuando quieres hacer algo sencillo como: Extraer de la base de datos, modificar un valor y reinsertar en la base de datos. Terminas cayendo en un espiral infinito de _callbacks_ o _promises_ [link](http://howtonode.org/promises). No me tomen a mal, usamos _promises_ un rato y son buenas, pero como la sal en la comida: en exceso causan problemas.

### Async al rescate

Eventualmente empezamos a usar [async](https://github.com/caolan/async) (en especial los cargos) para mandar flujo de trabajo de un cargo a otro y trabajar en paralelo procesos seriados... Suena bonito pero aveces no quieres algo tan robusto para un proceso que debería ser más sencillo.

### Iced CoffeeScript

Hace un par de días, buscando unas librerias en github, me topé con Iced CoffeeScript, y leyendo me doy cuenta que es lo mismo que CoffeeScript pero con dos palabritas nuevas que cambian TODO el flujo de trabajo: **await** y **defer**. En un principio fuí excéptico porque "defer" es una palabra que me recordó mucho a los _promises_ y el "promiselandia" que algunos scripts terminaron siendo. Y el problema que era debuggearlos (el horror, el horrooooooooooor). Sin embargo le di una oportunidad y mi mente explotó.

### Algo sencillo con coffeescript

Veamos como funciona un proceso en CoffeeScript con un ejemplo de Mongo usando Async

```coffeescript
db.collection('test').find().toArray (err,items)->
#asumiendo que no hay error
for item in items
item.changed = true
update.push item

update = async.cargo ((tasks,cb)->
item = tasks[0]
id = item._id
delete item._id
db.collection('test').update {_id:id}, item, (err,res)->
#asumiendo que no hay error
console.log 'Item modificado y guardado'
cb()
),1
```

Sencillo: agarramos, vamos a Mongo, traemos todos los elementos de "test", los modificamos y los metemos en un proceso de cargo para que los vaya guardando de regreso a mongo uno por uno. La razón de esto es porque el proceso de _update_ en Mongo es asíncrono y no podemos dejarlo dentro del mismo bucle de los elementos. Esto no es precisamente malo pues si estás contruyendo un _webservice_ te interesa responder un **200** mientras dejas corriendo el _update_ en su propio sub-proceso. Sin embargo si quisieras hacer un tercer proceso después del _update_, tendrías que esperar a que termine de procesarse todo el cargo (con un drain y validaciones) para poder continuar y no [caer enmedio una memoria inválida](http://www.tubechop.com/watch/5662637) (dfq?).

### Algo sencillo con Iced CoffeeScript

Ahora veamos el mismo caso pero usando Iced CoffeeScript.

```coffeescript
await db.collection('test').find().toArray defer err, items
#asumiendo que no hay error
for item in items
item.changed = true
id = item._id
delete item._id
await db.collection('test').udpate {_id:id}, item, defer(err,res)
#asumiendo que no hay error
console.log 'Item modificado y guardado'
```

¡Listo! Observemos como dentro del mismo bucle podemos crear un proceso serializado de un procedimiento asíncrono. También podemos ver como en una línea podemos mandar a traer los items de mongo sin tener que depender del _callback_, _async_ o _promises_ intrusivos. Además como todo el proceso es seriado, podemos tranquilamente al cerrar el bucle trabajar de nuevo con los elementos directo de la base de datos, pues el _udpate_ ya se realizó.

Lo bonito de todo esto es que trabajar con Iced CoffeeScript no está peleado con _async_, _promises_, o _callbacks_, podemos seguir trabajando de la misma forma de siempre, pero ahora tenemos la posibilidad de serializar procesos cuando lo necesitemos sin tener que dar vueltas por todo el código una y otra vez... (¿alguien dijo paginaciones?).

Por hoy es todo. Si les interesa platicar al respecto, pueden localizarme en [telegram](https://telegram.org/) como [strong>@zerodragon](mailto:strong\>@zerodragon\</strong) o los invito a leer el manual en la página oficial de Iced CoffeeScript [Link](http://maxtaco.github.io/coffee-script/).

¡Saludos!
