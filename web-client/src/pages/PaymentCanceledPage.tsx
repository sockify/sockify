import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, ArrowLeft, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function PaymentCanceledPage() {
  return (
    <div className="mt-10 flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-12 w-12 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Payment cancelled
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            We're sorry, but your payment was not successful. This could be due
            to insufficient funds, an expired card, or other issues with your
            payment method.
          </p>
          <div className="rounded-lg bg-muted p-4">
            <h3 className="mb-2 font-semibold">What you can do next:</h3>
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              <li>Check your payment details and try again</li>
              <li>Use a different payment method</li>
              <li>Contact your bank if the issue persists</li>
              <li>Reach out to our support team for assistance</li>
            </ul>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2">
          <Button className="w-full" asChild>
            <Link to="/support">
              <MessageCircle className="mr-2 h-4 w-4" /> Contact support
            </Link>
          </Button>
          <Button variant="ghost" className="w-full" asChild>
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Return to home
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
