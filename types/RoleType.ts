interface Role {
  name: string;
  pivot: {
    model_type: string;
    model_id: number;
    role_id: number;
  };
}
