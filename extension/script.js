document.getElementById("draw").addEventListener("click", function () {
    processInputRequest();
});

document.getElementById("draw-save").addEventListener("click", function () {
    const store = formatInput(document.getElementById("userinput").value);

    chrome.storage.sync.set({ "github-pixels": formatInput(store) });

    processInputRequest();
});

document.getElementById("remove").addEventListener("click", function () {
    chrome.storage.sync.clear();
    document.getElementById("remove").textContent = "Removed! Please refresh >_<";
});

const formatInput = (input) => {
    let format = "";

    for (let i = 0; i < input.length; i++) {
        const char = input[i];
        format += char.toUpperCase();
    }
    return format;
};

const processInputRequest = (saved) => {
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
                input: formatInput(input),
                size: size,
            },
            function (response) {
                console.log(response);
            }
        );
    });
};
