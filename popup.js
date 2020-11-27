
chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    msg = {from : "popup", subject : "sendData"};
    chrome.tabs.sendMessage(tabs[0].id, msg, gotMessage);
});

function gotMessage(msg)
{
    console.log("start of gotMessage Function in Popup Script");

    var table = document.getElementById("tblTotal");

    //creating Table row
    var tr = document.createElement("tr");
    //creating Table Datas
    var totalVolTd = document.createElement("td");
    var totalVolRatioTd = document.createElement("td");
    var minVolumeTd = document.createElement("td");
    
    //Setting Values
    totalVolTd.innerHTML = msg.totalAcceptedVolume;
    minVolumeTd.innerHTML = Math.floor(msg.xBound);
    totalVolRatioTd.innerHTML = msg.volRatio.toFixed(2) + "%";

    //Some CSS
    totalVolTd.align = "center";
    totalVolRatioTd.align = "center";
    minVolumeTd.align = "center"

    //Append to tr
    tr.appendChild(totalVolTd);
    tr.appendChild(totalVolRatioTd);
    tr.appendChild(minVolumeTd);

    //Append to Table
    table.appendChild(tr);

    console.log("end of gotMessage Function in Popup Script");
}

/*chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, msg);
});*/
