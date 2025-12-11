Aquí tienes **la lista combinada, sin tareas repetidas**, y **en dos versiones: español e inglés**.
He unificado todo, eliminado duplicados y fusionado tareas equivalentes (por ejemplo, “fix visual issues on mobile” y “corregir errores en móvil”).

---

# ✅ **LISTA FINAL (EN ESPAÑOL, SIN REPETIDOS)**

### ✔ Completados

* Hostear la API en un hosting gratuito.
* Acceder a la API desde GitHub Pages.
* Añadir motor de búsqueda.
* Guardar búsquedas en localStorage y mostrarlas después.
* Hacer que las tablaturas actuales funcionen con las nuevas features.

---

# 🚧 **Pendientes**

## 🔊 Reproducción y sonido

* Reproducir tablaturas con sonido.
* Implementar sonidos para técnicas: ligadas, bends, palm mutes, slides, let ring…
* Interpretar estas técnicas en backend y visual-tab.
* Aumentar duración máxima de notas a 10 segundos.
* Mejorar sonido para evitar efecto “robotizado” en guitarras distorsionadas.
* Reproducir varias tablaturas simultáneamente.
* Debounce al reproducir chord-library.
* Mostrar hercios al cambiar de afinación.
* Mostrar miniatura de posición de dedos al sonar cada acorde.

---

## 🎼 Interpretación y renderizado de la tablatura

* Si la tablatura es muy larga, cargar en chunks (10 compases).
* Dibujar duración de cada nota/acorde según indique el txt.
* El espaciado debe coincidir con el timing real.
* La tablatura debe desplazarse conforme avanza la canción.
* Bola rebotando / cursor que avanza por el compás.
* Dibujar correctamente figuras musicales bajo la tablatura.
* Corregir símbolos mal renderizados (ej: fusa en **Heart-Shaped Box**).
* Detectar acordes y notas desde la tablatura.
* Buen reconocimiento de notas y acordes por micrófono.
* Colorear notas según el dedo que debería tocar (regla un dedo por traste).
* Aceptar correcciones manuales mediante tablatura de dedos (1-4).
* El archivo txt debe permitir incluir una segunda tablatura de dedos.

---

## 🎨 Estilos de visualización

* Tablatura estilo Songsterr.
* Tablatura 2D colorida por dedos.
* Tablatura 2D colorida por cuerda.
* Perspectiva 3D estilo Yousician.
* Perspectiva estilo Rocksmith.
* Definir colores por dedos o cuerdas en el panel de settings.
* Mostrar bola en lugar de aguja al reproducir.
* Mostrar miniatura debajo del canvas como en Yousician.

---

## 📱 Móvil

* Corregir problemas visuales en móvil.
* El modo visual-tab debería mostrarse horizontal.
* Evitar que la pantalla se apague mientras suena.
* Si el usuario sale del navegador, la reproducción debe detenerse.

---

## 🧭 UX / UI

* Mostrar barra de carga/spinner (idealmente usando progress devuelto por la API).
* Mostrar dificultad de la canción (desde la búsqueda) como badge tipo Yousician.
* Si la canción no tiene guitarras, mostrar mensaje.
* Mostrar error en ventana flotante si la búsqueda no devuelve 200.
* Volver al último tab si se entra desde el inicio.
* Mostrar link a Songsterr.
* Arreglar márgenes del component-view.
* Corregir colores en light mode.

---

## 🖥 Arquitectura / backend / organización

* Mejorar la arquitectura del HTML:

  * Quitar body/head.
  * Tomar el `<title>` para la página.
  * Incluir solo JS/CSS del componente.
* Centralizar settings en un solo JavaScript.
* Aceptar varias guitarras y poder seleccionarlas.
* Guardar la tablatura en localStorage al abrirla.
* Arreglar allowed_domains para funcionar desde localhost.
* Eliminar código residual.
* Corregir detección de idioma del navegador.
* Algunas tablaturas aún no se muestran bien (mejorar parser).
* Algunas canciones largas no se reproducen (Slipknot, La Pedra).
* Al acabar el compás aparecen espacios → corregir.
* Preguntarle a ChatGPT sobre el problema de sonido (ya lo estás haciendo aquí 😄).

---

# 🇬🇧 **FINAL LIST (IN ENGLISH, WITHOUT DUPLICATES)**

### ✔ Completed

* Host the API on a free hosting service.
* Access the API from GitHub Pages.
* Add a search engine.
* Save searched songs in localStorage and restore them.
* Make current tablatures work with the new features.

---

# 🚧 Pending

## 🔊 Playback & Audio

* Add playback with sound.
* Implement sounds for tied notes, bends, palm mutes, slides, let ring…
* Interpret these techniques in backend and visual-tab.
* Increase note duration limit to 10 seconds.
* Fix robotic distorted-guitar sound.
* Allow playing multiple tabs simultaneously.
* Add debounce time for chord-library playback.
* Display Hz when changing tuning.
* Show chord finger-position thumbnail when a chord is played.

---

## 🎼 Tab Parsing & Rendering

* Load very long tabs in chunks (10 measures).
* Draw note/chord duration according to txt instructions.
* Spacing between notes must match musical timing.
* Tab must scroll while the song plays.
* Add bouncing ball / moving cursor per measure.
* Draw musical figures properly under the tablature.
* Fix incorrectly drawn symbols (e.g., fusa in Heart-Shaped Box).
* Improve chord detection from the tablature.
* Improve microphone chord and note recognition.
* Set note color based on inferred finger (one-finger-per-fret rule).
* Accept manual corrections from a finger-position tablature.
* Txt files should support a second finger-tab (1-4).

---

## 🎨 Visualization modes

* Songsterr-like tablature.
* 2D tablature color-coded by fingers.
* 2D tablature color-coded by string.
* 3D perspective like Yousician.
* Perspective like Rocksmith.
* Color themes based on fingers or strings in settings.
* Show a ball instead of a needle during playback.
* Show a thumbnail under the canvas (like Yousician).

---

## 📱 Mobile

* Fix mobile visualization issues.
* Visual-tab should force landscape mode.
* Prevent screen from turning off during playback.
* Stop playback when leaving the browser.

---

## 🧭 UX / UI

* Show a loading bar or spinner (API could return progress).
* Show song difficulty as a badge (like Yousician).
* If the song has no guitars, display a message.
* Show error popup if search doesn't return 200.
* Return to last opened tab when navigating from home.
* Add Songsterr link.
* Fix margins in component-view.
* Fix colors in light mode.

---

## 🖥 Architecture / Backend / Organization

* Improve HTML architecture:

  * Remove body/head.
  * Use page `<title>`.
  * Load only the JS/CSS for the component.
* Centralize all settings in a single JS.
* Support selecting different guitars.
* Save opened tablature to localStorage.
* Fix allowed_domains to work from localhost.
* Remove unused code.
* Fix browser-language detection.
* Some tabs still don’t render properly — improve parser.
* Some songs don’t play (Slipknot, La Pedra).
* Fix extra spacing after a measure.
* Ask ChatGPT about sound issues (you already are!).

---

Si quieres, puedo:

✅ Ordenarlas por prioridad
✅ Convertirlas en un **roadmap** tipo Trello / Jira
✅ Agruparlas por **epics** y **milestones**
✅ Generar un archivo **TODO.md** listo para pegar en tu repo

¿Quieres alguna de esas opciones?
