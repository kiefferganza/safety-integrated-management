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
import { InertiaProgress } from '@inertiajs/progress';
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
import { SettingsProvider } from './Components/settings';
import { StyledChart } from './Components/chart';
import SnackbarProvider from './Components/snackbar';
import { ThemeSettings } from './Components/settings';
import { MotionLazyContainer } from './Components/animate';

// theme
import ThemeProvider from './theme';
// locales
import ThemeLocalization from './locales';

const appName = window.document.getElementsByTagName('title')[0]?.innerText || 'Laravel';

InertiaProgress.init({
	showSpinner: true,
	includeCSS: true,
});

createInertiaApp({
	title: (title) => `${title} - ${appName}`,
	resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
	setup ({ el, App, props }) {
		const root = createRoot(el);

		root.render(
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
		);
	},
});

InertiaProgress.init({ color: '#4B5563' });
