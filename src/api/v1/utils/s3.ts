import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import config from "../../../config";
import {HeadBucketCommand, PutObjectCommand} from "@aws-sdk/client-s3";
import httpStatusCodes from "../errors/httpStatusCodes";
import crypto from 'crypto'
import {promisify} from "util"

const randomBytes = promisify(crypto.randomBytes)

async function bucketExists(bucketName: string) {
    const params = {
        Bucket: bucketName
    };
    try {
        await config.s3Bucket.send(new HeadBucketCommand(params));
        return true;
    } catch (error: any) {
        if (error["$metadata"].httpStatusCode === httpStatusCodes.NOT_FOUND) {
            return false;
        }
        throw error;
    }
}

async function enablePublicAccess(bucketName: string) {
    const policy = {
        "Version": "2012-10-17",
        "Id": "bucket_policy",
        "Statement": [
            {
                "Sid": "public_read_write_delete_objects",
                "Effect": "Allow",
                "Principal": "*",
                "Action": [
                    "s3:GetObject",
                    "s3:PutObject",
                    "s3:DeleteObject"
                ],
                "Resource": [`arn:aws:s3:::${bucketName}/*`]
            }
        ]
    }

    const CORSConfiguration = {
        "CORSRules": [
            {
                "AllowedHeaders": [
                    "*"
                ],
                "AllowedMethods": [
                    "GET",
                    "PUT",
                    "POST",
                    "DELETE",
                    "HEAD"
                ],
                "AllowedOrigins": [
                    "*"
                ],
                "ExposeHeaders": [
                    "ETag"
                ],
                "MaxAgeSeconds": 36000
            }
        ]
    }

    // put public access block first
    try {
        await config.s3Bucket.putPublicAccessBlock({
            Bucket: bucketName,
            PublicAccessBlockConfiguration: {
                BlockPublicAcls: false,
                IgnorePublicAcls: false,
                BlockPublicPolicy: false,
                RestrictPublicBuckets: false
            }
        })
        console.log(`Bucket ${bucketName} public access enabled.`);
    } catch (error: any) {
        console.log(error);
        throw error;
    }


    try {
        await config.s3Bucket.putBucketPolicy({
            Bucket: bucketName,
            Policy: JSON.stringify(policy)
        })
        console.log(`Bucket ${bucketName} policy enabled.`);
    } catch (error: any) {
        console.log(error);
        throw error;
    }

    try {
        await config.s3Bucket.putBucketCors({
            Bucket: bucketName,
            CORSConfiguration: CORSConfiguration
        })
        console.log(`Bucket ${bucketName} CORS enabled.`);

    } catch (error: any) {
        console.log(error);
        throw error;
    }
}

async function createBucket(bucketName: string) {
    if (config.s3Bucket) {
        try {
            await config.s3Bucket.createBucket({
                Bucket: bucketName,
                CreateBucketConfiguration: {
                    LocationConstraint: "ap-southeast-1"
                }
            })
            await enablePublicAccess(bucketName);
            console.log(`Bucket ${bucketName} created.`);
        } catch (err) {
            console.log(`Error creating bucket ${bucketName}.`);
            console.log(err);
        }
    }
}


async function generateUploadURL(bucketName: string, fileName: string) {
    try {
        if (!await bucketExists(bucketName)) {
            await createBucket(bucketName);
        }
        const key = `${fileName}`;
        const params = {
            Bucket: bucketName,
            Key: key,
        }
        console.log(bucketName);
        const command = await getSignedUrl(config.s3Bucket, new PutObjectCommand(params), {expiresIn: 60 * 60 * 24 * 7});
        return {
            url: command,
            key: key
        }
    } catch (err) {
        console.log(err);
        return {
            url: null,
            key: null
        }
    }
}

async function createFolder(bucketName: string, folderName: string) {
    try {
        const params = {
            Bucket: bucketName,
            Key: folderName + '/',
            Body: ''
        }
        await config.s3Bucket.putObject(params);
        console.log(`Folder ${folderName} created.`);
    } catch (err) {
        console.log(`Error creating folder ${folderName}.`);
        console.log(err);
    }
}


export {createBucket, generateUploadURL}