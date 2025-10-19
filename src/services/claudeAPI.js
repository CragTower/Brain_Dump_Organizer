export async function organizeThoughts(dumpText) {
    try {
        const response = await fetch('/api/organize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: dumpText
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to organize thoughts');
        }

        const data = await response.json();
        return data.organizedText;

    } catch (error) {
        console.error('Error organizing thoughts: ', error);
        throw error;
    }
}