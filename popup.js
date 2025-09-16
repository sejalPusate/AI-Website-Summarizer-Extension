document.getElementById("summarizeBtn").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Hide copy button before generating
  const copyBtn = document.getElementById("copyBtn");
  copyBtn.style.display = "none";

  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      files: ["contentScript.js"],
    },
    async (results) => {
      const pageText = results[0].result;
      const outputElement = document.getElementById("output");
      outputElement.innerText = "Generating summary...";

      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer ${YOUR_API_KEY}" // Replace with your actual API key
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: `Summarize this in 3-4 bullet points:\n${pageText}` }]
          })
        });

        const data = await response.json();
        const summary = data.choices[0].message.content;

        // Show summary and copy button
        outputElement.innerText = summary;
        copyBtn.style.display = "inline-block";

        // Copy functionality
        copyBtn.onclick = async () => {
          try {
            await navigator.clipboard.writeText(summary);
            copyBtn.innerText = "✅ Copied!";
            setTimeout(() => (copyBtn.innerText = "📋 Copy"), 1500);
          } catch (err) {
            alert("Failed to copy: " + err);
          }
        };

      } catch (err) {
        outputElement.innerText = "Error: " + err.message;
      }
    }
  );
});
