chrome.runtime.onMessage.addListener(gotMessage);

function gotMessage(msg)
{
    console.log(msg);
}