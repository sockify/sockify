import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction } from "lucide-react";

interface UnderConstructionProps {
  pageName: string;
}

export default function UnderConstruction({
  pageName,
}: UnderConstructionProps) {
  return (
    <div className="absolute inset-0 flex h-screen w-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-center text-center text-3xl font-bold">
            <code className="mr-1 rounded bg-gray-200/75 px-1 py-0.5 font-mono">
              {pageName}
            </code>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-4 text-center">
            <p className="text-muted-foreground">
              We're working hard to bring you something amazing. This page is
              currently under construction and will be available soon.
            </p>
            <div className="flex justify-center">
              <div className="flex h-24 w-24 animate-pulse items-center justify-center rounded-full bg-primary/10">
                <Construction className="h-12 w-12 text-primary" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Thank you for your patience as we weave this page into existence!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
