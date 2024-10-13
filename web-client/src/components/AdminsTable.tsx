import { Admin } from "@/api/admins/model";
import dayjs from "dayjs";

import TableEmpty from "./TableEmpty";
import TableNoResults from "./TableNoResults";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface AdminsTableProps {
  admins: Admin[];
  // Are the results shown filtered? Used to determine empty vs. no results state
  isFiltered: boolean;
}

export default function AdminsTable({ admins, isFiltered }: AdminsTableProps) {
  return (
    <Table className="h-fit w-full">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>First Name</TableHead>
          <TableHead>Last Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Username</TableHead>
          <TableHead>Joined</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {admins.length > 0 ? (
          admins.map((admin) => (
            <TableRow key={admin.id}>
              <TableCell className="font-medium">{admin.id}</TableCell>
              <TableCell>{admin.firstname}</TableCell>
              <TableCell>{admin.lastname}</TableCell>
              <TableCell>{admin.email}</TableCell>
              <TableCell>{admin.username}</TableCell>
              <TableCell>
                {admin.createdAt
                  ? dayjs(admin.createdAt).format("MM/DD/YYYY")
                  : "Unknown"}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6}>
              {isFiltered ? <TableNoResults /> : <TableEmpty />}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
