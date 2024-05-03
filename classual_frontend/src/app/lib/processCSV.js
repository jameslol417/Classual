import Papa from 'papaparse';

function parseCSV(csv, course) {
    const parsedData = Papa.parse(csv, { header: true, dynamicTyping: true, skipEmptyLines: true });
    // Transform the parsed data into the desired format
    const formattedData = parsedData.data.map(entry => ({
        courseName: course, // Assuming a static value for all entries
        time: entry.time.split('T')[0], // Assuming the 'time' field needs to be split to remove time part
        enrolledNumber: entry.enrolled,
        waitlistNumber: entry.waitlisted,
        totalSeatNumber: entry.total,
        first_pass_time: '2020-08-09', // TODOS figure out where to get this data - 
        second_pass_time: '2020-08-09',
        quarterStart_pass_time: '2020-08-09'
    }));

    return formattedData;
}

export default parseCSV;
// for all quarters, first pass, second pass for all courses are same