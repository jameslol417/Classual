import s3 from '../../app/lib/s3';
import dirtyJSON from 'dirty-json';

export default async function fetchTimeLine(req, res) {
    const { quarter } = req.query;
    console.log(`Quarter: ${quarter}`);
    console.log(`Fetching from S3: [4]${quarter}/plotconfig.txt`)
    const params = {
        Bucket: 'classual',
        Key: `[4]${quarter}/plotconfig.txt`
    };

    try {
        const data = await s3.getObject(params).promise();
        const textData = new TextDecoder('utf-8').decode(data.Body);
        const jsonData = dirtyJSON.parse(textData);
        res.status(200).json(jsonData);

    } catch (error) {
        console.error("Failed to fetch the time line file from S3:", error);
        res.status(500).send('Failed to fetch the file');
    }
}