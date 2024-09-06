import { UseQueryResult, queryOptions, useQuery } from "@tanstack/react-query";

import { User } from "./model";
import { HttpUserService } from "./service";

const userService = new HttpUserService();

export function useGetUsersOptions(enabled = true) {
  return queryOptions({
    queryKey: ["users"],
    queryFn: userService.getUsers,
    enabled,
  });
}

export function useGetUsers(enabled?: boolean): UseQueryResult<User[], Error> {
  return useQuery(useGetUsersOptions(enabled));
}
