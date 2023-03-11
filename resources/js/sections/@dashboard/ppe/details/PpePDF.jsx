/* eslint-disable jsx-a11y/alt-text */
import { Page, View, Text, Image, Document } from '@react-pdf/renderer';
// utils
import styles from './PpeStyle';
import { format } from 'date-fns';
import { useMemo } from 'react';
import { useTheme } from '@mui/material';
import { sentenceCase } from 'change-case';

// ----------------------------------------------------------------------
const PER_PAGE = 12;

export default function PpePDF ({ report }) {
	const theme = useTheme();

	const documents = useMemo(() => {
		if (report.list.length > PER_PAGE) {
			const chunkSize = PER_PAGE;
			let arr = [];
			for (let i = 0; i < report.list.length; i += chunkSize) {
				const chunk = report.list.slice(i, i + chunkSize);
				arr.push(chunk)
			}
			return arr;
		} else {
			return [report.list];
		}
	}, [report]);

	console.log(documents)

	return (
		<Document title={"PPE REPORT PREVIEW"}>
			{documents.map((doc, index) => {
				const total = doc.reduce((acc, curr) => acc + ((curr?.outboundTotalQty || 0) * curr.item_price), 0);
				const curr = doc.at(-1).item_currency;
				return (
					<Page size="A4" style={styles.page} key={index}>
						<View style={styles.mb16}>
							<View style={styles.gridContainer}>
								<Image source="/logo/Fiafi-logo.png" style={{ height: 32, padding: 2 }} />
							</View>
							<View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
								<Text style={styles.h4}>Monthly HSE Inventory Report & Budget Forecast</Text>
							</View>
							<View style={styles.gridContainer}>
								<View style={[styles.col3, { alignItems: 'center', flexDirection: 'column' }]}>
									<Text style={styles.subtitle2}>CMS Number:</Text>
									<Text style={[styles.body1, { fontWeight: 700 }]}>{report?.cms || "______"}</Text>
								</View>
								<View style={[styles.col3, { alignItems: 'center', flexDirection: 'column' }]}>
									<Text style={styles.subtitle2}>Revision:</Text>
									<Text style={[styles.body1, { fontWeight: 700 }]}>{report?.revision_no || 0}</Text>
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
									<Text style={styles.subtitle2}>Contract No.</Text>
									<View style={{ width: '100%' }}>
										<Text style={[styles.underlineText, styles.body1]}>{"______"}</Text>
									</View>
								</View>

								<View style={{ flexDirection: 'column' }}>
									<Text style={styles.subtitle2}>Inventory Date</Text>
									<View style={{ width: '100%' }}>
										<Text style={[styles.underlineText, styles.body1]}>{"______"}</Text>
									</View>
								</View>

								<View style={{ flexDirection: 'column' }}>
									<Text style={styles.subtitle2}>Conducted By</Text>
									<View style={{ width: '100%' }}>
										<Text style={[styles.underlineText, styles.body1]}>{"______"}</Text>
									</View>
								</View>
							</View>

							<View style={[styles.col6, { paddingLeft: 8 }]}>
								<View style={{ flexDirection: 'column' }}>
									<Text style={styles.subtitle2}>Budget Forecast Date</Text>
									<View style={{ width: '100%' }}>
										<Text style={[styles.underlineText, styles.body1]}>{"______"}</Text>
									</View>
								</View>

								<View style={{ flexDirection: 'column' }}>
									<Text style={styles.subtitle2}>Location</Text>
									<View style={{ width: '100%', minHeight: 16 }}>
										<Text style={[styles.underlineText, styles.body1]}>{"______"}</Text>
									</View>
								</View>

								<View style={{ flexDirection: 'column' }}>
									<Text style={styles.subtitle2}>Submitted</Text>
									<View style={{ width: '100%' }}>
										<Text style={[styles.underlineText, styles.body1]}>
											{"______"}
										</Text>
									</View>
								</View>
							</View>
						</View>

						<View style={styles.table}>
							<View style={styles.tableHeader}>
								<View style={styles.tableRow}>
									<View style={styles.tableCell_1}>
										<Text style={[styles.subtitle3, { paddingLeft: 4 }]}>S.no</Text>
									</View>

									<View style={styles.tableCell_2}>
										<Text style={[styles.subtitle3, { marginLeft: 8 }]}>Product</Text>
									</View>

									<View style={[styles.tableCell_2]}>
										<Text style={[styles.subtitle3, { marginLeft: 16 }]}>Received</Text>
									</View>

									<View style={[styles.tableCell_2]}>
										<Text style={[styles.subtitle3]}>Issued</Text>
									</View>

									<View style={[styles.tableCell_2]}>
										<Text style={styles.subtitle3}>Quantity</Text>
									</View>

									<View style={[styles.tableCell_2]}>
										<Text style={styles.subtitle3}>Reorder Level</Text>
									</View>

									<View style={[styles.tableCell_2]}>
										<Text style={styles.subtitle3}>Price</Text>
									</View>

									<View style={[styles.tableCell_2]}>
										<Text style={styles.subtitle3}>Min Order</Text>
									</View>

									<View style={[styles.tableCell_2]}>
										<Text style={styles.subtitle3}>Max Order</Text>
									</View>

									<View style={[styles.tableCell_3]}>
										<Text style={styles.subtitle3}>Status</Text>
									</View>
								</View>
							</View>

							<View style={styles.tableBody}>
								{doc?.map((row, idx) => (
									<View style={styles.tableRow} key={idx}>
										<View style={styles.tableCell_1}>
											<Text style={{ fontSize: 6, paddingLeft: 8 }}>{(idx + 1) + (index * PER_PAGE)}</Text>
										</View>

										<View style={styles.tableCell_2}>
											<Text style={{ fontSize: 6, textTransform: 'capitalize', marginLeft: 8 }}>{row.item}</Text>
										</View>

										<View style={styles.tableCell_2}>
											<Text style={{ fontSize: 6, marginLeft: 16 }}>{(row?.inboundTotalQty || 0).toLocaleString()}</Text>
										</View>

										<View style={styles.tableCell_2}>
											<Text style={{ fontSize: 6 }}>{(row?.outboundTotalQty || 0).toLocaleString()}</Text>
										</View>

										<View style={styles.tableCell_2}>
											<Text style={{ fontSize: 6 }}>{row.current_stock_qty.toLocaleString()}</Text>
										</View>

										<View style={styles.tableCell_2}>
											<Text style={{ fontSize: 6 }}>{row.min_qty.toLocaleString()}</Text>
										</View>

										<View style={styles.tableCell_2}>
											<Text style={{ fontSize: 6 }}>{row.item_currency} {(row.item_price || 0).toLocaleString()}</Text>
										</View>

										<View style={styles.tableCell_2}>
											<View>
												<Text style={{ fontSize: 6 }}>{(row?.outboundMinQty || 0).toLocaleString()} Item</Text>
											</View>
											<View>
												<Text style={{ fontSize: 6 }}>{row.item_currency} {((row.outboundMinQty || 0) * row.item_price).toLocaleString()}</Text>
											</View>
										</View>
										<View style={styles.tableCell_2}>
											<View>
												<Text style={{ fontSize: 6 }}>{(row?.outboundMaxQty || 0).toLocaleString()} Item</Text>
											</View>
											<View>
												<Text style={{ fontSize: 6 }}>{row.item_currency} {((row.outboundMaxQty || 0) * row.item_price).toLocaleString()}</Text>
											</View>
										</View>
										<View style={styles.tableCell_3}>
											<View style={[styles.badge, {
												backgroundColor: (row.status === 'out_of_stock' && theme.palette.error.light) || (row.status === 'low_stock' && theme.palette.warning.light) || theme.palette.success.light
											}]}>
												<Text style={[styles.textDefault, { color: "#fff", textAlign: "center", fontSize: 6, lineHeight: 0, paddingRight: 1, paddingLeft: 1 }]}>{sentenceCase(row.status)}</Text>
											</View>
										</View>
									</View>
								))}
								{doc.length < PER_PAGE && (
									Array.from(Array(PER_PAGE - doc.length).keys()).map((col, idx) => (
										<View style={styles.tableRow} key={col}>
											<View style={styles.tableCell_1}>
												<Text style={{ paddingLeft: 8, fontSize: 6 }}>{doc.length + ((idx + 1) + (index * PER_PAGE))}</Text>
											</View>

											<View style={styles.tableCell_2}>
											</View>

											<View style={[styles.tableCell_2]}>
											</View>

											<View style={[styles.tableCell_2]}>
											</View>

											<View style={styles.tableCell_3}>
											</View>
										</View>
									))
								)}
								<View style={[styles.tableRow, { marginTop: 16, borderBottomWidth: 0 }]}>
									<View style={styles.tableCell_1}></View>

									<View style={styles.tableCell_2}></View>

									<View style={[styles.tableCell_2]}></View>

									<View style={[styles.tableCell_2]}></View>

									<View style={styles.tableCell_2}></View>

									<View style={[styles.tableCell_2]}></View>

									<View style={[styles.tableCell_2]}>
										<Text style={styles.subtitle2}>Subtotal:</Text>
									</View>

									<View style={styles.tableCell_2}>
										<Text style={[styles.subtitle2, { borderBottomWidth: 1 }]}>{curr} {(total || 0)?.toLocaleString()}</Text>
									</View>
								</View>
							</View>
						</View>

						<View style={[styles.mb40, { marginTop: 40 }]}>
							<View style={{ marginBottom: 56 }}>
								<View style={[styles.gridContainer, styles.mb16]}>
									<Text style={styles.subtitle2}>Remarks</Text>
								</View>
								<View style={{ width: '100%', borderBottom: 1, minHeight: 16 }}>
									<Text style={styles.body1}>{report?.remarks}</Text>
								</View>
							</View>
							<View style={{ flexDirection: 'row' }}>
								<View style={{ width: "33.3%" }}>
									<Text style={[styles.body1, { textAlign: 'center', width: 140 }]}></Text>
									<Text style={[styles.body1, { borderTop: 1, width: 140, textAlign: 'center', paddingTop: 4 }]}>Submitted By</Text>
								</View>
								<View style={{ width: "33.3%" }}>
									<Text style={[styles.body1, { textAlign: 'center', width: 140 }]}></Text>
									<Text style={[styles.body1, { borderTop: 1, width: 140, textAlign: 'center', paddingTop: 4 }]}>Reviewed By</Text>
								</View>
								<View style={{ width: "33.3%" }}>
									<Text style={[styles.body1, { textAlign: 'center', width: 140 }]}></Text>
									<Text style={[styles.body1, { borderTop: 1, width: 140, textAlign: 'center', paddingTop: 4 }]}>Approved By</Text>
								</View>
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
				)
			})
			}
		</Document >
	);
}
