# 🎂 Cumpleaños Familia

App web (PWA) para no olvidar nunca un cumpleaños de la familia. Muestra los próximos cumpleaños en tarjetas, lista y calendario, calcula la edad que cumple cada persona y genera un mensaje de felicitación listo para enviar por WhatsApp.

🔗 **En vivo:** https://devmiguelz.github.io/birthdays/

## ✨ Características

- **Tres vistas**
  - **Tarjetas** — baraja deslizable con los próximos cumpleaños.
  - **Lista** — todos ordenados por cercanía, con insignia de "Hoy" / "En N días".
  - **Calendario** — el mes actual destacado arriba (mini-calendario + lista) y el resto de meses debajo.
- **Edad que cumple** — calculada desde la fecha de nacimiento (se muestra en tarjetas, lista y calendario).
- **Mensaje automático** — texto de felicitación personalizado según la relación (madre, pareja, primo…), listo para copiar o abrir en WhatsApp.
- **Celebración** — confeti y globos en 3D (Three.js) cuando alguien cumple hoy.
- **PWA instalable** — se instala en móvil y escritorio y funciona sin conexión.
- **Un solo archivo** — todo vive en `index.html` (+ `sw.js` para el modo offline). Sin build ni dependencias que instalar.

## 📝 Editar los cumpleaños

Abre `index.html` y edita el arreglo `BIRTHDAYS`:

```js
const BIRTHDAYS = [
  { name:'Miguel Zambrano', nickname:'Mono', date:'1995-10-15', phone:'573001234567', relation:'yo' },
  // ...
];
```

- **`date`** — `AAAA-MM-DD` para mostrar la edad, o `MM-DD` si no quieres poner el año (no mostrará edad).
- **`phone`** — con código de país y sin `+` ni espacios (ej. `57300...`). Déjalo en `''` para ocultar el botón de WhatsApp.
- **`relation`** — define qué plantilla de mensaje se usa. Las disponibles están en el objeto `MSGS` (`yo`, `madre`, `padre`, `pareja`, `hermana`, `primo`, `abuela`, `sobrina`, `default`).

> Los años del repositorio son de ejemplo: reemplázalos por los reales.

## 🚀 Desarrollo

No hay nada que compilar. Para probar en local con todas las funciones de PWA necesitas servir por HTTP (no abrir el archivo con `file://`):

```bash
# Opción simple con Python
python -m http.server 8000
# luego abre http://localhost:8000
```

## ☁️ Despliegue (GitHub Pages)

El sitio se publica automáticamente desde la rama `main`. Para actualizarlo:

```bash
git add -A
git commit -m "Actualiza cumpleaños"
git push
```

GitHub Pages reconstruye solo en ~1 minuto.

### Forzar actualización de la caché

El service worker usa una caché con versión (`cumple-v1` en `sw.js`). Si haces cambios importantes y quieres que todos reciban la versión nueva, sube el número:

```js
const CACHE = 'cumple-v2'; // antes: 'cumple-v1'
```

## 🛠️ Tecnologías

- HTML + CSS + JavaScript (sin framework)
- [Three.js](https://threejs.org/) — confeti y globos 3D
- [GSAP](https://greensock.com/gsap/) — animaciones
- Service Worker + Web App Manifest — PWA y modo offline
