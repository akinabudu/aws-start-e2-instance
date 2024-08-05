"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import StartEc2 from "./server/startec2";
import AmiDetails from "./server/getImages";

const formSchema = z.object({
  amiId: z.string().min(1, { message: "AMI ID is required" }),
  instanceType: z.enum(["t2.micro", "t2.small", "t2.medium"]),
  volumeSize: z.string().refine(
    (val) => {
      const num = parseInt(val);
      return num >= 8 && num <= 1000;
    },
    { message: "Volume size must be between 8 and 1000 GB" }
  ),
  instanceName: z.string().min(1, { message: "Instance name is required" }),
});

type FormData = z.infer<typeof formSchema>;

const EC2CreationForm: React.FC = () => {
  const [message, setMessage] = React.useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [amiDetails, setAmiDetails] = React.useState<any>(null);

  useEffect(() => {
    async function getData() {
      const details = await AmiDetails();
      setAmiDetails(details);
    }
    getData();
  }, []);

  // Initialize the form with default values and validation rules
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amiId: "",
      instanceType: "t2.micro",
      volumeSize: "8",
      instanceName: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    // await AmiDetails();
    setMessage(null);
    try {
      const result = await StartEc2(data);

      if (result.instanceId) {
        setMessage({
          type: "success",
          text: `EC2 instance created with ID: ${result.instanceId}`,
        });
      } else {
        throw new Error(result.error || "Failed to create EC2 instance");
      }
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Create EC2 Instance</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="amiId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>AMI Name</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select instance type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {amiDetails &&
                        amiDetails.map((ami: any) => (
                          <SelectItem key={ami.ImageId} value={ami.ImageId}>
                            {ami.Name}
                          </SelectItem>
                        ))}
                      {/* <SelectItem value="t2.micro">t2.micro</SelectItem> */}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The instance type defines the hardware of the host computer.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amiId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>AMI ID</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., ami-0c55b159cbfafe1f0"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The ID of the Amazon Machine Image to use for the instance.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="instanceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instance Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select instance type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="t2.micro">t2.micro</SelectItem>
                      <SelectItem value="t2.small">t2.small</SelectItem>
                      <SelectItem value="t2.medium">t2.medium</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The instance type defines the hardware of the host computer.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="volumeSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Volume Size (GB)</FormLabel>
                  <FormControl>
                    <Input type="number" min="8" max="1000" {...field} />
                  </FormControl>
                  <FormDescription>
                    The size of the root volume in gigabytes (8-1000).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="instanceName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instance Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My EC2 Instance" {...field} />
                  </FormControl>
                  <FormDescription>
                    A name to tag your instance with.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Create EC2 Instance
            </Button>
          </form>
        </Form>
        {message && (
          <Alert
            className="mt-4"
            variant={message.type === "success" ? "default" : "destructive"}
          >
            <AlertTitle>
              {message.type === "success" ? "Success" : "Error"}
            </AlertTitle>
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default EC2CreationForm;
