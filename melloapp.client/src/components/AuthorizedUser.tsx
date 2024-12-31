// src/components/AuthorizedUser.tsx

import { useContext } from 'react';
import { UserContext } from './AuthorizeView';

interface AuthorizedUserProps {
    value: 'email' | 'role';
}

export function AuthorizedUser({ value }: AuthorizedUserProps) {
    const user = useContext(UserContext);

    if (!user) {
        return null; // Or display a fallback UI like a loader or placeholder
    }

    switch (value) {
        case 'email':
            return <span>{user.email}</span>;
        case 'role':
            return <span>{user.role}</span>;
        default:
            return null;
    }
}
