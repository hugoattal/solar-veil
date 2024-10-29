const hideList = [
    "politics",
    "political",
    "relationship",
    "controvery",
    "entertainment",
    "hate",
    "troll",
    "meme",
    "election",
    "hateful",
    "news",
    "trending",
    "propaganda",
    "fashion"
];

async function main() {
    const cells = document.querySelectorAll('[data-testid="cellInnerDiv"]:not([data-solar-done])');

    for (const cell of cells) {
        if (cell.getAttribute('data-solar-done')) {
            continue;
        }

        const content = cell.querySelector('[dir="auto"]');
        if (!content) {
            continue;
        }
        cell.setAttribute('data-solar-done', 'true');

        const textContent = content.textContent;

        const prompt = `You are a tagging agent. Based on the social content provided, assign a relevant general tag. No explication needed, only the tag. Example: "politics", "sport", "technology", "hate", "troll"...\n\nContent: ${textContent}`;

        const session = await window.ai.assistant.create();
        let result = await session.prompt(prompt);
        result = result.replace(/(^\W+|\W+$)/g, '').toLowerCase();

        const span = cell.querySelectorAll('span')[1];
        const newSpan = document.createElement('span');
        newSpan.textContent = " ["+result+"]";
        span.appendChild(newSpan);

        if (hideList.includes(result)) {
            const overlay = document.createElement('div');
            overlay.style.position = 'absolute';
            overlay.style.inset = '0';
            overlay.style.bottom = "1px";
            overlay.style.background = 'rgba(0, 0, 0, 0.75)';
            overlay.style.backdropFilter = 'blur(16px)';
            overlay.style.display = 'flex';
            overlay.style.justifyContent = 'center';
            overlay.style.alignItems = 'center';

            const button = document.createElement('button');
            button.style.position = 'relative';
            button.textContent = `Show (${result})`;
            button.style.padding = '4px 8px';
            button.style.color = '#bbbbbb';
            button.style.border = '2px solid #bbbbbb';
            button.style.borderRadius = '16px';
            button.style.fontSize = '10px';
            button.style.cursor = 'pointer';
            button.style.background = "transparent";
            button.style.fontFamily = 'TwitterChirp, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
            button.addEventListener('click', () => {
                overlay.remove();
            });
            overlay.appendChild(button);

            cell.appendChild(overlay);
        }
    }
}

const observer = new MutationObserver(async (mutations) => {
    for (const mutation of mutations) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const element = node as HTMLElement;
                    if (element.matches('[data-testid="cellInnerDiv"]') || element.querySelector('[data-testid="cellInnerDiv"]')) {
                        await main();
                    }
                }
            }
        }
    }
});

// Start observing the document body for added nodes
observer.observe(document.body, {childList: true, subtree: true});