import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";
import { Property } from "@/types/PropertyType";

// Update agreement by tenancyId + agreementId
const useUpdateAgreement = (tenancyId: number, agreementId: number) => {
  return useMutation({
    mutationKey: ["useUpdateAgreement", tenancyId, agreementId],
    mutationFn: async (data: object) => {
      const res = await axiosInstance.put<Property>(
        `/tenancies/${tenancyId}/agreements/${agreementId}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res.data;
    },
    onError: (error) => {
      console.error("Update agreement error:", error);
    },
  });
};

export default useUpdateAgreement;
