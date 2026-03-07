import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export type User = {
    userId: string;
    name: string;
};

const getName = (user: User) => {
    if (user.name) {
        return user.name;
    }

    if (user.userId && user.userId.indexOf('\\') > 0) {
        return user.userId.split('\\')[1].split('@')[0];
    }

    return user.userId;
};

const makeFallback = (user: User) => {

    const getNameParts = () => {
        if (user.name) {
            return user.name.split(' ');
        }

        return getName(user).split('\\')[1].split('@')[0].split(/[\.,-_]/g);
    };

    return getNameParts().map(x => x.charAt(0).toUpperCase()).join();
};

export const UserAvatar = ({ user }: { user: User | undefined | null; }) => (
    <>{user && (<div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:size-5
            *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
        <Avatar className="size-6 text-back">
            <AvatarFallback>{makeFallback(user)}</AvatarFallback>
        </Avatar>
    </div>)
    }</>
);

export const UserName = ({ user }: { user: User | undefined | null; }) => (
    user ? <span>{getName(user)}</span> : <></>
);