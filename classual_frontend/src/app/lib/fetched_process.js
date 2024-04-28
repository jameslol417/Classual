
async function fetchCsv() {
    const response = await fetch('/AAS 10.csv');
    const reader = response.body.getReader();
    const result = await reader.read();
    const decoder = new TextDecoder('utf-8');
    const csv = await decoder.decode(result.value);
    console.log('csv', csv);
    return csv;
}

export default fetchCsv;
