let initialized = false;
var myChart;
async function getMonitoringData(name) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:8080/mon?name=' + name);
    xhr.send();

    return new Promise(function (resolve, reject) {
        xhr.onload = function () {
            if (xhr.status === 200) {
                var data = JSON.parse(xhr.responseText);
                // console.log(data);
                resolve(data);
            } else {
                // console.log('Request failed.  Returned status of ' + xhr.status);
                reject(xhr.status);
            }
        };
    });
}

async function updateData() {
    var data = await getMonitoringData('example');
    // var div = document.getElementById('data');
    // console.log(data);
    genChart(data);
    // div.innerHTML = JSON.stringify(data);
}

// Example usage:
setTimeout(function () {
    updateData();
    setInterval(function () {
        updateData();
    }, 5000);
}, 0);

function genChart(data) {
    let name = data.name;
    let temp = []
    let arrayData = data.data;
    // console.log(arrayData);
    let maxData = arrayData.length;
    // process aray to get OFF value (-1)
    for (let i = 0; i < maxData; i++) {
        let isUp = 0;
        // check status value
        if (arrayData[i].status == 1) {
            isUp = 1;
        }
        let isDown = isUp === 1 ? 0 : -1;
        // Add object to temp array
        temp.push({ time: arrayData[i].time, ON: isUp, OFF: isDown });
    }
    let timeArray = [];
    let ONArray = [];
    let OFFArray = [];
    for (let i = 0; i < temp.length; i++) {
        timeArray.push(temp[i].time);
        ONArray.push(temp[i].ON);
        OFFArray.push(temp[i].OFF);
    }
    // console.log("time");
    // console.log(timeArray);
    dataArray = { timeArray, ONArray, OFFArray };
    varData = updateArray(dataArray);
    genChartCanvas(name, data.url, varData, data.updated_at);
}

function updateArray(dataArray) {
    // console.log(dataArray.timeArray);
    let data = {
        labels: dataArray.timeArray,
        datasets: [
            {
                // label: "On",
                data: dataArray.ONArray,
                backgroundColor: "rgba(24, 163, 224, 0.7)",
                fill: true,
                stepped: true,
                pointStyle: false,
            },
            {
                // label: "Off",
                data: dataArray.OFFArray,
                backgroundColor: "rgba(255, 0, 0, 0.7)",
                fill: true,
                stepped: true,
                pointStyle: false,
            },
        ],
    };
    return data;
}



let optionx = {
    plugins: {
        legend: {
            display: false,
        }
    },
    animation: false,
    scales: {
        y: {
            ticks: {
                display: false,
            },
        },
        x: {
            ticks: {
                align: 'start',
                display: true,
                color: "#aaaaaa",
                autoSkip: true,
                maxTicksLimit: 5,
            },
        },
    },
};


function genChartCanvas(chartName, url, datax, updated_at) {
    if (initialized == false) {
        genChartLayout(chartName, url, updated_at);
        var ctx = document.getElementById(`${chartName}_x`).getContext("2d");
        myChart = new Chart(ctx, {
            type: "line",
            data: datax,
            options: optionx,
        });
        // console.log(myChart.data);
        // console.log(datax)
        initialized = true;
    } else {
        // Get the third element
        var updatedAt = document.querySelector("#Example_chart > div > div:last-child > pre");
        updatedAt.innerHTML = `updated at ${updated_at}`;
        let ctx = document.getElementById(`${chartName}_x`).getContext("2d");
        myChart.destroy();
        myChart = new Chart(ctx, {
            type: "line",
            data: datax,
            options: optionx,
        });
    }
}

function genChartLayout(chartName, url, updated_at) {
    const exampleParent = document.getElementById(`${chartName}_chart`);
    const div = document.createElement('div');
    div.setAttribute('class', 'block w-full p-2 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700');

    const innerDiv = document.createElement('div');
    innerDiv.setAttribute('class', 'text-white text-center text-sm');
    const pre = document.createElement('pre');
    pre.textContent = chartName + " " + url;
    innerDiv.appendChild(pre);

    const canvas = document.createElement('canvas');
    canvas.setAttribute('id', `${chartName}_x`);
    canvas.setAttribute('height', '100px');
    canvas.setAttribute('width', '350px');

    const dateDiv = document.createElement('div');
    dateDiv.setAttribute('class', 'text-white text-center text-xs');
    let dates = new Date();
    const dt = document.createElement('pre');
    dt.textContent += `updated at ${updated_at}`;
    dateDiv.appendChild(dt);

    div.appendChild(innerDiv);
    div.appendChild(canvas);
    div.appendChild(dateDiv);
    exampleParent.appendChild(div);
}
