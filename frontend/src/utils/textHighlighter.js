const highlightText = (text, companyName, jobTitle, jobLink, personName) => {
    // Split the text into parts based on {{}} syntax
    const parts = text.split(/(\{\{[^}]+\}\})/g);

    return parts.map((part, index) => {
        if (part.startsWith('{{') && part.endsWith('}}')) {
            const variable = part.slice(2, -2).trim();
            if (variable === 'companyName') {
                return `<span class="bg-green-500/20 text-green-400 px-1 rounded">${companyName}</span>`;
            }
            if (variable === 'jobTitle') {
                return `<span class="bg-blue-500/20 text-blue-400 px-1 rounded">${jobTitle}</span>`;
            }
            if (variable === 'jobLink') {
                return `<span class="bg-pink-500/20 text-pink-400 px-1 rounded">${jobLink}</span>`;
            }
            if (variable === 'personName') {
                return `<span class="bg-yellow-500/20 text-yellow-400 px-1 rounded">${personName}</span>`;
            }

            return `<span class="bg-red-500/20 text-red-400 px-1 rounded">${part}</span>`;
        }


        return part;
    }).join('');
};

export default highlightText; 