import { Order } from "@/api/orders/model";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

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

interface OrdersTableProps {
  data: Order[];
  // Are the results shown filtered? Used to determine empty vs. no results state
  isFiltered: boolean;
}

export default function OrdersTable({ data, isFiltered }: OrdersTableProps) {
  const navigate = useNavigate();
  return (
    <Table className="h-fit w-full">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>Invoice #</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Total</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.length > 0 ? (
          data.map((order) => (
            <TableRow
              key={order.orderId}
              onClick={() => navigate(`/admin/orders/${order.orderId}`)}
              className="hover:cursor-pointer"
            >
              <TableCell className="font-medium">{order.orderId}</TableCell>
              <TableCell>{order.invoiceNumber}</TableCell>
              <TableCell>{`${order.contact.firstname} ${order.contact.lastname}`}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>
                {order.createdAt
                  ? dayjs(order.createdAt).format("MM/DD/YYYY")
                  : "Unknown"}
              </TableCell>
              <TableCell>${order.total}</TableCell>
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
