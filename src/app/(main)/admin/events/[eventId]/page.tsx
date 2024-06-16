import { useRouter } from "next/navigation";

export default function EventDetails({
  params,
}: {
  params: { eventId: string };
}) {
  return <h1>Event ID: {params.eventId}</h1>;
}
