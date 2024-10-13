import { Box } from "lucide-react";

export default function TableEmpty() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-10">
      <Box className="h-20 w-20 text-muted" />
      <div className="space-y-2 text-center">
        <h3 className="text-2xl font-semibold">No data to display</h3>
        <p className="text-muted-foreground">
          The table is currently empty. Add some data to get started.
        </p>
      </div>
    </div>
  );
}
