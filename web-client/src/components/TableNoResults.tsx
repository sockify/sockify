import { Box } from "lucide-react";

export default function TableNoResults() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-10">
      <Box className="h-20 w-20 text-muted" />
      <div className="space-y-2 text-center">
        <h3 className="text-2xl font-semibold">No results found</h3>
        <p className="text-muted-foreground">
          We couldn't find any matching results. Try adjusting your search or
          filter criteria.
        </p>
      </div>
    </div>
  );
}
