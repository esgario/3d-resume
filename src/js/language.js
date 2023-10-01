function changeLang(language, el) {
    let container = document.querySelector(".chooseLang").classList;
    el = el.classList;
    if (container.contains("open")) {
        container.remove("open");
        if (!el.contains("chosen")) {
            document.querySelector(".chooseLang .chosen").classList.remove("chosen");
            el.add("chosen");
            console.log(language + " chosen");
        }
        return;
    }
    container.add("open");
}

export function setupChangeLanguage() {
    let langs = ["pt", "en"];
    for (let i = 0; i < langs.length; i++) {
        let lang = langs[i];
        let langDiv = document.getElementById(lang + "-lang");
        langDiv.onclick = function () {
            changeLang(lang, this);
        };
    }
}

export function getCurrentLanguage() {
    const langDiv = document.getElementById("pt-lang");
    if (langDiv.classList.contains("chosen")) {
        return "pt";
    } else {
        return "en";
    }
}
