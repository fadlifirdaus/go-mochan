// function getMonitoringData(name) {
//     var xhr = new XMLHttpRequest();
//     xhr.open('GET', 'http://localhost:8080/mon?name=' + name);
//     xhr.onload = function () {
//         if (xhr.status === 200) {
//             var data = JSON.parse(xhr.responseText);
//             console.log(data);
//         } else {
//             console.log('Request failed.  Returned status of ' + xhr.status);
//         }
//     };
//     xhr.send();
// }
// // Example usage:
// getMonitoringData('https://www.example.com');

function generateData(s = "random") {
    let result = [];
    let date = new Date();
    for (let i = 0; i < 10; i++) {
        // Subtract i minutes from the current time
        date.setMinutes(date.getMinutes() - 1);
        // Get time in HH:MM format
        let hours = date.getHours().toString().padStart(2, "0");
        let minutes = date.getMinutes().toString().padStart(2, "0");
        let labels = `${hours}:${minutes}`;
        let ONs = 0;
        // check if s is not defined
        if (s == "UP") {
            // Generate random ON value (1 or 0)
            ONs = 1;
        } else if (s == "DOWN") {
            // Generate random ON value (1 or 0)
            ONs = 0;
        }
        else {
            // Generate random ON value (1 or 0)
            ONs = Math.round(Math.random());
        }
        // Set OFF value based on ON value
        let OFFs = ONs === 1 ? 0 : -1;
        // Add object to result array
        result.push({ label: labels, ON: ONs, OFF: OFFs });
        result.sort((a, b) => a.label.localeCompare(b.label));
    }
    let labelArray = [];
    let ONArray = [];
    let OFFArray = [];
    for (let i = 0; i < result.length; i++) {
        labelArray.push(result[i].label);
        ONArray.push(result[i].ON);
        OFFArray.push(result[i].OFF);
    }
    dataArray = { labelArray, ONArray, OFFArray };
    varData = generateArray(dataArray);
    return varData
}

function generateArray(dataArray) {
    let data = {
        labels: dataArray.labelArray,
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


let options = {
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

function generateCharts(chartName) {
    // create chart
    for (let i = 0; i < 4; i++) {
        // create variable as names in js like 'myChart{i}='
        let ctx = document.getElementById(`${chartName}${i}`).getContext("2d");
        const obj = {
            ['chartX' + i]: ctx,
        }
        if (i == 0 && chartName == "ChartX") {
            dataX = generateData("UP");
        } else if (i == 1 && chartName == "ChartX") {
            dataX = generateData("DOWN");
        } else {
            dataX = generateData();
        }
        const myChart = new Chart(obj['chartX' + i], {
            type: "line",
            data: dataX,
            options: options,
        });
    }
}

