import s3 from '../../app/lib/s3';

export default async function fetchCSV(req, res) {
    const { course, quarter } = req.query;

    if (!course || !quarter) {
        return res.status(400).send('Course and quarter are required.');
    }

    console.log(`Fetching from S3: ${quarter}/overall/${course}.csv`);
    const params = {
        Bucket: 'classual',
        Key: `${quarter}/overall/${course}.csv`
    };

    try {
        const data = await s3.getObject(params).promise();
        const csv = new TextDecoder('utf-8').decode(data.Body);
        res.send(csv);
    } catch (error) {
        throw error;
    }
}