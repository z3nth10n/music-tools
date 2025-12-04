    // Notes by semitone (pitch class)
    const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F",
      "F#", "G", "G#", "A", "A#", "B"];
    const NOTE_NAMES_LATIN = ["Do", "Do#", "Re", "Re#", "Mi", "Fa",
      "Fa#", "Sol", "Sol#", "La", "La#", "Si"];

    let currentNotation = "latin";

    function getNoteName(pc) {
      return currentNotation === "latin"
        ? NOTE_NAMES_LATIN[pc]
        : NOTE_NAMES[pc];
    }

    // Built-in tunings: [string1, string2, ..., string6] as pitch class
    const builtInTunings = {
      "E estándar":       [4, 11, 7, 2, 9, 4], // E B G D A E
      "Drop D":           [4, 11, 7, 2, 9, 2], // E B G D A D
      "D estándar":       [2, 9, 5, 0, 7, 2],  // D A F C G D
      "Drop C":           [2, 9, 5, 0, 7, 0],  // D A F C G C
      "Drop B":           [1, 8, 4, 11, 6, 11],// C# G# E B F# B
      "Drop A":           [11, 6, 2, 9, 4, 9]  // B F# D A E A
    };

    // Custom tunings (saved in localStorage)
    let customTunings = {};
    const CUSTOM_TUNINGS_KEY = "customGuitarTuningsV1";

    function loadCustomTunings() {
      const raw = localStorage.getItem(CUSTOM_TUNINGS_KEY);
      if (!raw) return {};
      try {
        const obj = JSON.parse(raw);
        if (obj && typeof obj === "object") return obj;
      } catch (e) {
        console.warn("No se pudo parsear las afinaciones personalizadas", e);
      }
      return {};
    }

    function saveCustomTunings() {
      const json = JSON.stringify(customTunings);
      localStorage.setItem(CUSTOM_TUNINGS_KEY, json);
    }

    document.addEventListener("DOMContentLoaded", () => {
      const tuningSelect = document.getElementById("tuningSelect");
      const notationSelect = document.getElementById("notationSelect");
      const fretInputs = Array.from(document.querySelectorAll(".fret-input"));
      const stringTunings = Array.from(document.querySelectorAll(".string-tuning"));
      const saveTuningButton = document.getElementById("saveTuningButton");
      const calcButton = document.getElementById("calcButton");

      currentNotation = notationSelect.value || "latin";

      // Fill note options for each string
      buildStringTuningOptions();

      // Load custom tunings from localStorage
      customTunings = loadCustomTunings();

      // Fill tuning dropdown
      populateTuningSelect("builtin::E estándar");
      applySelectedTuning();

      // Notation change (Anglo/Latin)
      notationSelect.addEventListener("change", (e) => {
        currentNotation = e.target.value;
        // Update note names in selects and third column
        refreshStringTuningOptionLabels();
        updateStringNotes();
        // If you also want to update the chord text directly:
        // calculateChord();
      });

      // Tuning change (from main dropdown)
      tuningSelect.addEventListener("change", () => {
        applySelectedTuning();
        clearFretInputs();
        clearMessages();
      });

      // Manual tuning change string by string
      stringTunings.forEach(sel => {
        sel.addEventListener("change", () => {
          updateStringNotes();
        });
      });

      // Navigation with Enter and Tab between fret inputs
      fretInputs.forEach(input => {
        input.addEventListener("keydown", (ev) => {
          if (ev.key === "Enter") {
            calculateChord();
          } else if (ev.key === "Tab") {
            ev.preventDefault();
            const idx = fretInputs.indexOf(ev.target);
            let nextIndex;
            if (ev.shiftKey) {
              nextIndex = (idx - 1 + fretInputs.length) % fretInputs.length;
            } else {
              nextIndex = (idx + 1) % fretInputs.length;
            }
            fretInputs[nextIndex].focus();
            fretInputs[nextIndex].select();
          }
        });

        input.addEventListener("input", () => {
          updateStringNotes();
        });
      });

      calcButton.addEventListener("click", calculateChord);
      saveTuningButton.addEventListener("click", saveCurrentTuning);

      updateStringNotes();
    });

    // Builds options (C, C#, D...) for each tuning dropdown
    function buildStringTuningOptions() {
      const stringTunings = document.querySelectorAll(".string-tuning");
      stringTunings.forEach(sel => {
        sel.innerHTML = "";
        for (let pc = 0; pc < 12; pc++) {
          const opt = document.createElement("option");
          opt.value = String(pc);
          opt.textContent = getNoteName(pc);
          sel.appendChild(opt);
        }
      });
    }

    // Only changes labels (C/Do, etc.) keeping the value
    function refreshStringTuningOptionLabels() {
      const stringTunings = document.querySelectorAll(".string-tuning");
      stringTunings.forEach(sel => {
        Array.from(sel.options).forEach(opt => {
          const pc = parseInt(opt.value, 10);
          opt.textContent = getNoteName(pc);
        });
      });
    }

    // Fills tuning dropdown with built-in + custom
    function populateTuningSelect(selectedValue) {
      const tuningSelect = document.getElementById("tuningSelect");
      tuningSelect.innerHTML = "";

      const builtGroup = document.createElement("optgroup");
      builtGroup.label = "Predefinidas";
      Object.keys(builtInTunings).forEach(name => {
        const option = document.createElement("option");
        option.value = "builtin::" + name;
        option.textContent = name;
        builtGroup.appendChild(option);
      });
      tuningSelect.appendChild(builtGroup);

      const customNames = Object.keys(customTunings);
      if (customNames.length > 0) {
        const customGroup = document.createElement("optgroup");
        customGroup.label = "Personalizadas";
        customNames.forEach(name => {
          const option = document.createElement("option");
          option.value = "custom::" + name;
          option.textContent = name;
          customGroup.appendChild(option);
        });
        tuningSelect.appendChild(customGroup);
      }

      const options = Array.from(tuningSelect.options);
      if (
        selectedValue &&
        options.some(o => o.value === selectedValue)
      ) {
        tuningSelect.value = selectedValue;
      } else {
        const defaultValue = "builtin::E estándar";
        tuningSelect.value = options.some(o => o.value === defaultValue)
          ? defaultValue
          : (options[0]?.value || "");
      }
    }

    // Applies selected tuning to string dropdowns
    function applySelectedTuning() {
      const tuningSelect = document.getElementById("tuningSelect");
      const value = tuningSelect.value;
      if (!value) return;

      const [kind, name] = value.split("::");
      let notes;
      if (kind === "builtin") {
        notes = builtInTunings[name];
      } else {
        notes = customTunings[name];
      }
      if (!notes) return;

      const stringTunings = document.querySelectorAll(".string-tuning");
      stringTunings.forEach((sel, index) => {
        sel.value = String(notes[index]);
      });

      // If custom tuning, fill name to edit it
      const nameInput = document.getElementById("tuningNameInput");
      if (kind === "custom") {
        nameInput.value = name;
      } else {
        // If you prefer not to set the name when selecting a built-in one:
        // nameInput.value = "";
      }

      updateStringNotes();
    }

    function clearFretInputs() {
      document.querySelectorAll(".fret-input").forEach(input => {
        input.value = "";
      });
      document.querySelectorAll(".string-note").forEach(out => {
        out.value = "";
      });
    }

    function clearMessages() {
      document.getElementById("errors").textContent = "";
      document.getElementById("result").textContent = "";
      document.getElementById("detail").textContent = "";
    }

    // Updates third column (resulting note) based on tuning and fret
    function updateStringNotes() {
      const fretInputs = document.querySelectorAll(".fret-input");
      const noteOutputs = document.querySelectorAll(".string-note");
      const stringTunings = document.querySelectorAll(".string-tuning");

      fretInputs.forEach((input, index) => {
        const out = noteOutputs[index];
        if (!out) return;

        const raw = input.value.trim();
        if (raw === "" || raw.toLowerCase() === "x") {
          out.value = "";
          return;
        }

        const fret = parseInt(raw, 10);
        if (Number.isNaN(fret) || fret < 0 || fret > 24) {
          out.value = "–";
          return;
        }

        const openPc = parseInt(stringTunings[index].value, 10);
        const notePc = (openPc + fret) % 12;
        out.value = getNoteName(notePc);
      });
    }

    // Chord calculation
    function calculateChord() {
      const errorsEl = document.getElementById("errors");
      const resultEl = document.getElementById("result");
      const detailEl = document.getElementById("detail");

      errorsEl.textContent = "";
      resultEl.textContent = "";
      detailEl.textContent = "";

      const fretInputs = document.querySelectorAll(".fret-input");
      const stringTunings = document.querySelectorAll(".string-tuning");

      const notes = [];
      let hasAnyNote = false;
      let hasError = false;

      fretInputs.forEach((input, index) => {
        if (hasError) return;
        const raw = input.value.trim();

        if (raw === "" || raw.toLowerCase() === "x") {
          return;
        }

        const fret = parseInt(raw, 10);
        if (Number.isNaN(fret) || fret < 0 || fret > 24) {
          hasError = true;
          errorsEl.textContent =
            "Trastes inválidos. Usa números entre 0 y 24 o deja vacío/X para cuerdas que no suenan.";
          return;
        }

        hasAnyNote = true;
        const openPc = parseInt(stringTunings[index].value, 10);
        const notePc = (openPc + fret) % 12;
        notes.push(notePc);
      });

      if (hasError) {
        resultEl.textContent = "Error en los datos";
        return;
      }

      if (!hasAnyNote) {
        resultEl.textContent = "Sin notas";
        detailEl.textContent = "Introduce al menos una cuerda con traste.";
        return;
      }

      const chordInfo = detectChord(notes);
      const uniquePcs = Array.from(new Set(notes)).sort((a, b) => a - b);
      const noteNames = uniquePcs.map(pc => getNoteName(pc)).join(" - ");

      if (!chordInfo) {
        resultEl.textContent = "Acorde no reconocido";
        detailEl.textContent = "Notas detectadas: " + noteNames;
      } else {
        resultEl.textContent = chordInfo.name;
        let extra;
        if (chordInfo.isPowerChord) {
          extra = "Tipo: Power chord (quinta justa) | Notas: " + noteNames;
        } else if (chordInfo.quality === "Nota aislada") {
          extra = "Nota aislada | Nota: " + noteNames;
        } else {
          extra = "Tipo: " + chordInfo.quality + " | Notas: " + noteNames;
        }
        detailEl.textContent = extra;
      }

      updateStringNotes();
    }

    // Chord patterns (intervals from root)
    const CHORD_PATTERNS = [
      { name: "Mayor",               suffix: "",      intervals: [0, 4, 7] },
      { name: "Menor",               suffix: "m",     intervals: [0, 3, 7] },
      { name: "Disminuido",          suffix: "dim",   intervals: [0, 3, 6] },
      { name: "Aumentado",           suffix: "aug",   intervals: [0, 4, 8] },
      { name: "Suspendido 2",        suffix: "sus2",  intervals: [0, 2, 7] },
      { name: "Suspendido 4",        suffix: "sus4",  intervals: [0, 5, 7] },
      { name: "Mayor 7",             suffix: "maj7",  intervals: [0, 4, 7, 11] },
      { name: "Menor 7",             suffix: "m7",    intervals: [0, 3, 7, 10] },
      { name: "Dominante 7",         suffix: "7",     intervals: [0, 4, 7, 10] },
      { name: "Semidisminuido 7",    suffix: "m7b5",  intervals: [0, 3, 6, 10] },
      { name: "Disminuido 7",        suffix: "dim7",  intervals: [0, 3, 6, 9] },
      { name: "Menor mayor 7",       suffix: "mMaj7", intervals: [0, 3, 7, 11] },
      { name: "Mayor 6",             suffix: "6",     intervals: [0, 4, 7, 9] },
      { name: "Menor 6",             suffix: "m6",    intervals: [0, 3, 7, 9] }
    ];

    function detectChord(notePcs) {
      const pcs = Array.from(new Set(notePcs));
      if (pcs.length === 0) return null;

      pcs.sort((a, b) => a - b);

      // Single note
      if (pcs.length === 1) {
        const rootName = getNoteName(pcs[0]);
        return {
          name: rootName,
          root: rootName,
          quality: "Nota aislada"
        };
      }

      // Two notes: try to detect power chord (fifth)
      if (pcs.length === 2) {
        const [a, b] = pcs;
        const intervalAB = (b - a + 12) % 12;
        const intervalBA = (a - b + 12) % 12;

        if (intervalAB === 7 || intervalBA === 7) {
          const rootPc = intervalAB === 7 ? a : b;
          const rootName = getNoteName(rootPc);
          return {
            name: rootName + "5",
            root: rootName,
            quality: "Power chord (quinta justa)",
            isPowerChord: true
          };
        }
        return null;
      }

      // Three or more notes: try all as possible root
      let bestMatch = null;

      pcs.forEach(rootPc => {
        const intervals = pcs.map(pc => (pc - rootPc + 12) % 12).sort((a, b) => a - b);
        const intervalSet = new Set(intervals);

        CHORD_PATTERNS.forEach(pattern => {
          const isSubset = pattern.intervals.every(i => intervalSet.has(i));
          if (isSubset) {
            const score = pattern.intervals.length;
            if (!bestMatch || score > bestMatch.score) {
              bestMatch = {
                rootPc,
                pattern,
                score
              };
            }
          }
        });
      });

      if (!bestMatch) return null;

      const rootName = getNoteName(bestMatch.rootPc);
      return {
        name: rootName + bestMatch.pattern.suffix,
        root: rootName,
        quality: bestMatch.pattern.name
      };
    }

    // Saves current tuning (based on string dropdowns) with the given name
    function saveCurrentTuning() {
      const nameInput = document.getElementById("tuningNameInput");
      const name = nameInput.value.trim();
      if (!name) {
        alert("Escribe un nombre para la afinación personalizada.");
        return;
      }

      const stringTunings = document.querySelectorAll(".string-tuning");
      if (stringTunings.length !== 6) {
        alert("No se ha podido leer la afinación de las cuerdas.");
        return;
      }

      const notes = Array.from(stringTunings).map(sel => parseInt(sel.value, 10));

      // Create or update custom tuning
      customTunings[name] = notes;
      saveCustomTunings();

      // Select this tuning in the dropdown
      const selectedValue = "custom::" + name;
      populateTuningSelect(selectedValue);
      applySelectedTuning();
    }
