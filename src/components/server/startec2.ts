"use server";
import { client, keyPair, securityGroup } from "@/lib/client";
import {
  type _InstanceType,
  RunInstancesCommand,
  RunInstancesCommandInput,
} from "@aws-sdk/client-ec2";

interface FormData {
  amiId: string;
  instanceType: _InstanceType;
  // volumeSize: string;
  instanceName: string;
}

export default async function StartEc2(data: FormData): Promise<any> {
  const { amiId, instanceType,  }: FormData = data;

  const params: RunInstancesCommandInput = {
    KeyName: keyPair,
    SecurityGroupIds: [securityGroup],
    ImageId: amiId,
    InstanceType: instanceType,
    MinCount: 1,
    MaxCount: 1,
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
