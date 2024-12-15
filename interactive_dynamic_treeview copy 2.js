if (typeof window.globalCriteria === "undefined") {
    window.globalCriteria = [];
}

fetch("treeview.json")
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const treeContainer = document.querySelector(".searchtree");
        if (!treeContainer) {
            console.error("Treeview container not found in the DOM.");
            return;
        }

        console.log("Treeview container found:", treeContainer);

        // Clear any existing content in the treeview container
        treeContainer.innerHTML = "<h4>Search by Unit Type or Ship Class:</h4>";

        // Build the tree structure
        const buildTree = (data, parentElement) => {
            const ul = document.createElement("ul");
            ul.classList.add("nested");

            data.forEach(item => {
                const li = document.createElement("li");
                const caret = document.createElement("span");
                const label = document.createElement("label");
                const input = document.createElement("input");

                caret.classList.add("caret");
                caret.textContent = item.UnitType || item.SubType || item.Classes;
                li.appendChild(caret);

                input.type = "checkbox";
                input.value = item.UnitType || item.SubType || item.Classes;
                label.appendChild(input);
                li.appendChild(label);

                if (item.SubTypes) {
                    const childUl = buildTree(item.SubTypes, li);
                    li.appendChild(childUl);
                }

                ul.appendChild(li);
            });

            return ul;
        };

        const treeStructure = buildTree(data.Units, treeContainer);
        treeContainer.appendChild(treeStructure);

        // Initialize expand/collapse functionality
        initializeTreeView();
    })
    .catch(error => {
        console.error("Error loading treeview.json:", error);
    });

function initializeTreeView() {
    const carets = document.querySelectorAll(".caret");
    carets.forEach(caret => {
        caret.addEventListener("click", () => {
            const parentLi = caret.parentElement;
            const nested = parentLi.querySelector(".nested");

            if (nested) {
                nested.classList.toggle("active");
                caret.classList.toggle("caret-down");
            }
        });
    });

    console.log("Treeview interaction initialized.");
}

document.getElementById("searchButton").addEventListener("click", () => {
    const checkedItems = Array.from(document.querySelectorAll(".searchtree input:checked"));
    const additionalCriteriaInput = document.getElementById("additionalCriteria").value.split(",").map(s => s.trim());
    window.globalCriteria = [...checkedItems.map(c => c.value), ...additionalCriteriaInput];
    console.log("Criteria updated:", window.globalCriteria);

    window.dispatchEvent(new Event("criteriaChanged"));
});
