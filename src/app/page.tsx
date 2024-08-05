import EC2CreationForm from "@/components/Ec2CreationForm";
import Image from "next/image";

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create EC2 Instance</h1>
      <EC2CreationForm />
    </main>
  );
}
