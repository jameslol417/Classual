import s3 from '../../app/lib/s3';

export default async function fetchCSV(req, res) {
    const { course } = req.query;
    console.log(`Fetching from S3: [4]2023Fall/overall/${course}.csv`);
    const params = {
        Bucket: 'classual',
        Key: `[4]2023Fall/overall/${course}.csv`
    };

    try {
        const data = await s3.getObject(params).promise();
        const csv = new TextDecoder('utf-8').decode(data.Body);
        res.send(csv);
    } catch (error) {
        throw error;
    }
}