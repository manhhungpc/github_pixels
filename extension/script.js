document.getElementById("draw").addEventListener("click", function () {
    const input = document.getElementById("userinput").value;
    const styles = document.querySelectorAll("input[name='size']");
    let size = "medium";

    for (const style of styles) {
        if (style.checked) {
            size = style.value;
            break;
        }
    }

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(
            tabs[0].id,
            {
                word: input,
                size: size,
            },
            function (response) {
                console.log(response);
            }
        );
    });
});
