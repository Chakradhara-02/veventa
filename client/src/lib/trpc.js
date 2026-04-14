import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import superjson from 'superjson';

export const trpc = createTRPCReact();

export function createTRPCClient() {
	const apiBaseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
	const trpcUrl = apiBaseUrl ? `${apiBaseUrl}/api/trpc` : '/api/trpc';

	return trpc.createClient({
		links: [
			httpBatchLink({
				url: trpcUrl,
				transformer: superjson,
				headers() {
					const token = localStorage.getItem('authToken');
					return token ? { Authorization: `Bearer ${token}` } : {};
				},
			}),
		],
	});
}
