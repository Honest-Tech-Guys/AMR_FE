type Permission = {
  id: number;
  name: string;
  value: boolean;
};

type ModulePermissions = {
  module: string;
  permissions: Permission[];
};
export default interface Role {
  name: string;
  id: number;
  permissions: ModulePermissions[];
}
