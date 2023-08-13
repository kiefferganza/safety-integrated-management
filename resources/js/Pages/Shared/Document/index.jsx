import { Suspense, lazy } from 'react';
import Container from "@mui/material/Container"
import SimpleLayout from "@/Layouts/simple/SimpleLayout"
import LoadingScreen from '@/Components/loading-screen/LoadingScreen';
import { Head } from '@inertiajs/inertia-react';
const DocumentPage = lazy(() => import("./DocumentPage"));

const index = ({ document, positions, customUser, sharedLink, rolloutDate }) => {
	return (
		<>
			<Head><title>{document.form_number}</title></Head>
			<Suspense fallback={<LoadingScreen />}>
				<SimpleLayout>
					<Container
						sx={{
							pt: 15,
							pb: 10,
							minHeight: 1,
						}}
					>
						<DocumentPage sharedLink={sharedLink} document={document} positions={positions} customUser={customUser} rolloutDate={rolloutDate} />
					</Container>
				</SimpleLayout>
			</Suspense>
		</>
	)
}

export default index
