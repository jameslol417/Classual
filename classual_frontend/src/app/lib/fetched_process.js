import Papa from 'papaparse';

async function fetchCsv() {
    const response = await fetch('/AAS 10.csv');
    if (!response.ok) {
        throw new Error("Fetch CSV function error!!");
    }
    const reader = response.body.getReader();
    const result = await reader.read();
    const decoder = new TextDecoder('utf-8');
    const csv = decoder.decode(result.value);
    // console.log('csv: ', csv);
    const formattedData = parseCSV(csv);
    console.log('formattedDATA:', formattedData);
    return formattedData;
}

function parseCSV(csv) {
    const parsedData = Papa.parse(csv, { header: true, dynamicTyping: true, skipEmptyLines: true });
    // Transform the parsed data into the desired format
    const formattedData = parsedData.data.map(entry => ({
        courseName: 'cse11', // Assuming a static value for all entries
        time: entry.time.split('T')[0], // Assuming the 'time' field needs to be split to remove time part
        enrolledNumber: entry.enrolled,
        waitlistNumber: entry.waitlisted,
        totalSeatNumber: entry.total,
        first_pass_time: '2020-08-09', // Static dates for demonstration
        second_pass_time: '2020-08-09',
        quarterStart_pass_time: '2020-08-09'
    }));

    return formattedData;
}

// implement parse Data and then return the data that can be used directly in recharts

export default fetchCsv;