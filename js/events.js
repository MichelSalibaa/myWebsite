(function () {
    const eventsData = [
        {
            name: "load",
            category: "Window",
            description: "Fires when the document and dependent resources finish loading.",
            tags: ["body", "iframe", "img", "link"],
            link: "https://www.w3schools.com/jsref/event_onload.asp"
        },
        {
            name: "resize",
            category: "Window",
            description: "Triggers when the browser window changes size.",
            tags: ["window"],
            link: "https://www.w3schools.com/jsref/event_onresize.asp"
        },
        {
            name: "click",
            category: "Mouse",
            description: "Invoked when a pointing device button is pressed and released on the same element.",
            tags: ["button", "a", "div"],
            link: "https://www.w3schools.com/jsref/event_onclick.asp"
        },
        {
            name: "dblclick",
            category: "Mouse",
            description: "Fires when the primary mouse button is clicked twice within a short timeframe.",
            tags: ["button", "img", "div"],
            link: "https://www.w3schools.com/jsref/event_ondblclick.asp"
        },
        {
            name: "keydown",
            category: "Keyboard",
            description: "Runs when a key is pressed down, before the browser determines the character.",
            tags: ["input", "body", "textarea"],
            link: "https://www.w3schools.com/jsref/event_onkeydown.asp"
        },
        {
            name: "input",
            category: "Form",
            description: "Occurs after the value of an input, select or textarea has been changed.",
            tags: ["input", "textarea", "select"],
            link: "https://www.w3schools.com/jsref/event_oninput.asp"
        },
        {
            name: "submit",
            category: "Form",
            description: "Sent when a form is submitted, allowing validation before request is sent.",
            tags: ["form"],
            link: "https://www.w3schools.com/jsref/event_onsubmit.asp"
        },
        {
            name: "focus",
            category: "Focus",
            description: "Triggered when an element gains focus. Does not bubble.",
            tags: ["input", "button", "a"],
            link: "https://www.w3schools.com/jsref/event_onfocus.asp"
        },
        {
            name: "blur",
            category: "Focus",
            description: "Triggered when an element loses focus. Helpful for validation.",
            tags: ["input", "button", "a"],
            link: "https://www.w3schools.com/jsref/event_onblur.asp"
        },
        {
            name: "copy",
            category: "Clipboard",
            description: "Fires when the user copies the selected text to the clipboard.",
            tags: ["input", "textarea", "document"],
            link: "https://www.w3schools.com/jsref/event_oncopy.asp"
        },
        {
            name: "dragstart",
            category: "Drag & Drop",
            description: "Occurs when the user starts dragging an element or text selection.",
            tags: ["img", "a", "div"],
            link: "https://www.w3schools.com/jsref/event_ondragstart.asp"
        },
        {
            name: "drop",
            category: "Drag & Drop",
            description: "Triggered when an element is dropped on a valid drop target.",
            tags: ["div", "section"],
            link: "https://www.w3schools.com/jsref/event_ondrop.asp"
        },
        {
            name: "touchstart",
            category: "Touch",
            description: "Fires when a finger is placed on the touch surface.",
            tags: ["div", "canvas", "document"],
            link: "https://www.w3schools.com/jsref/event_ontouchstart.asp"
        },
        {
            name: "pointerenter",
            category: "Pointer",
            description: "Similar to mouseenter but works with pen, touch and mouse input.",
            tags: ["div", "button"],
            link: "https://www.w3schools.com/jsref/event_pointerenter.asp"
        },
        {
            name: "transitionend",
            category: "Animation/Transition",
            description: "Called when a CSS transition has completed.",
            tags: ["div", "section", "button"],
            link: "https://www.w3schools.com/jsref/event_transitionend.asp"
        },
        {
            name: "animationstart",
            category: "Animation/Transition",
            description: "Dispatched when a CSS animation starts playing.",
            tags: ["div", "section"],
            link: "https://www.w3schools.com/jsref/event_animationstart.asp"
        },
        {
            name: "DOMContentLoaded",
            category: "DOM",
            description: "Fires when the initial HTML document has been completely loaded and parsed.",
            tags: ["document"],
            link: "https://www.w3schools.com/jsref/event_onload.asp"
        },
        {
            name: "change",
            category: "Form",
            description: "Triggered when an element loses focus and its value has changed.",
            tags: ["input", "textarea", "select"],
            link: "https://www.w3schools.com/jsref/event_onchange.asp"
        },
        {
            name: "paste",
            category: "Clipboard",
            description: "Fires when the user pastes data into an element.",
            tags: ["input", "textarea", "contenteditable"],
            link: "https://www.w3schools.com/jsref/event_onpaste.asp"
        },
        {
            name: "volumechange",
            category: "Media",
            description: "Occurs when the volume of an audio/video element is changed.",
            tags: ["audio", "video"],
            link: "https://www.w3schools.com/jsref/event_onvolumechange.asp"
        }
    ];

    document.addEventListener("DOMContentLoaded", () => {
        const tableBody = document.getElementById("events-table-body");
        const searchInput = document.getElementById("events-search");
        const categorySelect = document.getElementById("events-category");
        const status = document.getElementById("events-status");
        if (!tableBody) {
            return;
        }

        const render = () => {
            const searchTerm = searchInput.value.trim().toLowerCase();
            const category = categorySelect.value;
            const filtered = eventsData.filter((event) => {
                const matchesCategory = category === "all" || event.category === category;
                const matchesSearch =
                    event.name.toLowerCase().includes(searchTerm) ||
                    event.description.toLowerCase().includes(searchTerm);
                return matchesCategory && matchesSearch;
            });
            updateTable(tableBody, filtered);
            updateStatus(status, filtered.length);
        };

        searchInput.addEventListener("input", render);
        categorySelect.addEventListener("change", render);
        render();
    });

    function updateTable(tableBody, events) {
        tableBody.innerHTML = "";
        if (events.length === 0) {
            const row = document.createElement("tr");
            const cell = document.createElement("td");
            cell.colSpan = 5;
            cell.textContent = "No events match the current filters.";
            row.appendChild(cell);
            tableBody.appendChild(row);
            return;
        }
        events.forEach((event) => {
            const row = document.createElement("tr");
            row.appendChild(createCell(event.name));
            row.appendChild(createCell(event.category));
            row.appendChild(createCell(event.description));
            row.appendChild(createTagCell(event.tags));
            row.appendChild(createLinkCell(event.link));
            tableBody.appendChild(row);
        });
    }

    function createCell(text) {
        const cell = document.createElement("td");
        cell.textContent = text;
        return cell;
    }

    function createTagCell(tags) {
        const cell = document.createElement("td");
        const list = document.createElement("ul");
        list.className = "tag-pills";
        tags.forEach((tag) => {
            const li = document.createElement("li");
            li.className = "tag-pill";
            li.textContent = tag;
            list.appendChild(li);
        });
        cell.appendChild(list);
        return cell;
    }

    function createLinkCell(url) {
        const cell = document.createElement("td");
        const link = document.createElement("a");
        link.href = url;
        link.target = "_blank";
        link.rel = "noreferrer";
        link.textContent = "Open";
        cell.appendChild(link);
        return cell;
    }

    function updateStatus(statusElement, count) {
        if (!statusElement) {
            return;
        }
        statusElement.textContent = count === 1 ? "Showing 1 event" : `Showing ${count} events`;
    }
})();
