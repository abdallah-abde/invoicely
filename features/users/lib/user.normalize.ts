import { UserPrismaPayload } from "@/features/users/user.types";
import { UserProps } from "../hooks/use-users";

export function mapUsersToDTO(users: UserPrismaPayload[]): UserProps[] {
  const result = users.map((user) => {
    return mapSingleUserToDTO(user);
  });

  return result;
}

export function mapSingleUserToDTO(user: UserPrismaPayload): UserProps {
  return {
    id: user.id,
    name: user.name ?? "",
    email: user.email,
    image: user.image ?? "",
    role: user.role ?? "",
    emailVerified: user.emailVerified ?? false,
    hasDeletePermission: false,
  };
}
