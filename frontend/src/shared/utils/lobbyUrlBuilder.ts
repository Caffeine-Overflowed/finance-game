export const lobbyUrlBuilder = ({ code, relative = false }: { code: string; relative?: boolean }) => {
    if (relative) {
        return `/game/${code}`;
    }

    return `${process.env.NEXT_PUBLIC_URL}/game/${code}`;
};
