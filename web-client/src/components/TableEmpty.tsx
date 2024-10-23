import { Box } from "lucide-react";

interface TableEmptyProps {
  message?: string;
  subheader?: string;
}

export default function TableEmpty({
  message = "No data to display",
  subheader = "The table is currently empty. Add some data to get started.",
}: TableEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-10">
      <Box className="h-20 w-20 text-muted" />
      <div className="space-y-2 text-center">
        <h3 className="text-2xl font-semibold">{message}</h3>
        <p className="text-muted-foreground">{subheader}</p>
      </div>
    </div>
  );
}
