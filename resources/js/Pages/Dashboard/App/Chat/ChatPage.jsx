// sections
import { Head } from '@inertiajs/inertia-react';
import { Chat } from '@/sections/@dashboard/chat';

// ----------------------------------------------------------------------

export default function ChatPage () {
	return (
		<>
			<Head>
				<title> Chat</title>
			</Head>

			<Chat />
		</>
	);
}
