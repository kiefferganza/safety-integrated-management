/* eslint-disable jsx-a11y/alt-text */
import PropTypes from 'prop-types';
import { Page, View, Text, Image, Document } from '@react-pdf/renderer';
// utils
// import { fDate } from '@/utils/formatTime';

import styles from './InspectionPDFStyle';
import { format } from 'date-fns';

// ----------------------------------------------------------------------

InspectionPDF.propTypes = {
	inspection: PropTypes.object,
	cms: PropTypes.string,
};

export default function InspectionPDF ({ inspection, cms, reports }) {
	const section_C_A = reports.sectionC.slice(0, 6);
	const remainingC_A = reports.sectionC.slice(6);

	reports.sectionC = section_C_A;
	reports.sectionC_B = [...remainingC_A, ...reports.sectionC_B];

	return (
		<Document title={cms !== "N/A" ? cms : "HSE Inspection & Closeout Report"}>
			<Page size="A4" style={styles.page}>
				<View style={styles.mb16}>
					<View style={styles.gridContainer}>
						<Image source="/logo/Fiafi-logo.png" style={{ height: 32, padding: 2 }} />
					</View>
					<View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
						<Text style={styles.h3}>HSE Inspection & Closeout Report</Text>
					</View>
					<View style={styles.gridContainer}>
						<View style={[styles.col3, { alignItems: 'center', flexDirection: 'column' }]}>
							<Text style={styles.subtitle2}>CMS Number:</Text>
							<Text style={[styles.body1, { fontWeight: 700 }]}>{cms.toUpperCase()}</Text>
						</View>
						<View style={[styles.col3, { alignItems: 'center', flexDirection: 'column' }]}>
							<Text style={styles.subtitle2}>Revision:</Text>
							<Text style={[styles.body1, { fontWeight: 700 }]}>{inspection.revision_no || 0}</Text>
						</View>
						<View style={[styles.col3, { alignItems: 'center', flexDirection: 'column' }]}>
							<Text style={styles.subtitle2}>Rollout Date:</Text>
							<Text></Text>
						</View>
					</View>
				</View>

				<View style={[styles.gridContainer, { marginBottom: '4px' }]}>
					<View style={[styles.col6, { paddingRight: 8 }]}>
						<View style={[styles.gridContainer, styles.mb16]}>
							<View style={[styles.col6, { flexDirection: 'column', paddingRight: 4 }]}>
								<Text style={styles.subtitle3}>Contract No.:</Text>
								<View style={[styles.w1]}>
									<Text style={[styles.underlineText, styles.body1]}>{inspection.contract_no}</Text>
								</View>
							</View>
							<View style={[styles.col6, { flexDirection: 'column', paddingLeft: 4 }]}>
								<Text style={styles.subtitle3}>Location:</Text>
								<View style={[styles.w1]}>
									<Text style={[styles.underlineText, styles.body1]}>{inspection.location}</Text>
								</View>
							</View>
						</View>
						<View style={[styles.col6, styles.w1, styles.mb16, { flexDirection: 'column' }]}>
							<Text style={styles.subtitle3}>Inspected:</Text>
							<View style={[styles.w1]}>
								<Text style={[styles.underlineText, styles.body1]}>{inspection.inspected_by}</Text>
							</View>
						</View>
						<View style={[styles.col6, styles.w1, styles.mb16, { flexDirection: 'column' }]}>
							<Text style={styles.subtitle3}>Accompanied:</Text>
							<View style={[styles.w1]}>
								<Text style={[styles.underlineText, styles.body1]}>{inspection.accompanied_by}</Text>
							</View>
						</View>
					</View>
					<View style={[styles.col6, { paddingLeft: 8 }]}>
						<View style={[styles.gridContainer, { marginBottom: '4px' }]}>
							<View style={[styles.col6, { flexDirection: 'column', paddingRight: 4 }]}>
								<Text style={styles.subtitle3}>Date:</Text>
								<View style={[styles.w1]}>
									<Text style={[styles.underlineText, styles.body1]}>{inspection?.inspected_date}</Text>
								</View>
							</View>
							<View style={[styles.col6, { flexDirection: 'column', paddingLeft: 4 }]}>
								<Text style={styles.subtitle3}>Time:</Text>
								<View style={[styles.w1]}>
									<Text style={[styles.underlineText, styles.body1]}>{inspection?.inspected_time}</Text>
								</View>
							</View>
						</View>
						<View style={[styles.bl, styles.bt, styles.bgGray]}>
							<View style={[styles.tableRow, styles.br, styles.w1]}>
								<View style={[styles.pl8]}>
									<Text style={styles.bold}>Key:</Text>
								</View>
							</View>
						</View>
						<View style={[styles.w1, styles.bl, styles.bm, styles.bgOffPrimary, { flexDirection: 'row' }]}>
							<View style={[styles.col4, styles.br]}>
								<Text style={[styles.bold, styles.textCenter]}>1</Text>
							</View>
							<View style={[styles.col4, styles.br]}>
								<Text style={[styles.bold, styles.textCenter]}>2</Text>
							</View>
							<View style={[styles.col4, styles.br]}>
								<Text style={[styles.bold, styles.textCenter]}>3</Text>
							</View>
							<View style={[styles.col4, styles.br]}>
								<Text style={[styles.bold, styles.textCenter]}>4</Text>
							</View>
						</View>
						<View style={[styles.w1, styles.bl, styles.bm, { flexDirection: 'row', height: '40px' }]}>
							<View style={[styles.col4, styles.br, styles.bgSuccess, { height: '100%', justifyContent: 'center' }]}>
								<Text style={[styles.bold, styles.textCenter]}>1</Text>
							</View>
							<View style={[styles.col4, styles.br, styles.bgWarning, { height: '100%', justifyContent: 'center' }]}>
								<Text style={[styles.bold, styles.textCenter]}>2</Text>
							</View>
							<View style={[styles.col4, styles.br, styles.bgError, { height: '100%', justifyContent: 'center' }]}>
								<Text style={[styles.bold, styles.textCenter]}>3</Text>
							</View>
							<View style={[styles.col4, styles.br, styles.bgMute, { height: '100%', justifyContent: 'center' }]}>
								<Text style={[styles.bold, styles.textCenter]}>4</Text>
							</View>
						</View>
						<View style={[styles.w1, { marginTop: '4px' }]}>
							<View style={{ flexDirection: 'row' }}>
								<Text style={[styles.subtitle4, styles.bold]}>NOTE: </Text>
								<Text style={styles.subtitle4}>This checklist is to identify minimum of safety & health condition and should</Text>
							</View>
							<Text style={styles.subtitle4}>should not limit awareness to other safety and health hazards at the jobsite</Text>
						</View>
					</View>
				</View>

				<ReportBoxes reports={reports} avgScore={inspection.avg_score} />

				<View style={[styles.gridContainer, styles.footer]}>
					<View style={styles.col4}>
						<Text style={[styles.bold, { fontSize: 9, textAlign: 'left' }]}>Uncontrolled Copy if Printed</Text>
					</View>
					<View style={styles.col6}>
						<Text style={[styles.bold, { fontSize: 9, textAlign: 'center' }]}>&copy; FIAFI Group Company, {new Date().getFullYear()}. All Rights Reserved.</Text>
					</View>
					<View style={styles.col4}>
						<Text style={[styles.bold, { fontSize: 9, textAlign: 'right' }]}>{format(new Date(), 'MM/dd/yy')} Page {`${0 + 1} / ${1}`}</Text>
					</View>
				</View>
			</Page>
		</Document >
	);
}


