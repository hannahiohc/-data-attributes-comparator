javascript:(function() {
    const currentUrl = window.location.href;
    let modifiedUrl;
    let currentHeading;
    let doc;
    let matchedResults = [];
    let mismatchedResults = [];
    let modalContainer;

    if (currentUrl.includes('/kr/')) {
        modifiedUrl = currentUrl.replace('/kr/', '/');
        currentHeading = 'KR';
    } else if (currentUrl.endsWith('/')) {
        modifiedUrl = currentUrl.replace('.com/', '.com/kr/');
        currentHeading = 'US';
    } else {
        modifiedUrl = currentUrl.replace('.com', '.com/kr/');
        currentHeading = 'US';
    }

    const createModalContainer = () => {
        const existingModal = document.getElementById('comparisonModal');
        if (existingModal) {
            existingModal.remove();
        }
        modalContainer = document.createElement('div');
        modalContainer.id = 'comparisonModal';
        modalContainer.style.display = 'none';
        document.body.appendChild(modalContainer);
    };

    createModalContainer();

    const showModal = (content) => {
        modalContainer.innerHTML = `
            <div style="width: 70%; max-width: 800px; height: fit-content; max-height: 80%; background: rgba(255, 255, 255, 0.9); margin: 20px 15px; padding: 15px 15px 0 15px; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 99999; overflow-y: auto; box-shadow: rgba(68, 68, 68, 0.12) 5px 5px 5px 0px; font-size: 13px; color: #444; border-radius: 15px;">
                ${content}
            </div>
        `;

        modalContainer.style.display = 'block';
    };

    const compareAttributes = (attribute) => {
        const krElements = document.querySelectorAll(`[data-${attribute}]`);
        const usElements = doc.querySelectorAll(`[data-${attribute}]`);

        krElements.forEach((krElement, index) => {
            const usElement = usElements[index];

            if (krElement && usElement) {
                if (
                    krElement.tagName === usElement.tagName &&
                    krElement.className === usElement.className &&
                    krElement.id === usElement.id
                ) {
                    const krValue = krElement.getAttribute(`data-${attribute}`);
                    const usValue = usElement.getAttribute(`data-${attribute}`);

                    if (krValue === usValue) {
                        matchedResults.push({
                            'Attribute': `[data-${attribute}]`,
                            'KR': krValue,
                            'US': usValue,
                        });
                    } else {
                        mismatchedResults.push({
                            'Attribute': `[data-${attribute}]`,
                            'KR': krValue,
                            'US': usValue,
                        });
                    }
                }
            }
        });
    };

    const fetchAndCompare = (url) => {
        return fetch(url)
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                doc = parser.parseFromString(html, 'text/html');

                attributes.forEach(compareAttributes);

                if (matchedResults.length > 0 || mismatchedResults.length > 0) {
                    const matchedContent = matchedResults.length > 0 ? generateTableContent('Matched Attributes', matchedResults) : 'No matched attributes found.';
                    const mismatchedContent = mismatchedResults.length > 0 ? generateTableContent('Mismatched Attributes', mismatchedResults) : 'No mismatches found.';

                    showModal(mismatchedContent + matchedContent);
                } else {
                    console.log('No attributes found for comparison.');
                }
            })
            .catch(error => console.error('Error fetching content:', error));
    };

    const generateTableContent = (title, results) => {
        const tableContent = `
            <h3 style="font-size: 20px; color: #333;">${title}</h3>
            <table style="width: 100%; margin-top: 5px; margin-bottom: 30px;">
                <tr>
                    <th style="font-weight: 600; font-size: 14px; background-color: #cddafd;">Attribute</th>
                    <th style="font-weight: 600; font-size: 14px; background-color: #cddafd;">KR</th>
                    <th style="font-weight: 600; font-size: 14px; background-color: #cddafd;">US</th>
                </tr>
                ${results.map(match => `
                    <tr style="border-bottom: 1px solid #ddd;">
                        <td style="padding-right: 10px;">${match.Attribute}</td>
                        <td style="padding-right: 10px;">${match.KR}</td>
                        <td>${match.US}</td>
                    </tr>
                `).join('')}
            </table>
        `;

        return tableContent;
    };

    const attributes = [
        'component-list',
        'analytics-section-engagement',
        'analytics-click',
        'analytics-title',
        'pricing-product',
        'product-template',
        'analytics-intrapage-link',
        'lazy',
        'empty',
        'will-show',
        'video-id',
        'tradein-product'
    ];

    if (currentHeading === 'KR') {
        fetchAndCompare(modifiedUrl);
    } else {
        fetchAndCompare(currentUrl);
    }
})();
