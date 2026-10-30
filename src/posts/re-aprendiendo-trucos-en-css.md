---
title: "Re aprendiendo trucos en CSS"
type: post
slug: "re-aprendiendo-trucos-en-css"
layout: layouts/post.njk
permalink: /re-aprendiendo-trucos-en-css/index.html
date: "2021-01-29T17:29:59Z"
categories:
  - name: "Experimentos"
    slug: "experimentos"
featuredImage: "/assets/uploads/2021/01/1_YuzakcmBI7vlrwuWdkIeUA.jpg"
featuredImageAlt: "1_YuzakcmBI7vlrwuWdkIeUA"
---

De vez en cuando me gusta hacer experimentos para ver como haría yo ciertas cosas.

Esta semana me topé con el diseño de unos templates para CVs en el twitter de [Monika Lara](https://twitter.com/VioletStarfish). Y me gustó que los haya [liberado al público](https://twitter.com/VioletStarfish/status/1353165812308336641) para embellecer tu CV. Entonces dije "pues ¿por qué no hacer lo mismo pero para facilitar su utilización?".

Los diseños son bastante intuitivos y en su post puso que tipografías se usan (gratis en google fonts). Así que todo se acoplaba perfecto para hacer la herramienta.

> Y si ya alguien lo hizo? pos nimodo ya lo estoy haciendo equis de

Unas horas dentro del desarrollo, me pregunté "y si ya alguien lo hizo?" pero pues ya no iba a detenerme así que continué con el experimento.

Cuando llegué a la parte del detalle en la barra izquierda.

> ![el bookmark](/assets/uploads/2021/01/wedge-288x300.png) muy bonito

Me di cuenta que traía un bonito triángulo abajo que daba la impresión de ser como un bookmark. Mi mente rápido pensó: "_Ok primero hacemos un cuadro, y abajo le ponemos un pseudo elemento :after con un truco para hacer un triángulo con una esquina de un borde_" Y lo dejé pasar, hasta seguir con todo el desarrollo.

Más adelante me topé con que este detalle trae una bonita sombra; y no solo eso, si no que la sombra inicia desde afiera del documento y no en el inicio del cuadro.

Solo para que tomen nota, cuando haces una sombra con CSS la sombra incia unos pixeles desfasado de tu elemento y nunca sobre sale en ambas direcciones, solo en una dirección ![offset](/assets/uploads/2021/01/offset-300x289.png) En la imagen se puede ver que hacia abajo sobre sale unos pixeles, pero hacia arriba no. Y en el diseño sobre sale para arriba y para abajo, si bien puedes poner más de una sombra a la vez en css, al ser elementos con transparencia, donde se empalman generarían zonas más oscuras que otras. Esto debió darme un indicio de como debí atacarlo.

Sin embargo, no me iba a ir sin intentarlo. Así que hice mi psedo-elemento y le puse un border-top-right para hacer un triángulo con css y funcionó. Pero la sombra se veía como un cuadro al rededor del peudo elemento y no sobre el triángulo. Que en realidad es un borde.

> ![oh no](/assets/uploads/2021/01/oh-no-300x300.jpg) oh no, oh no, oh no no no no no

Ok ok ok, entonces dije "puedo usar un SVG inline" un SVG a nivel HTML en realidad es otro TAG muy sencillo y no hay que insertar ninguna imagen extra. De hecho uno de mis objetivos era lograr hacer esto sin usar imágenes (más que la del avatar de la pesona)

Puse el SVG con un tag Poli dentro y definí mis X,Y en origen (0,0) esquina derecha (100, 0) esquina inferior derecha (100, 100) y con eso se armó un triángulo bonito. Mismo problema, la sombra hace un cuadro al rededor >.<

> ![khe?](/assets/uploads/2021/01/what-300x121.png) khaaaaaaa?

Después de un google-fu rápido me topé con el [filtro drop-shadow](https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/drop-shadow) que se puede poner como CSS y tiene la particularidad de que solo avienta una sobra sobre los pixeles dibujados y no sobre todo el contendor.

> ![mejor](/assets/uploads/2021/01/ohh-300x116.png) ¡Mucho mejor!

Al otro día, depués de terminar todo, se me ocurre intentar imprimir el documento, pues la razón principal de todo esto es poder imprimirlo como PDF y obtener un PDF para mandar a donde estés aplicando para trabajar.

Oh gran desilución. El render del PDF de chrome me está generando dos colores diferentes para el mismo valor hexadecimal del verde del bookmark. Uno para el background y uno para el triángulo.

> ![wtf](/assets/uploads/2021/01/wtf-266x300.png) Pero ¿Que demonios?

Así que fue hora de escarbar en lo más recóndito de mi cerebro para recordar una propiedad que hace tiempo que conozco pero que nunca uso: **transform: skew**.

Con esto en mente, lo que hice fue hacer un cuadro que usaría de fondo de color, luego le apliqué la propiedad de css y modifiqué la posición absoluta sobre el elemento relativo y lo saqué del contenedor.

Y funcionó como magia, solucionó el problema de la sombra propagándose por ambos lados, además, como es un solo elemento, no hay problemas de corte de colores. Y para finalizar, como en realidad la sombra ¡Si está sobre un elemento cuadrado! Si se pone sobre el triángulo que en realidad es una esquina del cuadrado pero torcido.

Al terminar, el resultado final fue exactamente lo que necesitaba :)

> ![happy](/assets/uploads/2021/01/07695936-0e1b-44ea-8a26-59bb4ea17ecb_avatars-000511462581-5koqjw-original-300x300.jpg) Oh happy days oh happy days

Hice un pequeño snippet en [code pen](https://codepen.io/ZeroDragon/pen/rNWNdNo) para que puedan ver como funciona este pequeño hack que he de confesar me costó más de lo que me gustaría admitir, pero sin dudas fue divertido.

Ya para finalizar, este es el [Generador de CV](https://zerodragon.github.io/cvmaker/) terminado.

Pueden darle click a los textos para editarlos, darle click a la foto para cambiarla por la suya e incluso cambiar de tema entre el azúl y el morado. Al final solo denle **imprimir** y podrán exportarlo a PDF

Es muy probable que se vea horrible porque por default la impresión no te pone colores de fondo y te pone márgenes raros. Pero solo es cuestión de moverle a los settings de la impresión y listo.

> ![printing antes](/assets/uploads/2021/01/antes.png) Antes
> 
> ![Printing después](/assets/uploads/2021/01/despues.png) Después

Espero mi pequeña aventura les haya gustado y como siempre, si les sirve de algo, no olviden darle RT, manita arriba, subscribe y lo que sea que se haga en tiktok. Si me quieren contactar, estoy en [telegram](https://t.me/zerodragon) y en [twitter](https://twitter.com/zerodragon)

Zero out
