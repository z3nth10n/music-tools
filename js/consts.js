function getAbsolutePath() {
    const domain = window.location.hostname;

    if (domain === "z3nth10n.github.io") {
        return "/music-tools/";
    }

    return "";
}

function getApiLocation() {
    const domain = window.location.hostname;

    if (domain === "z3nth10n.github.io") {
        return "https://tabs.z3nth10n.net";
    }

    return "http://localhost:9999";
}

(function registerSharedConstants() {
    if (window.GUITAR_CONSTS) return;

    const NOTE_NAMES_ANGLO = [
        "C",
        "C#",
        "D",
        "D#",
        "E",
        "F",
        "F#",
        "G",
        "G#",
        "A",
        "A#",
        "B",
    ];

    const NOTE_NAMES_LATIN = [
        "Do",
        "Do#",
        "Re",
        "Re#",
        "Mi",
        "Fa",
        "Fa#",
        "Sol",
        "Sol#",
        "La",
        "La#",
        "Si",
    ];

    const STRING_TUNINGS_STANDARD = [
        { name: "6th (E)", midi: 40 },
        { name: "5th (A)", midi: 45 },
        { name: "4th (D)", midi: 50 },
        { name: "3rd (G)", midi: 55 },
        { name: "2nd (B)", midi: 59 },
        { name: "1st (E)", midi: 64 },
    ];

    const STANDARD_TUNING_MIDI = [64, 59, 55, 50, 45, 40];

    const BUILT_IN_TUNINGS = {
        tuning_e_std: [64, 59, 55, 50, 45, 40],
        tuning_drop_d: [64, 59, 55, 50, 45, 38],
        tuning_d_std: [62, 57, 53, 48, 43, 38],
        tuning_drop_c: [62, 57, 53, 48, 43, 36],
        tuning_drop_b: [61, 56, 52, 47, 42, 35],
        tuning_drop_a: [59, 54, 50, 45, 40, 33],
        tuning_c_std: [60, 55, 51, 46, 41, 36],
        tuning_b_std: [59, 54, 50, 45, 40, 35],
        tuning_a_std: [57, 52, 48, 43, 38, 33],
    };

    const NOTES_SHARP = [
        "C",
        "C#",
        "D",
        "D#",
        "E",
        "F",
        "F#",
        "G",
        "G#",
        "A",
        "A#",
        "B",
    ];

    const NOTES_FLAT = [
        "C",
        "Db",
        "D",
        "Eb",
        "E",
        "F",
        "Gb",
        "G",
        "Ab",
        "A",
        "Bb",
        "B",
    ];

    const NOTES_LATIN = [
        "Do",
        "Reb",
        "Re",
        "Mib",
        "Mi",
        "Fa",
        "Solb",
        "Sol",
        "Lab",
        "La",
        "Sib",
        "Si",
    ];

    window.GUITAR_CONSTS = {
        NOTE_NAMES_ANGLO,
        NOTE_NAMES_LATIN,
        STRING_TUNINGS_STANDARD,
        STANDARD_TUNING_MIDI,
        BUILT_IN_TUNINGS,
        NOTES_SHARP,
        NOTES_FLAT,
        NOTES_LATIN,
    };
})();
