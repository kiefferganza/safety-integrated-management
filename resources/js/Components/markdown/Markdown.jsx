import PropTypes from 'prop-types';
import '@/utils/highlight';
import ReactMarkdown from 'react-markdown';
// markdown plugins
import rehypeRaw from 'rehype-raw';
// @mui
import { Link, Typography, Divider } from '@mui/material';
//
import Image from '../image';
//
import StyledMarkdown from './styles';

// ----------------------------------------------------------------------

Markdown.propTypes = {
	sx: PropTypes.object,
};

export default function Markdown ({ sx, ...other }) {
	return (
		<StyledMarkdown sx={sx}>
			<ReactMarkdown rehypePlugins={[rehypeRaw]} components={components} {...other} />
		</StyledMarkdown>
	);
}

// ----------------------------------------------------------------------

const components = {
	h1: ({ ...props }) => <Typography variant="h1" {...props} />,
	h2: ({ ...props }) => <Typography variant="h2" {...props} />,
	h3: ({ ...props }) => <Typography variant="h3" {...props} />,
	h4: ({ ...props }) => <Typography variant="h4" {...props} />,
	h5: ({ ...props }) => <Typography variant="h5" {...props} />,
	h6: ({ ...props }) => <Typography variant="h6" {...props} />,
	hr: ({ ...props }) => <Divider sx={{ my: 3 }} {...props} />,
	img: ({ ...props }) => <Image alt={props.alt} ratio="16/9" sx={{ borderRadius: 2, my: 5 }} {...props} />,
	a: ({ ...props }) =>
		props.href.includes('http') ? <Link target="_blank" rel="noopener" {...props} /> : <Link {...props} />,
};
