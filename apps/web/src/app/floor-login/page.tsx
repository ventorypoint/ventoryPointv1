import { getFloorWorkerSession } from "./actions";
import { FloorTerminalClient } from "./floor-terminal-client";

export const metadata = {
  title: "Floor Worker Terminal | VentoryPoint",
  description: "Fast-auth badge & PIN terminal for warehouse floor workers.",
};

export default async function FloorLoginPage() {
  const session = await getFloorWorkerSession();

  return <FloorTerminalClient initialSession={session} />;
}
