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