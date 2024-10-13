import { useGetAdmins } from "@/api/admins/queries";
import AdminProfile, { AdminProfileSkeleton } from "@/components/AdminProfile";
import AdminsTable from "@/components/AdminsTable";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useAuth } from "@/context/AuthContext";
import { AlertTriangle, RefreshCcw, Search } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

// Maximum numbers of results per page of the admins table
const ADMIN_RESULTS_LIMIT = 10;

export default function AdminProfilePage() {
  const { admin } = useAuth();

  const [page, setPage] = useState(1);
  const adminsQuery = useGetAdmins(
    ADMIN_RESULTS_LIMIT,
    (page - 1) * ADMIN_RESULTS_LIMIT,
  );
  const totalPages = Math.ceil(
    (adminsQuery.data?.total ?? 0) / ADMIN_RESULTS_LIMIT,
  );

  const renderPaginationButtons = () => {
    const buttons: JSX.Element[] = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <PaginationItem key={i}>
          <PaginationLink isActive={i === page} onClick={() => setPage(i)}>
            {i}
          </PaginationLink>
        </PaginationItem>,
      );
    }
    return buttons;
  };

  return (
    <section className="space-y-6 px-4 py-6 md:px-8">
      {admin ? <AdminProfile data={admin} /> : <AdminProfileSkeleton />}

      <Card>
        <CardHeader>
          <CardTitle>Sockster directory</CardTitle>
          <CardDescription>
            Find and connect with fellow Socksters from the company
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="mb-6 flex justify-between">
            <div className="relative w-full sm:w-1/3">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="John doe..."
                className="pl-8"
                disabled={true} // TODO: add the filtering mechanism server side
                //   value={searchTerm}
                //   onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Button
              size="icon"
              variant="ghost"
              className="text-muted-foreground"
              onClick={async () => {
                await adminsQuery.refetch();
                toast.success("Refetched Socksters directory");
              }}
            >
              <RefreshCcw />
            </Button>
          </div>

          {adminsQuery.isLoading ? (
            <div className="mt-auto flex items-center justify-center py-10 text-primary">
              <LoadingSpinner size={48} />
            </div>
          ) : adminsQuery.isError ? (
            <div className="flex flex-col items-center justify-center py-10 text-destructive">
              <AlertTriangle className="mb-2 h-6 w-6" />
              <p>Failed to load Sockster directory. Please try again later.</p>
            </div>
          ) : (
            adminsQuery?.data?.items && (
              // TODO: adjust isFiltered when the search bar is not empty
              <AdminsTable admins={adminsQuery.data.items} isFiltered={false} />
            )
          )}
        </CardContent>

        <CardFooter className="flex items-center justify-center">
          {totalPages >= 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  />
                </PaginationItem>

                {renderPaginationButtons()}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setPage((prev) => Math.min(prev + 1, totalPages))
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </CardFooter>
      </Card>
    </section>
  );
}
