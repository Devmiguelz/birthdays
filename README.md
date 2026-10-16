# 🎂 Cumpleaños Familia

App web (PWA) para no olvidar nunca un cumpleaños de la familia. Muestra los próximos cumpleaños en tarjetas, lista y calendario, calcula la edad que cumple cada persona y genera un mensaje de felicitación listo para enviar por WhatsApp.

🔗 **En vivo:** https://devmiguelz.github.io/birthdays/

## ✨ Características

- **Tres vistas**
  - **Tarjetas** — baraja deslizable con los próximos cumpleaños.
  - **Lista** — todos ordenados por cercanía, con insignia de "Hoy" / "En N días".
  - **Calendario** — el mes actual destacado arriba (mini-calendario + lista) y el resto de meses debajo.
- **Edad que cumple** — calculada desde la fecha de nacimiento (se muestra en tarjetas, lista y calendario).
- **Mensaje automático** — texto de felicitación listo para copiar o abrir en WhatsApp.
- **Celebración** — confeti y globos en 3D (Three.js) cuando alguien cumple hoy.
- **PWA instalable** — se instala en móvil y escritorio y funciona sin conexión.
- **Edición desde la app** — panel de administración (oculto) que guarda los cambios en `data.json` vía la API de GitHub, sin backend.

## 🗂️ Estructura

```
birthdays/
├── index.html    # estructura (HTML)
├── styles.css    # estilos (CSS)
├── app.js        # lógica (JavaScript)
├── data.json     # los cumpleaños (datos)
├── sw.js         # service worker (offline + caché)
└── README.md
```

## 📝 Editar los cumpleaños

Hay dos formas:

**1. Desde la app (recomendado)** — panel de administración oculto:
- Muéstralo con **Ctrl + Shift + A** (PC) o tocando **5 veces el logo** de la cabecera (móvil).
- Pega tu **token de GitHub** (fine-grained, con permiso *Contents: Read and write* sobre el repo `birthdays`).
- Añade / edita / borra personas. Los cambios quedan **pendientes en local** hasta que pulsas **"Sincronizar cambios"**, que los sube a `data.json`.

**2. Editando `data.json` a mano** (y `git push`):

```json
[
  { "name": "Miguel Zambrano", "nickname": "Mono", "date": "1995-10-15", "phone": "573001234567" }
]
```

- **`date`** — `AAAA-MM-DD` para mostrar la edad, o `MM-DD` si no quieres poner el año.
- **`phone`** — con código de país y sin `+` ni espacios (ej. `57300...`). Déjalo en `""` para ocultar el botón de WhatsApp.

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
