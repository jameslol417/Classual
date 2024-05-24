export default function parseTimeLineData(data) {
    // Adding detailed debugging logs
    let markers = data.markers;
    markers.sort((a, b) => a.i - b.i);

    let parsedData = {
        firstPass: {},
        secondPass: {},
        quarterStart: {},
    }

    markers.forEach((item, index) => {
        const n = item.n.replace("w/", "With").replace("w/o", "Without").replace(/\s+/g, '').replace('/', '');
        if (index < 6) {
            parsedData.firstPass[n] = item.d;
        } else if (index < 12) {
            parsedData.secondPass[n] = item.d;
        } else {
            parsedData.quarterStart[n] = item.d;
        }
    });
    return parsedData;
}
