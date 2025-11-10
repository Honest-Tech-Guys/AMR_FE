import { toast } from "sonner";

const ErrorToastHandel = (error: any) => {
  return toast.error(
    error && (
      <div className=" text-red-600 rounded-md px-2">
        {(error as any)?.response &&
          Object.values((error as any).response?.data?.errors)
            .flat()
            .map((err: any, index: number) => {
              console.log(err);
              return <div key={index}>{err}</div>;
            })}
        {(error as any).response?.data?.message}
        {/* {(error as any)?.message} */}
      </div>
    )
  );
};

export default ErrorToastHandel;
