const parentDiv1 = document.getElementById('tsel_chart');
let titlesParent1 = ["Telkom Sentul 59", "Telkom Sentul 60", "Icon+ GM 29", "Icon+ GM 30"];
generateParent(parentDiv1, "ChartX", titlesParent1);
const parentDiv2 = document.getElementById('network_chart');
let titlesParent2 = ["Telepulsa Biznet", "Telepulsa Icon+", "TeleH2H Biznet", "TeleH2H LA"]
generateParent(parentDiv2, "ChartY", titlesParent2);
function generateParent(parentDiv, chartName, arrName) {
    for (let i = 0; i < 4; i++) {
        const div = document.createElement('div');
        div.setAttribute('class', 'block max-w-min max-h-xs p-1 m-2 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700');
        div.setAttribute('href', '#');

        const innerDiv = document.createElement('div');
        innerDiv.setAttribute('class', 'text-white text-center text-sm');
        const h2 = document.createElement('h3');
        h2.textContent = `${arrName[i]}`;
        innerDiv.appendChild(h2);

        const canvas = document.createElement('canvas');
        canvas.setAttribute('id', `${chartName}${i}`);
        canvas.setAttribute('style', 'height: 100px');
        canvas.setAttribute('width', '250');

        div.appendChild(innerDiv);
        div.appendChild(canvas);
        parentDiv.appendChild(div);
    }
    generateCharts(chartName);
}