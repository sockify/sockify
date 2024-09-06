import axios from "axios";

import { Admin, adminsSchema } from "./model";

export interface AdminService {
  getAdmins(): Promise<Admin[]>;
}

export class HttpAdminService implements AdminService {
  async getAdmins(): Promise<Admin[]> {
    const { data } = await axios.get("/api/v1/admins");
    return adminsSchema.parse(data);
  }
}
