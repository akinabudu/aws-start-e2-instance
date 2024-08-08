import { EC2Client } from "@aws-sdk/client-ec2";

const config={
  region: String(process.env.NEXT_PUBLIC_AWS_REGION),
    credentials: {
      accessKeyId: String(process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID),
      secretAccessKey:String(process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY),
    }}

export const client = new EC2Client(config);

export const securityGroup = String(process.env.NEXT_PUBLIC_AWS_SECURITY_GROUP)
export const keyPair = String(process.env.NEXT_PUBLIC_AWS_KEY_PAIR)


