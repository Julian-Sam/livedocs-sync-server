export const searchAPI = async (query: string) => {
    return fetch('http://localhost:3030/search',
        {
            method: 'POST',
            body: JSON.stringify({ q: query }),
            headers: { 'Content-Type': 'application/json' },
        })
        .then((response) => response.json())
        .catch((err) => console.error('Error:', err))
}


