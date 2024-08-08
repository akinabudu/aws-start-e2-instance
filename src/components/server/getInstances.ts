'use server'
import { client } from "@/lib/client";
import { DescribeInstancesCommand } from "@aws-sdk/client-ec2";

export const getInstances = async (instanceId: string) => {
  const input = {
    InstanceIds: [instanceId],
  };
  const command = new DescribeInstancesCommand(input);

  try {
    const { Reservations } = await client.send(command);
    if (Reservations && Reservations[0] && Reservations[0].Instances && Reservations[0].Instances[0]) {
      const ipAddress = Reservations[0].Instances[0].PublicIpAddress;
      return ipAddress;
    } else {
      console.error("Instances not found");
      return null;
    }
  } catch (err) {
    console.error(err);
    return null;
  }
};