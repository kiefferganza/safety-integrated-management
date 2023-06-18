import PropTypes from 'prop-types';
//
import Image from '../../image';

// ----------------------------------------------------------------------

CoverPreview.propTypes = {
	file: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default function CoverPreview ({ file, sx = {} }) {
	if (!file) {
		return null;
	}

	const imgUrl = typeof file === 'string' ? file : file.preview;

	return (
		<Image
			alt="cover"
			src={imgUrl}
			sx={{
				zIndex: 8,
				overflow: 'hidden',
				position: 'absolute',
				width: '100%',
				height: '100%',
				...sx
			}}
		/>
	);
}
