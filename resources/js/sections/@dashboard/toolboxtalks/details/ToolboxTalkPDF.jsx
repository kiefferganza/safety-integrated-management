/* eslint-disable jsx-a11y/alt-text */
import PropTypes from 'prop-types';
import { Page, View, Text, Image, Document } from '@react-pdf/renderer';
// utils
import { fDate } from '@/utils/formatTime';

import styles from './TBTStyle';
import { format } from 'date-fns';
import { useMemo } from 'react';

// ----------------------------------------------------------------------

ToolboxTalkPDF.propTypes = {
	tbt: PropTypes.object,
	cms: PropTypes.string,
};

export default function ToolboxTalkPDF ({ tbt, cms }) {


	const documents = useMemo(() => {
		if (tbt.participants.length > 10) {
			const chunkSize = 10;
			let arr = [];
			for (let i = 0; i < tbt.participants.length; i += chunkSize) {
				const chunk = tbt.participants.slice(i, i + chunkSize);
				arr.push(chunk)
			}
			return arr;
		} else {
			return [tbt.participants];
		}
	}, [tbt]);

	return (
		<Document title={cms !== "N/A" ? cms : "Toolbox Talk"}>
			{documents.map((doc, index) => (
				<Page size="A4" style={styles.page} key={index}>
					<View style={styles.mb16}>
						<View style={styles.gridContainer}>
							<Image source="/logo/Fiafi-logo.png" style={{ height: 32, padding: 2 }} />
						</View>
						<View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
							<Text style={styles.h3}>Toolbox Talk</Text>
						</View>
						<View style={styles.gridContainer}>
							<View style={[styles.col3, { alignItems: 'center', flexDirection: 'column' }]}>
								<Text style={styles.subtitle2}>CMS Number:</Text>
								<Text style={[styles.body1, { fontWeight: 700 }]}>{cms.toUpperCase()}</Text>
							</View>
							<View style={[styles.col3, { alignItems: 'center', flexDirection: 'column' }]}>
								<Text style={styles.subtitle2}>Revision:</Text>
								<Text style={[styles.body1, { fontWeight: 700 }]}>{tbt.revision_no || 0}</Text>
							</View>
							<View style={[styles.col3, { alignItems: 'center', flexDirection: 'column' }]}>
								<Text style={styles.subtitle2}>Rollout Date:</Text>
								<Text></Text>
							</View>
						</View>
					</View>

					<View style={[styles.gridContainer, styles.mb16]}>
						<View style={[styles.col6, { paddingRight: 8 }]}>
							<View style={{ flexDirection: 'column' }}>
								<Text style={styles.subtitle2}>TBT Title</Text>
								<View style={{ width: '100%' }}>
									<Text style={[styles.underlineText, styles.body1]}>{tbt.title}</Text>
								</View>
							</View>

							<View style={{ flexDirection: 'column' }}>
								<Text style={styles.subtitle2}>Project Location</Text>
								<View style={{ width: '100%' }}>
									<Text style={[styles.underlineText, styles.body1]}>{tbt.location}</Text>
								</View>
							</View>

							<View style={{ flexDirection: 'column' }}>
								<Text style={styles.subtitle2}>Contract No.</Text>
								<View style={{ width: '100%' }}>
									<Text style={[styles.underlineText, styles.body1]}>{tbt.contract_no}</Text>
								</View>
							</View>
						</View>

						<View style={[styles.col6, { paddingLeft: 8 }]}>
							<View style={{ flexDirection: 'column' }}>
								<Text style={styles.subtitle2}>Date of TBT</Text>
								<View style={{ width: '100%' }}>
									<Text style={[styles.underlineText, styles.body1]}>{tbt?.date_conducted ? fDate(new Date(tbt.date_conducted)) : ""}</Text>
								</View>
							</View>

							<View style={{ flexDirection: 'column' }}>
								<Text style={styles.subtitle2}>Time of TBT</Text>
								<View style={{ width: '100%' }}>
									<Text style={[styles.underlineText, styles.body1]}>{tbt.time_conducted}</Text>
								</View>
							</View>

							<View style={{ flexDirection: 'column' }}>
								<Text style={styles.subtitle2}>Attachment</Text>
								<View style={{ width: '100%' }}>
									<Text style={[styles.underlineText, styles.body1]}>
										{tbt?.file ? "Yes" : "No"}
									</Text>
								</View>
							</View>
						</View>
					</View>

					<View style={styles.table}>
						<View style={styles.tableHeader}>
							<View style={styles.tableRow}>
								<View style={styles.tableCell_1}>
									<Text style={[styles.subtitle2, { paddingLeft: 4 }]}>S.no</Text>
								</View>

								<View style={styles.tableCell_2}>
									<Text style={styles.subtitle2}>Name</Text>
								</View>

								<View style={[styles.tableCell_2]}>
									<Text style={styles.subtitle2}>Position</Text>
								</View>

								<View style={styles.tableCell_1}>
									<Text style={styles.subtitle2}>Signature</Text>
								</View>
							</View>
						</View>

						<View style={styles.tableBody}>
							{doc?.map((item, idx) => (
								<View style={styles.tableRow} key={idx}>
									<View style={styles.tableCell_1}>
										<Text style={{ paddingLeft: 8 }}>{(idx + 1) + (index * 10)}</Text>
									</View>

									<View style={styles.tableCell_2}>
										<Text>{item.fullname}</Text>
									</View>

									<View style={[styles.tableCell_2]}>
										<Text style={{ textTransform: 'capitalize' }}>{item.position.position}</Text>
									</View>

									<View style={styles.tableCell_1}>
									</View>
								</View>
							))}
							{doc.length < 10 && (
								Array.from(Array(10 - doc.length).keys()).map((col, idx) => (
									<View style={styles.tableRow} key={col}>
										<View style={styles.tableCell_1}>
											<Text style={{ paddingLeft: 8 }}>{doc.length + ((idx + 1) + (index * 10))}</Text>
										</View>

										<View style={styles.tableCell_2}>
										</View>

										<View style={[styles.tableCell_2]}>
										</View>

										<View style={styles.tableCell_1}>
										</View>
									</View>
								))
							)}
						</View>
					</View>

					<View style={[styles.mb40, { marginTop: 64 }]}>
						<View style={{ marginBottom: 72 }}>
							<View style={[styles.gridContainer, styles.mb16]}>
								<Text style={styles.subtitle2}>Remarks</Text>
							</View>
							<View style={{ width: '100%', borderBottom: 1 }}>
							</View>
							<View style={{ width: '100%', borderBottom: 1, marginTop: 18 }}>
							</View>
							<View style={{ width: '100%', borderBottom: 1, marginTop: 18 }}>
							</View>
						</View>
						<View>
							<Text style={[styles.body1, { textAlign: 'center', width: 140 }]}>{tbt?.conducted?.fullname || tbt?.conducted_by}</Text>
							<Text style={[styles.body1, { borderTop: 1, width: 140, textAlign: 'center', paddingTop: 4 }]}>Conducted by:</Text>
						</View>
					</View>

					<View style={[styles.gridContainer, styles.footer]}>
						<View style={styles.col3}>
							<Text style={{ fontSize: 9, textAlign: 'left' }}>Uncontrolled Copy if Printed</Text>
						</View>
						<View style={styles.col3}>
							<Text style={{ fontSize: 9, textAlign: 'center' }}>&copy; FIAFI Group Company, {new Date().getFullYear()}. All Rights Reserved.</Text>
						</View>
						<View style={styles.col3}>
							<Text style={{ fontSize: 9, textAlign: 'right' }}>{format(new Date(), 'MM/dd/yy')} Page {`${index + 1} / ${documents.length}`}</Text>
						</View>
					</View>
				</Page>
			))}
		</Document >
	);
}
