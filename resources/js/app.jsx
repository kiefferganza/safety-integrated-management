import '../css/app.css';
// i18n
import './locales/i18n';

// scroll bar
import 'simplebar/src/simplebar.css';

// lightbox
import 'react-18-image-lightbox/style.css';

// map
import './utils/mapboxgl';
import 'mapbox-gl/dist/mapbox-gl.css';

// editor
import 'react-quill/dist/quill.snow.css';

// slick-carousel
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// lazy image
import 'react-lazy-load-image-component/src/effects/blur.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/inertia-react';
// import { InertiaProgress } from '@inertiajs/progress';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

// ----------------------------------------------------------------------
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
// @mui
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
// redux
import { store, persistor } from './redux/store';
// components
import { StyledChart } from './Components/chart';
import SnackbarProvider from './Components/snackbar';
import { SettingsProvider, ThemeSettings } from './Components/settings';
import { MotionLazyContainer } from './Components/animate';

// theme
import ThemeProvider from './theme';
// locales
import ThemeLocalization from './locales';

// React Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Inertia } from '@inertiajs/inertia';

const appName = window.document.getElementsByTagName('title')[0]?.innerText || 'Laravel';

// InertiaProgress.init({
// 	showSpinner: true,
// 	includeCSS: true,
// });
const userTimezoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;

Inertia.on('before', (event) => {
	event.detail.visit.headers['X-User-Timezone'] = userTimezoneName;
})

createInertiaApp({
	title: (title) => `${title} - ${appName}`,
	resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
	setup ({ el, App, props }) {
		const root = createRoot(el);
		const queryClient = new QueryClient();

		root.render(
			<QueryClientProvider client={queryClient}>
				<ReduxProvider store={store}>
					<PersistGate loading={null} persistor={persistor}>
						<LocalizationProvider dateAdapter={AdapterDateFns}>
							<SettingsProvider>
								<MotionLazyContainer>
									<ThemeProvider>
										<ThemeSettings>
											<ThemeLocalization>
												<SnackbarProvider>
													<StyledChart />
													<App {...props} />
												</SnackbarProvider>
											</ThemeLocalization>
										</ThemeSettings>
									</ThemeProvider>
								</MotionLazyContainer>
							</SettingsProvider>
						</LocalizationProvider>
					</PersistGate>
				</ReduxProvider>
			</QueryClientProvider>
		);
	},
});
