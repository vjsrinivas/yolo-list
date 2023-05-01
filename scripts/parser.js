var CSV_FILE = "https://raw.githubusercontent.com/vjsrinivas/yolo-list/master/data.csv";

const showYOLOExplain = document.getElementById('showYOLOExplain');
const YOLOExplain = document.getElementById('YOLOExplain');
const closeBtn = YOLOExplain.querySelector('#closeBtn');
const objectDetection = document.getElementById('showDetectionTable');
const panopticSeg = document.getElementById('showPanopticTable')

showYOLOExplain.addEventListener('click', (event) => { YOLOExplain.showModal(); });
YOLOExplain.addEventListener('close', () => {});
closeBtn.addEventListener('click', (event) => {});

objectDetection.addEventListener('click', (event) => {
    setActiveSheet('showDetectionTable')
})

panopticSeg.addEventListener('click', (event) => {
    setActiveSheet('showPanopticTable')
})

function getCSV(func) {
    var rawFile = new XMLHttpRequest();
    var allText;

    rawFile.open("GET", CSV_FILE, false);

    rawFile.onreadystatechange = function () {
        if(rawFile.readyState === 4)
            if(rawFile.status === 200 || rawFile.status == 0)
                allText = rawFile.responseText;
                if(func!=undefined && typeof(func) == "function"){
                    func(allText);
                 }
    };

    rawFile.send()
}

function csvList(csv) {
    csv = csv.replace(/(\r)/gm, "");
    var lines = csv.split("\n");
    var result = [];
    var netFamily = new Set()

    for(var i=1;i<lines.length;i++){
        var currentline=lines[i].split(",");
        const networkFamily = currentline[0];
        if(netFamily.has(networkFamily)) {
            currentline[0] = ''
        } else {
            netFamily.add(networkFamily)
        }

        result.push(currentline);
    }

    return result; //JSON
}

/*
getCSV(function(contents){
    var out = csvJSON(contents)
    console.log(out)
})
*/

function calculateStyle(cat) {
    const template = 'py-2 px-4 m-1 text-xs rounded-full'
    switch(cat) {
        case 'coco':
            return template + ' text-white bg-gradient-to-r from-green-400 to-blue-500';
        case 'pjreddie':
            return template + ' text-white bg-gradient-to-r from-pink-500 to-yellow-500';
        case 'ultralytics':
            return template + ' text-white bg-gradient-to-r from-violet-500 to-fuchsia-500';
        case 'baidu':
            return template + ' text-white bg-gradient-to-r from-blue-500 to-red-500';
        default:
            return template + ' text-white bg-blue-600';
            //text-white bg-blue-600 
    }
    
}

function calculateDatasetStyle(cat) {
    const template = 'py-2 px-4 m-1 text-xs rounded-full'
    switch(cat) {
        case 'voc2007-test':
            return template + ' ';
        // case 'pjreddie':
        //     return '';
        default:
            return template + ' text-white bg-blue-600';
            //text-white bg-blue-600 
    }
}

var currentSheet = "";
const sheet2Color = {"showDetectionTable": [["bg-violet-500","text-white"], ["bg-none", "text-black"]], "showPanopticTable": [["bg-violet-500","text-white"], ["bg-none", "text-black"]]}
setActiveSheet("showDetectionTable");

// [before, after] 
function setActiveSheet(targetSheet) {
    // targetSheet is a string taken from a button's input text:
    if(targetSheet == 'showDetectionTable' && currentSheet != targetSheet ) {
        // remove old color:
        sheet2Color["showPanopticTable"][0].forEach(element => {
            panopticSeg.classList.remove(element)
        });
        //panopticSeg.classList.remove(sheet2Color["showPanopticTable"][0]); 
        
        sheet2Color["showDetectionTable"][0].forEach(element => {
            objectDetection.classList.add(element); 
        });
        currentSheet = targetSheet;
    }

    else if(targetSheet == 'showPanopticTable' && currentSheet != targetSheet ) {
        // remove old color:
        sheet2Color["showPanopticTable"][0].forEach(element => {
            panopticSeg.classList.add(element)
        });
        //panopticSeg.classList.remove(sheet2Color["showPanopticTable"][0]); 
        
        sheet2Color["showDetectionTable"][0].forEach(element => {
            objectDetection.classList.remove(element); 
        });
        currentSheet = targetSheet;
    }

    // UPDATE GRIDJS HERE:
}

// Default button selection

const columns = [
    {
        name:"Network",
        columns: [{
            name: 'Family',
            sort: false,
            formatter: cell => {
                return gridjs.h('b', {}, cell);
            }
        }, {
            name: 'Name',
        }]
    }, 
    {
        name:"Paper",
        formatter: cell => {
            if(cell.length > 0) {
                return gridjs.h('a', {
                    href: cell,
                    className: 'default_link'
                }, "Link");
            }
        },
        sort: false
    },
    "Year Published",
    {
        name:"Categories",
        formatter:  (cell, row) => { 
            _cell = cell.split(';');
            _construction = "";
            _cell.forEach(element => {
                element = element.trim()
                if(element != 'odd') {
                    _construction += `<button class=\"`+ calculateStyle(element) +`\">${element}</button>`
                } else {
                    console.log(row.cell[0])
                }
            });
            //console.log(_construction);
            return gridjs.html(_construction);
        }
    }, 
    {
        name:"Dataset Type",
        formatter:  cell => { 
            _cell = cell.split(';');
            _construction = "";
            _cell.forEach(element => {
                _construction += `<button class=\"`+ calculateStyle(element) +`\">${element}</button>`
            });
            //console.log(_construction);
            return gridjs.html(_construction);
        }

    }, 
    {
        name:"mAP@0.5",
        formatter: cell => {
            _construction = "";
            _cells = cell.split(';')
            _cells.forEach(element => {
                _construction += `${element}<br>`
            });
            return gridjs.html(_construction);
        }
    }, 
    {
        name: "COCO mAP",
        formatter: cell => {
            _construction = "";
            _cells = cell.split(';')
            _cells.forEach(element => {
                _construction += `${element}<br>`
            });
            return gridjs.html(_construction);
        }
    },
    {
        name:"Code Source",
        formatter: cell => {
            if(cell.length > 0) {
                _construction = `<a class="default_link" href="${cell}">Link</a>`
            } else {
                _construction = ""
            }
            return gridjs.html(_construction)
        },
        sort: false
    }, 
    { 
        name: "Notes",
        sort: false
    }
]

const grid = new gridjs.Grid({
    columns: columns,
    sort: true,
    search: true,
    resizable: true,
    data: () => {
        return new Promise(resolve => {
            fetch(CSV_FILE)
            .then(response => response.text())
            .then(data => { var _data = csvList(data); console.log(data); resolve(_data)})
        });
    },
})
  
grid.render(document.getElementById("wrapper"));