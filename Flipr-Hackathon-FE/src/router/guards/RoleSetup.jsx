// src/router/guards/RoleSetup.jsx
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";

export const RoleSetup = () => {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      const role = user.unsafeMetadata?.role;
      if (!role) {
        user.update({
          unsafeMetadata: {
            role: "user", // default role
          },
        });
      }
    }
  }, [isLoaded, user]);

  return null; // This component doesn't render anything
};
