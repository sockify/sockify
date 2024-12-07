import { Info } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

export default function DemoDisclaimerBanner() {
  return (
    <Alert variant="destructive" className="mx-auto px-6 py-4">
      <Info className="h-4 w-4" />
      <AlertTitle className="font-semibold">Demo website</AlertTitle>
      <AlertDescription className="text-sm">
        This website is part of our Capstone 2 project and is for demonstration
        purposes only. Any orders placed will not be processed or fulfilled.
        Check out the project on{" "}
        <a
          href="http://github.com/sockify/sockify"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          GitHub
        </a>
        !
      </AlertDescription>
    </Alert>
  );
}
