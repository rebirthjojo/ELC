import { S3Client } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
    region: "ap-northeast-2", 
    credentials: {
        accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
        secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
    },
});

export const BUCKET_NAME = "elc-project-frontend";