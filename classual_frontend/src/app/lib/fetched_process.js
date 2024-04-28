

async function fetchExampleCSV() {
    try {
        const res = await fetch('../../../example_data/AAS 10.csv');
        const data = await res.text();
        console.log(data);
    } catch (e) {
        console.log(e);
    }
};

export default fetchExampleCSV;