function ReportBoxes ({ reports, avgScore }) {
	console.log(parseFloat(avgScore))
	const isPassed = parseFloat(avgScore) <= 1.25;
	return (
		<View style={[styles.gridContainer]}>
			<View style={[styles.col6, styles.bl, styles.bt, { marginRight: 4 }]}>
				<View style={[styles.bm]}>
					<View style={[styles.bgOffPrimary]}>
						<View style={[styles.tableRow, styles.br, styles.w1]}>
							<View style={[styles.pl8]}>
								<Text style={styles.bold}>Section A</Text>
							</View>
						</View>
					</View>
					<View style={{ flexDirection: 'row' }}>
						<View style={[styles.br, { width: '60px', height: '40px', alignItems: 'center', justifyContent: 'center' }]}>
							<Text style={[styles.bold, { fontSize: '8px' }]}>Ref #</Text>
						</View>
						<View style={[styles.br, styles.w1]}>
							<View style={[styles.pl8, styles.bm, { justifyContent: 'center', height: '20px' }]}>
								<Text style={[styles.bold, { fontSize: '8px', paddingTop: '2px' }]}>Inspected Item</Text>
							</View>
							<View style={[styles.pl8, { justifyContent: 'center', height: '20px' }]}>
								<Text style={[styles.bold, { fontSize: '8px', paddingTop: '2px' }]}>Offices/Welfare Facilities</Text>
							</View>
						</View>
						<View style={[styles.br, { width: '60px', height: '40px', alignItems: 'center', justifyContent: 'center' }]}>
							<Text style={[styles.bold, { fontSize: '8px' }]}>Score</Text>
						</View>
					</View>
					{reports?.sectionA.map((sec) => {
						const bg = getScoreColor(sec.ref_score);
						return (
							<View key={sec.list_id} style={[styles.bt, { flexDirection: 'row' }]}>
								<View style={[styles.br, { width: '60px', justifyContent: 'center', alignItems: 'center' }]}>
									<Text style={[styles.bold, styles.subtitle4, { paddingTop: '2px' }]}>{sec.ref_num}</Text>
								</View>
								<View style={[styles.br, styles.w1, styles.pl8]}>
									<Text style={[styles.subtitle4, { paddingTop: '4px' }]}>{sec.section_title}</Text>
								</View>
								<View style={[styles.br, bg, { width: '60px', justifyContent: 'center', alignItems: 'center' }]}>
									<Text style={[styles.bold, styles.subtitle4, { paddingTop: '2px' }]}>{sec.ref_score}</Text>
								</View>
							</View>
						)
					})}
				</View>
				<View style={[styles.bm]}>
					<View style={[styles.bgOffPrimary]}>
						<View style={[styles.tableRow, styles.br, styles.w1]}>
							<View style={[styles.pl8]}>
								<Text style={styles.bold}>Section A</Text>
							</View>
						</View>
					</View>
					<View style={{ flexDirection: 'row' }}>
						<View style={[styles.br, { width: '60px', height: '40px', alignItems: 'center', justifyContent: 'center' }]}>
							<Text style={[styles.bold, { fontSize: '8px' }]}>Ref #</Text>
						</View>
						<View style={[styles.br, styles.w1]}>
							<View style={[styles.pl8, styles.bm, { justifyContent: 'center', height: '20px' }]}>
								<Text style={[styles.bold, { fontSize: '8px', paddingTop: '2px' }]}>Inspected Item</Text>
							</View>
							<View style={[styles.pl8, { justifyContent: 'center', height: '20px' }]}>
								<Text style={[styles.bold, { fontSize: '8px', paddingTop: '2px' }]}>Monitoring/Control</Text>
							</View>
						</View>
						<View style={[styles.br, { width: '60px', height: '40px', alignItems: 'center', justifyContent: 'center' }]}>
							<Text style={[styles.bold, { fontSize: '8px' }]}>Score</Text>
						</View>
					</View>
					{reports?.sectionB.map((sec) => {
						const bg = getScoreColor(sec.ref_score);
						return (
							<View key={sec.list_id} style={[styles.bt, { flexDirection: 'row' }]}>
								<View style={[styles.br, { width: '60px', justifyContent: 'center', alignItems: 'center' }]}>
									<Text style={[styles.bold, styles.subtitle4, { paddingTop: '2px' }]}>{sec.ref_num}</Text>
								</View>
								<View style={[styles.br, styles.w1, styles.pl8]}>
									<Text style={[styles.subtitle4, { paddingTop: '4px' }]}>{sec.section_title}</Text>
								</View>
								<View style={[styles.br, bg, { width: '60px', justifyContent: 'center', alignItems: 'center' }]}>
									<Text style={[styles.bold, styles.subtitle4, { paddingTop: '2px' }]}>{sec.ref_score}</Text>
								</View>
							</View>
						)
					})}
				</View>
				<View style={[styles.bm]}>
					<View style={[styles.bgOffPrimary]}>
						<View style={[styles.tableRow, styles.br, styles.w1]}>
							<View style={[styles.pl8]}>
								<Text style={styles.bold}>Section C</Text>
							</View>
						</View>
					</View>
					<View style={{ flexDirection: 'row' }}>
						<View style={[styles.br, { width: '60px', height: '40px', alignItems: 'center', justifyContent: 'center' }]}>
							<Text style={[styles.bold, { fontSize: '8px' }]}>Ref #</Text>
						</View>
						<View style={[styles.br, styles.w1]}>
							<View style={[styles.pl8, styles.bm, { justifyContent: 'center', height: '20px' }]}>
								<Text style={[styles.bold, { fontSize: '8px', paddingTop: '2px' }]}>Inspected Item</Text>
							</View>
							<View style={[styles.pl8, { justifyContent: 'center', height: '20px' }]}>
								<Text style={[styles.bold, { fontSize: '8px', paddingTop: '2px' }]}>Site Operations</Text>
							</View>
						</View>
						<View style={[styles.br, { width: '60px', height: '40px', alignItems: 'center', justifyContent: 'center' }]}>
							<Text style={[styles.bold, { fontSize: '8px' }]}>Score</Text>
						</View>
					</View>
					{reports?.sectionC.map((sec) => {
						const bg = getScoreColor(sec.ref_score);
						return (
							<View key={sec.list_id} style={[styles.bt, { flexDirection: 'row' }]}>
								<View style={[styles.br, { width: '60px', justifyContent: 'center', alignItems: 'center' }]}>
									<Text style={[styles.bold, styles.subtitle4, { paddingTop: '2px' }]}>{sec.ref_num}</Text>
								</View>
								<View style={[styles.br, styles.w1, styles.pl8]}>
									<Text style={[styles.subtitle4, { paddingTop: '4px' }]}>{sec.section_title}</Text>
								</View>
								<View style={[styles.br, bg, { width: '60px', justifyContent: 'center', alignItems: 'center' }]}>
									<Text style={[styles.bold, styles.subtitle4, { paddingTop: '2px' }]}>{sec.ref_score}</Text>
								</View>
							</View>
						)
					})}
				</View>
			</View>

			<View style={[styles.col6, { marginLeft: 4 }]}>
				<View style={[styles.bm, styles.bl]}>
					{reports?.sectionC_B.map((sec) => {
						const bg = getScoreColor(sec.ref_score);
						return (
							<View key={sec.list_id} style={[styles.bt, { flexDirection: 'row' }]}>
								<View style={[styles.br, { width: '60px', justifyContent: 'center', alignItems: 'center' }]}>
									<Text style={[styles.bold, styles.subtitle4, { paddingTop: '2px' }]}>{sec.ref_num}</Text>
								</View>
								<View style={[styles.br, styles.w1, styles.pl8]}>
									<Text style={[styles.subtitle4, { paddingTop: '4px' }]}>{sec.section_title}</Text>
								</View>
								<View style={[styles.br, bg, { width: '60px', justifyContent: 'center', alignItems: 'center' }]}>
									<Text style={[styles.bold, styles.subtitle4, { paddingTop: '2px' }]}>{sec.ref_score}</Text>
								</View>
							</View>
						)
					})}
				</View>
				<View style={[styles.bm, styles.bl]}>
					<View style={[styles.bgOffPrimary]}>
						<View style={[styles.tableRow, styles.br, styles.w1]}>
							<View style={[styles.pl8]}>
								<Text style={styles.bold}>Section D</Text>
							</View>
						</View>
					</View>
					<View style={{ flexDirection: 'row' }}>
						<View style={[styles.br, { width: '60px', height: '40px', alignItems: 'center', justifyContent: 'center' }]}>
							<Text style={[styles.bold, { fontSize: '8px' }]}>Ref #</Text>
						</View>
						<View style={[styles.br, styles.w1]}>
							<View style={[styles.pl8, styles.bm, { justifyContent: 'center', height: '20px' }]}>
								<Text style={[styles.bold, { fontSize: '8px', paddingTop: '2px' }]}>Inspected Item</Text>
							</View>
							<View style={[styles.pl8, { justifyContent: 'center', height: '20px' }]}>
								<Text style={[styles.bold, { fontSize: '8px', paddingTop: '2px' }]}>Environmental</Text>
							</View>
						</View>
						<View style={[styles.br, { width: '60px', height: '40px', alignItems: 'center', justifyContent: 'center' }]}>
							<Text style={[styles.bold, { fontSize: '8px' }]}>Score</Text>
						</View>
					</View>
					{reports?.sectionD.map((sec) => {
						const bg = getScoreColor(sec.ref_score);
						return (
							<View key={sec.list_id} style={[styles.bt, { flexDirection: 'row' }]}>
								<View style={[styles.br, { width: '60px', justifyContent: 'center', alignItems: 'center' }]}>
									<Text style={[styles.bold, styles.subtitle4, { paddingTop: '2px' }]}>{sec.ref_num}</Text>
								</View>
								<View style={[styles.br, styles.w1, styles.pl8]}>
									<Text style={[styles.subtitle4, { paddingTop: '4px' }]}>{sec.section_title}</Text>
								</View>
								<View style={[styles.br, bg, { width: '60px', justifyContent: 'center', alignItems: 'center' }]}>
									<Text style={[styles.bold, styles.subtitle4, { paddingTop: '2px' }]}>{sec.ref_score}</Text>
								</View>
							</View>
						)
					})}
				</View>
				<View style={[styles.bm, styles.bl]}>
					<View style={[styles.bgOffPrimary]}>
						<View style={[styles.tableRow, styles.br, styles.w1]}>
							<View style={[styles.pl8]}>
								<Text style={styles.bold}>Section E</Text>
							</View>
						</View>
					</View>
					<View style={{ flexDirection: 'row' }}>
						<View style={[styles.br, { width: '60px', height: '40px', alignItems: 'center', justifyContent: 'center' }]}>
							<Text style={[styles.bold, { fontSize: '8px' }]}>Ref #</Text>
						</View>
						<View style={[styles.br, styles.w1]}>
							<View style={[styles.pl8, styles.bm, { justifyContent: 'center', height: '20px' }]}>
								<Text style={[styles.bold, { fontSize: '8px', paddingTop: '2px' }]}>Inspected Item</Text>
							</View>
							<View style={[styles.pl8, { justifyContent: 'center', height: '20px' }]}>
								<Text style={[styles.bold, { fontSize: '8px', paddingTop: '2px' }]}>Others</Text>
							</View>
						</View>
						<View style={[styles.br, { width: '60px', height: '40px', alignItems: 'center', justifyContent: 'center' }]}>
							<Text style={[styles.bold, { fontSize: '8px' }]}>Score</Text>
						</View>
					</View>
					{reports?.sectionE.map((sec) => {
						const bg = getScoreColor(sec.ref_score);
						return (
							<View key={sec.list_id} style={[styles.bt, { flexDirection: 'row' }]}>
								<View style={[styles.br, { width: '60px', justifyContent: 'center', alignItems: 'center' }]}>
									<Text style={[styles.bold, styles.subtitle4, { paddingTop: '2px' }]}>{sec.ref_num}</Text>
								</View>
								<View style={[styles.br, styles.w1, styles.pl8]}>
									<Text style={[styles.subtitle4, { paddingTop: '4px' }]}>{sec.section_title}</Text>
								</View>
								<View style={[styles.br, bg, { width: '60px', justifyContent: 'center', alignItems: 'center' }]}>
									<Text style={[styles.bold, styles.subtitle4, { paddingTop: '2px' }]}>{sec.ref_score || ""}</Text>
								</View>
							</View>
						)
					})}
				</View>
				<View style={[styles.bm, styles.bl, styles.bt]}>
					<View style={[styles.bm, { flexDirection: 'row' }]}>
						<View style={[styles.br, styles.w1]}>
							<Text style={[styles.bold, styles.pl8, { fontSize: '8px', paddingTop: '2px' }]}>Average Score (TS ÷ TNIM)</Text>
						</View>
						<View style={[styles.br, { width: '60px', paddingTop: '2px' }]}>
							<Text style={[styles.bold, styles.textCenter, { fontSize: '8px' }]}>TS</Text>
						</View>
						<View style={[styles.br, { width: '70px', paddingTop: '2px' }]}>
							<Text style={[styles.bold, styles.textCenter, { fontSize: '8px' }]}>{avgScore}</Text>
						</View>
					</View>
					<View style={[styles.bm, { flexDirection: 'row' }]}>
						<View style={[styles.br, styles.w1]}>
							<Text style={[styles.pl8, { fontSize: '8px', paddingTop: '2px' }]}>The Average Score Must Range Between</Text>
						</View>
						<View style={[styles.br, { width: '60px', paddingTop: '2px' }]}>
							<Text style={[styles.textCenter, { fontSize: '8px' }]}>1.00 - 1.25</Text>
						</View>
						<View style={[styles.br, { width: '70px', flexDirection: 'row' }]}>
							<Text style={[styles.textCenter, styles.br, { width: '50px', fontSize: '8px', paddingTop: '2px', }]}>Passed</Text>
							<View style={[isPassed ? styles.bgSuccess : { backgroundColor: '#ffffff' }, { width: '20px' }]}>
								<Text style={[styles.textCenter, { fontSize: '8px', paddingTop: '2px' }]}>{isPassed ? '/' : ''}</Text>
							</View>
						</View>
					</View>
					<View style={{ flexDirection: 'row' }}>
						<View style={[styles.br, styles.w1]}>
							<Text style={[styles.pl8, { fontSize: '8px', paddingTop: '2px' }]}></Text>
						</View>
						<View style={[styles.br, { width: '60px', paddingTop: '2px' }]}>
							<Text style={[styles.textCenter, { fontSize: '8px' }]}>{">1.25"}</Text>
						</View>
						<View style={[styles.br, { width: '70px', flexDirection: 'row' }]}>
							<Text style={[styles.textCenter, styles.br, { width: '50px', fontSize: '8px', paddingTop: '2px', }]}>Failed</Text>
							<View style={[!isPassed ? styles.bgError : { backgroundColor: '#ffffff' }, { width: '20px' }]}>
								<Text style={[styles.textCenter, { fontSize: '8px', paddingTop: '2px' }]}>{!isPassed ? '/' : ''}</Text>
							</View>
						</View>
					</View>
				</View>

				<View style={styles.mt8}>
					<Text style={[styles.subtitle2, styles.textError]}>Legend: Total Score (TS), Total Number of Items Marked</Text>
				</View>
			</View>
		</View>
	);
}

function getScoreColor (score) {
	let color = '';
	switch (score) {
		case 1:
			color = styles.bgSuccess;
			break;
		case 2:
			color = styles.bgWarning;
			break;
		case 3:
			color = styles.bgError;
			break;
		case 4:
			color = styles.bgMute;
			break;
		default:
			break;
	}
	return color;
}