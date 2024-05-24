import s3 from '../../app/lib/s3';

export default async function fetchCourses(req, res) {

    const params = {
        Bucket: 'classual',
        Key: '[4]2023Fall/all_courses.txt'
    };

    try {
        const data = await s3.getObject(params).promise();
        const textData = new TextDecoder('utf-8').decode(data.Body);
        res.status(200).send(textData);
    } catch (error) {
        console.error("Failed to fetch the course name file from S3:", error);
        res.status(500).send('Failed to fetch the file');
    }
}
