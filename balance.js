const tbody = document.createElement("tbody");

for (let i = 0; i < 4; i++) {
    const tr = document.createElement("tr");
    const th = document.createElement("th");
    const td = document.createElement("td");

    th.setAttribute("scope", "row");
    th.setAttribute(
        "class",
        "px-2 py-1 text-gray-900 whitespace-nowrap dark:text-gray-400"
    );
    th.textContent = `Mppa ${i + 1}`;

    tr.appendChild(th);
    tr.classList.add(
        "odd:bg-white",
        "odd:dark:bg-gray-900",
        "even:bg-gray-50",
        "even:dark:bg-gray-800",
        "border-b",
        "dark:border-gray-700",
        "text-center",
        "text-xs"
    );

    for (let j = 0; j < 17; j++) {
        const tdClone = td.cloneNode();
        tdClone.setAttribute("class", "px-2 py-1");
        rand = Math.floor(Math.random() * 9000000);
        // if random number is even, make it blue
        if (rand % 2 === 0) {
            tdClone.classList.add(
                "text-red-600",
                "dark:text-red-500"
            );
        }
        tdClone.textContent = rand
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        tr.appendChild(tdClone);
    }

    tbody.appendChild(tr);
}

document.querySelector("table").appendChild(tbody);