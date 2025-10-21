// popup.js - safe injection with URL checks
document.getElementById("toggle").addEventListener("click", async () => {
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const tab = tabs[0];
    if (!tab || !tab.url) throw new Error("No active tab found.");

    // Only allow http(s) pages
    if (tab.url.startsWith("http://") || tab.url.startsWith("https://")) {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          document.body.style.backgroundColor = "#222";
          document.body.style.color = "#fff";
          alert("Accessibility mode enabled!");
        }
      });
    } else {
      // Show a helpful message and offer to open a test page
      if (confirm("This page is a browser/internal page (e.g. chrome://). AccessiLearn can only run on normal websites. Open example.com to test?")) {
        const newTab = await chrome.tabs.create({ url: "https://example.com" });
        // Optionally auto-run the script on the new tab after it loads:
        chrome.scripting.executeScript({
          target: { tabId: newTab.id },
          func: () => {
            document.body.style.backgroundColor = "#222";
            document.body.style.color = "#fff";
            alert("Accessibility mode enabled on demo page!");
          }
        });
      } else {
        alert("Please navigate to a normal website (https://) to use AccessiLearn features.");
      }
    }
  } catch (err) {
    console.error("Injection error:", err);
    alert("Could not enable accessibility mode: " + err.message);
  }
});
