import { Font, StyleSheet } from '@react-pdf/renderer';

// ----------------------------------------------------------------------

Font.register({
	family: 'Roboto',
	fonts: [{ src: '/fonts/Roboto-Regular.ttf' }, { src: '/fonts/Roboto-Bold.ttf' }],
});

const styles = StyleSheet.create({
	col4: { width: '25%' },
	col3: { width: '33.333%' },
	col8: { width: '75%' },
	col6: { width: '50%' },
	textDefault: { fontSize: 8, paddingVertical: 2, lineHeight: 0 },
	badge: { paddingVertical: 2, paddingHorizontal: 3, borderRadius: 4 },
	mb8: { marginBottom: 8 },
	mb40: { marginBottom: 40 },
	mb16: { marginBottom: 16 },
	mb32: { marginBottom: 32 },
	overline: {
		fontSize: 8,
		marginBottom: 8,
		fontWeight: 700,
		textTransform: 'uppercase',
	},
	h3: { fontSize: 16, fontWeight: 700 },
	h4: { fontSize: 13, fontWeight: 700 },
	h5: { fontSize: 11, fontWeight: 700 },
	body1: { fontSize: 10 },
	subtitle2: { fontSize: 9, fontWeight: 700 },
	alignRight: { textAlign: 'right' },
	underlineText: {
		width: '100%',
		color: '#9e9e9e'
	},
	page: {
		padding: '8px 24px 0 24px',
		fontSize: 9,
		lineHeight: 1.6,
		fontFamily: 'Roboto',
		backgroundColor: '#fff',
		textTransform: 'capitalize',
	},
	footer: {
		left: 0,
		right: 0,
		bottom: 0,
		paddingVertical: 8,
		paddingHorizontal: 40,
		margin: 'auto',
		position: 'absolute'
	},
	gridContainer: { flexDirection: 'row', justifyContent: 'space-between' },
	table: { display: 'flex', width: '100%' },
	tableHeader: {},
	tableBody: {},
	tableRow: {
		padding: '4px 0 2px 0',
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderStyle: 'solid',
	},
	noBorder: { paddingTop: 8, paddingBottom: 0, borderBottomWidth: 0 },
	tableCell_1: { width: '15%' },
	tableCell_2: { width: '50%' },
	tableCell_3: { width: '15%' },
});

export default styles;
