import { EC2Client } from "@aws-sdk/client-ec2";
import { fromEnv } from "@aws-sdk/credential-provider-env";


const config={
  region: String(process.env.NEXT_PUBLIC_AWS_REGION),
    credentials: {
      accessKeyId: String(process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID),
      secretAccessKey:String(process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY),
    }}

// export const REGION = "us-east-1";
export const client = new EC2Client(config);
