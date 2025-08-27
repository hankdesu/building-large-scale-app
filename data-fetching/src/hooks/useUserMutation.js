import { useMutation } from '@tanstack/react-query';
import { insertUser } from '../apis/users';

export default function useUserMutation() {
    return useMutation({
        mutationFn: insertUser
    })
}
