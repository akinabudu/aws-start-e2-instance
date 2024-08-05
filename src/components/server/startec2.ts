"use server";
import { client } from "@/lib/client";
import {
  type _InstanceType,
  EC2Client,
  RunInstancesCommand,
  RunInstancesCommandInput,
} from "@aws-sdk/client-ec2";

interface FormData {
  amiId: string;
  instanceType: _InstanceType;
  volumeSize: string;
  instanceName: string;
}

export default async function StartEc2(data: FormData): Promise<any> {
  const { amiId, instanceType, volumeSize, instanceName }: FormData = data;

  const params: RunInstancesCommandInput = {
    ImageId: amiId,
    InstanceType: instanceType,
    MinCount: 1,
    MaxCount: 1,
    BlockDeviceMappings: [
      {
        DeviceName: "/dev/sda1",
        Ebs: {
          VolumeSize: parseInt(volumeSize),
        },
      },
    ],
    TagSpecifications: [
      {
        ResourceType: "instance",
        Tags: [
          {
            Key: "Name",
            Value: instanceName,
          },
        ],
      },
    ],
  };

  try {
    const command = new RunInstancesCommand(params);
    const response = await client.send(command);
    if (response.Instances && response.Instances[0].InstanceId) {
      return { instanceId: response.Instances[0].InstanceId };
    } else {
      throw new Error("Failed to create EC2 instance");
    }
  } catch (error) {
    console.error("Error creating EC2 instance:", error);
    return {
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
