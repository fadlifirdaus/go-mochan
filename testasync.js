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

function genChart(datax) {
    let name = datax.name;
    let temp = []
    let arrayData = datax.data;
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
    genChartCanvas(name, varData);
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
            labels: {
                color: "rgb(255, 99, 132)",
            },
        },
    },
    animation: false,
    scales: {
        y: {
            ticks: {
                display: true,
                color: "white",
                callback: function (value, index, values) {
                    if (value == 1) {
                        return "U";
                    } else if (value == -1) {
                        return "D";
                    }
                },
            },
            gridLines: {
                display: false,
            },
        },
        x: {
            ticks: {
                display: true,
                autoSkip: true,
                maxTicksLimit: 5,
            },
            gridLines: {
                drawBorder: false,
            },
        },
    },
};

function genChartCanvas(chartName, datax) {
    if (initialized == false) {
        genChartLayout(chartName);
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
        let ctx = document.getElementById(`${chartName}_x`).getContext("2d");
        myChart.destroy();
        myChart = new Chart(ctx, {
            type: "line",
            data: datax,
            options: optionx,
        });
    }
}

function genChartLayout(chartName) {
    const exampleParent = document.getElementById(`${chartName}_chart`);
    const div = document.createElement('div');
    div.setAttribute('class', 'block w-full max-h-xs p-2 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700');
    div.setAttribute('href', '#');

    const innerDiv = document.createElement('div');
    innerDiv.setAttribute('class', 'text-white text-center text-sm');
    const h2 = document.createElement('h3');
    h2.textContent = chartName;
    innerDiv.appendChild(h2);

    const canvas = document.createElement('canvas');
    canvas.setAttribute('id', `${chartName}_x`);
    canvas.setAttribute('height', '100px');
    canvas.setAttribute('width', '350px');

    div.appendChild(innerDiv);
    div.appendChild(canvas);
    exampleParent.appendChild(div);
}
