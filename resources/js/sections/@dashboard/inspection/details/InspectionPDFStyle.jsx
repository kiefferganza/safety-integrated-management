import { Font, StyleSheet } from '@react-pdf/renderer';

// ----------------------------------------------------------------------

Font.register({
	family: 'Roboto',
	fonts: [{ src: '/fonts/Roboto-Regular.ttf' }, { src: '/fonts/Roboto-Bold.ttf' }],
});

const spacing = {
	m8: { marginLeft: 8, marginRight: 8, marginTop: 8, marginBottom: 8 },
	m16: { marginLeft: 16, marginRight: 16, marginTop: 16, marginBottom: 16 },
	m40: { marginLeft: 40, marginRight: 40, marginTop: 40, marginBottom: 40 },

	p8: { paddingLeft: 8, paddingRight: 8, paddingTop: 8, paddingBottom: 8 },
	p16: { paddingLeft: 16, paddingRight: 16, paddingTop: 16, paddingBottom: 16 },
	p40: { paddingLeft: 40, paddingRight: 40, paddingTop: 40, paddingBottom: 40 },

	mt8: { marginTop: 8 },
	mt16: { marginTop: 16 },
	mt40: { marginTop: 40 },
	mb8: { marginBottom: 8 },
	mb16: { marginBottom: 16 },
	mb40: { marginBottom: 40 },
	ml8: { marginLeft: 8 },
	ml16: { marginLeft: 16 },
	ml40: { marginLeft: 40 },
	mr8: { marginRight: 8 },
	mr16: { marginRight: 16 },
	mr40: { marginRight: 40 },

	pt8: { paddingTop: 8 },
	pt16: { paddingTop: 16 },
	pt40: { paddingTop: 40 },
	pb8: { paddingBottom: 8 },
	pb16: { paddingBottom: 16 },
	pb40: { paddingBottom: 40 },
	pl8: { paddingLeft: 8 },
	pl16: { paddingLeft: 16 },
	pl40: { paddingLeft: 40 },
	pr8: { paddingRight: 8 },
	pr16: { paddingRight: 16 },
	pr40: { paddingRight: 40 }
};

const colors = {
	gray: "#d9d9d9",
	success: "#385623",
	warning: "#ffc000",
	error: "#c00000",
	mute: "#edeff1",
	offPrimary: "#d9e2f3"
};

const colorStyles = {
	textWhite: { color: '#fff' },
	textSuccess: { color: colors.success },
	textGray: { color: colors.gray },
	textWarning: { color: colors.warning },
	textError: { color: colors.error },
	textMute: { color: colors.mute },

	bgSuccess: { backgroundColor: colors.success, color: "#ffffff" },
	bgGray: { backgroundColor: colors.gray, color: "#000000" },
	bgWarning: { backgroundColor: colors.warning, color: "#ffffff" },
	bgError: { backgroundColor: colors.error, color: "#ffffff" },
	bgMute: { backgroundColor: colors.mute, color: "#000000" },
	bgOffPrimary: { backgroundColor: colors.offPrimary, color: "#000000" },
};



const styles = StyleSheet.create({
	...spacing,
	...colorStyles,
	bt: { borderTop: '1px solid #000' },
	bm: { borderBottom: '1px solid #000' },
	bl: { borderLeft: '1px solid #000' },
	br: { borderRight: '1px solid #000' },
	w1: { width: '100%' },
	col4: { width: '25%' },
	col3: { width: '33.333%' },
	col8: { width: '75%' },
	col6: { width: '50%' },
	overline: {
		fontSize: 8,
		marginBottom: 8,
		fontWeight: 700,
		textTransform: 'uppercase',
	},
	h3: { fontSize: 16, fontWeight: 700 },
	h4: { fontSize: 13, fontWeight: 700 },
	h5: { fontSize: 11, fontWeight: 700 },
	bold: { fontWeight: 700 },
	body1: { fontSize: 10 },
	subtitle2: { fontSize: 9, fontWeight: 700 },
	subtitle3: { fontSize: 9 },
	subtitle4: { fontSize: 7 },
	alignRight: { textAlign: 'right' },
	textCenter: { textAlign: 'center' },
	underlineText: {
		width: '100%',
		fontWeight: 700,
		color: '#000',
		borderBottom: '1px solid #000'
	},
	page: {
		padding: '8px 40px 0 40px',
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
