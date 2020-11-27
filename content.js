//----------------------------------------> Global Variables <--------------------------------------------

var nodes = document.getElementById("trade").childNodes[1].firstChild.getElementsByTagName("tr");
var endIndex = parseInt(document.getElementById("d08").textContent.toString().replace(",",""));
var maxAllowablePrice = parseInt(document.getElementById("d13").textContent.toString().replace(",",""));
var minAllowableprice = parseInt(document.getElementById("d14").textContent.toString().replace(",",""));

var firstIndexOLS = 0;
var lastIndexOLS = 0;
var lastIndexOfFirstSecond = 0;

var totalAcceptedVolume = 0;
var numberOfAcceptVolumes = 0;
var totalNumbers = endIndex;
var moreThanX = 0;
var xBound = 0;
var volRatio = 0;

//-------------------------------------------> Functions <----------------------------------------------

//Sort Time Column
function sortTime()
{
    var trade = document.getElementById("trade");
    trade = trade.childNodes[0].childNodes[1].firstChild.lastChild.childNodes[1].firstChild;
    trade.click();
    console.log("Time Has Been Sorted");
}

//Changing Style of Nodes
function ChangeStyle(index)
{
    nodes[index].childNodes[0].style.backgroundColor = "red";
    nodes[index].childNodes[1].style.backgroundColor = "red";
    nodes[index].childNodes[2].style.backgroundColor = "red";
    nodes[index].childNodes[3].style.backgroundColor = "red";
}

//First Second Trade
function fitstTimeTrade()
{
    var firstSecond = nodes[1].childNodes[1].textContent.toString();
    for(var i = 1; i <= endIndex; i++)
    {
        var volume = parseInt(nodes[i].childNodes[2].textContent.toString());
        var price = parseInt(nodes[i].childNodes[3].textContent.toString());

        if(nodes[i].childNodes[1].textContent.toString() != firstSecond)
        {
            firstIndexOLS = 1;
            lastIndexOLS = i-1;
            lastIndexOfFirstSecond = i-1;
            break;
        }

        else if(volume*price >= 500000000)
        {
            ChangeStyle(i);

            totalAcceptedVolume += volume;
            numberOfAcceptVolumes++;

            if(volume > xBound)
                moreThanX++;
        }
    }
}

function FullTrade()
{

    var tmpFirstIndexOLS = firstIndexOLS;
    var tmpLastIndexOLS = lastIndexOLS;

    for(var i = lastIndexOfFirstSecond+1; i <= endIndex; i++)
    {

        if(nodes[i].childNodes[1].textContent.toString() != nodes[i-1].childNodes[1].textContent.toString())
        {
            firstIndexOLS = tmpFirstIndexOLS;
            lastIndexOLS = tmpLastIndexOLS;
        }

        var volume = parseInt(nodes[i].childNodes[2].textContent.toString());
        var price = parseInt(nodes[i].childNodes[3].textContent.toString());

        if(nodes[i].childNodes[1].textContent.toString() != nodes[i-1].childNodes[1].textContent.toString())
            tmpFirstIndexOLS = i;
        if(i == endIndex|| nodes[i].childNodes[1].textContent.toString() != nodes[i+1].childNodes[1].textContent.toString())
            tmpLastIndexOLS = i;

        if(price*volume >= 500000000)
        {
            if(price == maxAllowablePrice || price == minAllowableprice)
            {
                ChangeStyle(i);

                totalAcceptedVolume += volume;
                numberOfAcceptVolumes++;

                if(volume > xBound)
                    moreThanX++;

            }

            else
            {
                var flag = false;

                for(var j = lastIndexOLS; j >= firstIndexOLS; j--)
                {
                    var prevPrice = parseInt(nodes[j].childNodes[3].textContent.toString());
                    if(price > prevPrice)
                    {
                        ChangeStyle(i);

                        totalAcceptedVolume += volume;
                        numberOfAcceptVolumes++;

                        if(volume > xBound)
                            moreThanX++;

                        flag = true;
                        break;
                    }
                }

                if(!flag)
                {
                    for(var j = i-1; j > lastIndexOLS; j--)
                    {
                        var prevPrice = parseInt(nodes[j].childNodes[3].textContent.toString());
                        if(price > prevPrice)
                        {
                            ChangeStyle(i);

                            totalAcceptedVolume += volume;
                            numberOfAcceptVolumes++;

                            if(volume > xBound)
                                moreThanX++;

                            break;
                        }
                    }
                }

            }

        }

    }

}

//Send Message
function sendMessage()
{
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
        if(request.from == "popup" && request.subject == "sendData")
        {
            var msg = {
                totalAcceptedVolume : totalAcceptedVolume,
                volRatio : volRatio,
                xBound : xBound
            };

            sendResponse(msg);
        }
    });

    console.log("All of Messages Have Been Sent");
}

function VolumeBound()
{
    var cost = 500000000;
    var minPermittedPrice = parseInt(document.getElementById("d14").textContent.toString().replace(",",""));

    xBound = cost/minPermittedPrice;
}

function VolumeRatio()
{
    volRatio = (moreThanX*100)/numberOfAcceptVolumes;
}


function Main()
{
    VolumeBound();

    //This Function Sort Time for another functions
    sortTime();

    fitstTimeTrade();

    FullTrade();

    VolumeRatio();

    sendMessage();
}

Main();
