document.getElementById("draw").addEventListener("click", function () {
  const input = document.getElementById('userinput').value

  console.log(input)
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    console.log(tabs)
    chrome.tabs.sendMessage(tabs[0].id, {
      word: document.getElementById('userinput').value,
    }, function (response) {
      console.log(response);
    });
  });
})

