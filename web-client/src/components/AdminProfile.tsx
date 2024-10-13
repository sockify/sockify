import { Admin } from "@/api/admins/model";
import dayjs from "dayjs";
import { AtSign, Calendar, Mail, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

interface AdminProfileProps {
  data: Admin;
}

export default function AdminProfile({ data }: AdminProfileProps) {
  return (
    <Card className="mx-auto overflow-hidden">
      <section className="relative h-32 bg-primary">
        <div className="absolute -bottom-16 left-6">
          <Avatar className="h-32 w-32 border-4 border-background">
            <AvatarImage
              src={undefined} // TODO: add avatar admin table
              alt={`${data.firstname} ${data.lastname}`}
            />
            <AvatarFallback>
              <strong>
                {data.firstname[0]}
                {data.lastname[0]}
              </strong>
            </AvatarFallback>
          </Avatar>
        </div>
      </section>

      <CardHeader className="pt-20">
        <CardTitle className="text-2xl">
          {data.firstname} {data.lastname}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <dt className="font-medium text-muted-foreground">Name:</dt>
            <dd>{`${data.firstname} ${data.lastname}`}</dd>
          </div>
          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <dt className="font-medium text-muted-foreground">Email:</dt>
            <dd>{data.email}</dd>
          </div>
          <div className="flex items-center space-x-2">
            <AtSign className="h-4 w-4 text-muted-foreground" />
            <dt className="font-medium text-muted-foreground">Username:</dt>
            <dd>{data.username}</dd>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <dt className="font-medium text-muted-foreground">Joined:</dt>
            <dd>
              {data.createdAt
                ? dayjs(data.createdAt).format("MM/DD/YYYY")
                : "Unknown"}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}

export function AdminProfileSkeleton() {
  return (
    <Card className="mx-auto overflow-hidden">
      <section className="relative h-32 bg-muted">
        <div className="absolute -bottom-16 left-6">
          <Avatar className="h-32 w-32 border-4 border-background">
            <Skeleton className="h-full w-full rounded-full" />
          </Avatar>
        </div>
      </section>

      <CardHeader className="pt-20">
        <Skeleton className="h-6 w-32" />
      </CardHeader>

      <CardContent>
        <Skeleton className="mb-2 h-4 w-48" />
        <Skeleton className="mb-2 h-4 w-40" />
        <Skeleton className="h-4 w-36" />
      </CardContent>
    </Card>
  );
}
