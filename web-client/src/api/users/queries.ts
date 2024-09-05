import { queryOptions, useQuery, UseQueryResult } from "@tanstack/react-query";
import { HttpUserService } from "./service";
import { User } from "./model";

const userService = new HttpUserService();

export function useGetUsersOptions(enabled = true) {
  return queryOptions({
    queryKey: ["users"],
    queryFn: userService.getUsers,
    enabled
  });
}

export function useGetUsers(enabled?: boolean): UseQueryResult<User[], Error> {
  return useQuery(useGetUsersOptions(enabled));
}
