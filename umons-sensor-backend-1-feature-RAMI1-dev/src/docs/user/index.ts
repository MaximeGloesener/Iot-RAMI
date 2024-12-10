import { login } from "./login";
import { signup } from "./signup";
import { updateRole } from "./updateRole";
import { verifyAdminPanel } from "@/docs/user/verifyAdminPanel";
import { getAll } from "@/docs/user/getAll";

const paths = {
  "/login": {
    ...login,
  },
  "/signup": {
    ...signup,
  },
  "/update/role": {
    ...updateRole,
  },
  "/verify/adminPanel": {
    ...verifyAdminPanel,
  },
  "/all": {
    ...getAll,
  },
};

export { paths as userPaths };
