import dotenv from "dotenv";
import { S3 } from "@aws-sdk/client-s3";

dotenv.config();

const port = process.env.PORT || 3456;
const mongoURL = process.env.DATABASE_URL || "mongodb://localhost:27017";
const postgresURL =
  process.env.POSTGRES_URL ||
  "postgres://postgres:postgres@localhost:5432/postgres";
const frontendURL = process.env.FRONTEND_URL || "http://localhost:3001";
const mlURL = process.env.ML_URL || "http://localhost:3333";
const gcpCredentials =
  process.env.GCP_CREDENTIALS || "service-account-gcs.json";
const accessTokenRequest = process.env.ACCESS_TOKEN_SECRET || "minhdeptrai";
const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID || "";
const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || "";
const awsRegion = process.env.AWS_DEFAULT_REGION || "ap-southeast-1";
const s3Bucket = new S3({
  region: awsRegion,
  credentials: {
    accessKeyId: awsAccessKeyId,
    secretAccessKey: awsSecretAccessKey,
  },
});
const config = {
  port,
  mongoURL,
  postgresURL,
  frontendURL,
  mlURL,
  gcpCredentials,
  accessTokenRequest,
  s3Bucket,
};
export default config;
