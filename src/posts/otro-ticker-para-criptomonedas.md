---
title: "Otro ticker para criptomonedas"
type: post
slug: "otro-ticker-para-criptomonedas"
layout: layouts/post.njk
permalink: /otro-ticker-para-criptomonedas/index.html
date: "2021-02-26T17:13:32Z"
categories:
  - name: "Experimentos"
    slug: "experimentos"
  - name: "Javascript"
    slug: "javascript"
  - name: "NodeJS"
    slug: "nodejs"
  - name: "Tecnología"
    slug: "tecnologia"
featuredImage: "/assets/uploads/2021/02/demo.png"
featuredImageAlt: "demo"
---

> Si, porque nunca son suficientes las mismas soluciones en diferentes formas.

Hace unas semanas empecé de nuevo a comprar criptomonedas, así que lo primero que necesité, fue una serie de aplicaciones para poder hacer tradding y para poder trackear el estado de las moneditas que estoy comprando.

En el pasado ya había hecho un [bot de telegram](/cryptoalerterbot-v2/) que traía los datos haciendo web scrapping a coinmarketcap... pero ahora la moneda que estoy buscando no la encuentro ahi. Así que me puse a buscar otras opciones y llegué a Coingecko.

Encontré varias soluciones que son interactivas y que arman gráficas bonitas en CLI para poder ir viendo las monedas y su evolución. Pero seamos honestos: 1) No me interesan las 10mil monedas más famosas.  
2) Solo quiero ver ciertos datos (ni se leer gráficas de vela).  
3) Quiero de una sola vez, observar cuanto dinero tengo invertido y cuando he ganado o perdido.

> Lets do this!

Primero empecé haciendo web scrapping a la página de coingecko, pero me di cuenta que ellos registran varios miles de monedas... nunca iba a terminar de hacer eso. Después pensé en hacer scrapping de únicamente una moneda y manejar un `settings.yaml` para determinar q monedas vamos a querer buscar. Logré llegar muy bien con este approach; en eso me di cuenta que coingecko tiene un API y es gratis y pública... facepalm.

Así que nuevo approach. Vamos a usar el API...  
Resulta que la API trae no solo la info de la moneda, si no que también trae info para armar la gráfica, y el valor ya convertido al fiat de tu preferencia... triplefacepalm

Ok con este nuevo respedo adquirido al API, decidí continuar con mi idea de usar un settings.yaml para determinar que monedas se van a trackear y que datos quiero presentar. Uno de los objetivos que quería es poder ver los stats de las monedas al mismo tiempo de mi portafolio y cuanto dinero he ganado o perdido.

Esto lo configuré con el yaml y utilizando solo un par de librerías extra para presentar la información, logré hacer esto: ![demo de gráfica](/assets/uploads/2021/02/demo.png)

Como pueden ver, ya perdí casi $900 pesos desde que compré monedas... así que voy a estar en hodl hasta que pueda recuperar algo ...

Como sea, [dejé el repo público](https://github.com/ZeroDragon/cli-ticker) por si a alguien le interesa llevar un track de sus monedas en su computadora.

Como siempre, si algo de aqui les gusta, no olviden compartir, manita arriba y todo eso que se da en redes sociales :)

Zero out
