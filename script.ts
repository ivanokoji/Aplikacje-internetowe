
const msg: string = "Hello!";
alert(msg);



// Definicja typu jednego stylu
type StyleDefinition = {
    id: string;
    name: string;
    file: string;
};

// Lista dostępnych styli
const styles: StyleDefinition[] = [
    { id: "style1", name: "Styl 1", file: "style-1.css" },
    { id: "style2", name: "Styl 2", file: "style-2.css" },
    { id: "style3", name: "Styl 3", file: "style-3.css" },
];

// Aktualnie aktywny styl (domyślnie Styl 1)
let currentStyleId: string = "style1";


function applyStyle(styleId: string): void {
    const style = styles.find((s) => s.id === styleId);
    if (!style) {
        console.error("Nie znaleziono stylu:", styleId);
        return;
    }

    const existingLink = document.querySelector<HTMLLinkElement>(
        'link[data-dynamic-style="true"]'
    );
    if (existingLink) {
        existingLink.remove();
    }
    const linkEl = document.createElement("link");
    linkEl.rel = "stylesheet";

    linkEl.href = `/${style.file}`;
    linkEl.setAttribute("data-dynamic-style", "true");

    document.head.appendChild(linkEl);

    currentStyleId = styleId;
}

function renderStyleLinks(): void {
    const container = document.getElementById("style-switcher");
    if (!container) {
        console.error("Nie znaleziono elementu #style-switcher");
        return;
    }

    container.innerHTML = "";

    styles.forEach((style) => {
        const link = document.createElement("a");
        link.href = "#";
        link.textContent = style.name;


        link.style.marginRight = "1rem";


        link.addEventListener("click", (event) => {
            event.preventDefault();
            applyStyle(style.id);
        });

        container.appendChild(link);
    });
}

// Inicjalizacja po załadowaniu DOM
document.addEventListener("DOMContentLoaded", () => {

    renderStyleLinks();


    applyStyle(currentStyleId);
});
