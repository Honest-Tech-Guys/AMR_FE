"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation"; // ← Correct import
import { useAuthStore } from "./stores/authStore";

const withRole = (WrappedComponent: any, allowedRoles: string[]) => {
  return (props: any) => {
    const router = useRouter();
    const { user_role } = useAuthStore();

    useEffect(() => {
      if (user_role && !allowedRoles.includes(user_role)) {
        router.push("/403"); // Redirect if not authorized
      }
    }, [user_role, allowedRoles, router]);

    if (!user_role) return <div>Loading...</div>;
    return <WrappedComponent {...props} />;
  };
};

export default withRole;
