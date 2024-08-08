'use server'
import { client } from "@/lib/client";
import { DescribeImagesCommand } from "@aws-sdk/client-ec2";

const AmiDetails = async () => {
  const command = new DescribeImagesCommand({ Owners: ["self"] });

    try {
      const data = await client.send(command);
      if (data.Images) {
        return data.Images;
      }
    } catch (err) {
      console.log(err);
      return err;
    }
};

export default AmiDetails;
