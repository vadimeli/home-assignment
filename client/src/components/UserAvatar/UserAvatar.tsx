import { Avatar, AvatarProps } from "@mui/material";
import { UserData } from "../../types";
import { forwardRef } from "react";

type UserAvatarProps = AvatarProps & {
    user: UserData;
};

export const UserAvatar = forwardRef<HTMLDivElement, UserAvatarProps>(
    ({ user, ...props }, ref) => {
        const initials = user.name.split(" ").map((n)=>n[0]).join(" ");
        return <>
            {
                user?.avatar ? <Avatar alt={user.name} src={user.avatar} ref={ref} {...props} />
                    : <Avatar children={initials} />
            }
        </>;
    }
);
