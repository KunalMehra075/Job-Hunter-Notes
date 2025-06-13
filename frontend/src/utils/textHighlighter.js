const highlightText = (text, companyName) => {
    // Split the text into parts based on {{}} syntax
    const parts = text.split(/(\{\{[^}]+\}\})/g);

    return parts.map((part, index) => {
        // Check if the part is a variable (wrapped in {{}})
        if (part.startsWith('{{') && part.endsWith('}}')) {
            const variable = part.slice(2, -2).trim();

            // If it's the correct companyName variable
            if (variable === 'companyName') {
                return `<span class="bg-green-500/20 text-green-400 px-1 rounded">${companyName}</span>`;
            }

            // If it's an incorrect variable
            return `<span class="bg-red-500/20 text-red-400 px-1 rounded">${part}</span>`;
        }

        // Regular text
        return part;
    }).join('');
};

export default highlightText; 