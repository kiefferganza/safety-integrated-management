/* eslint-disable jsx-a11y/alt-text */
import { Page, View, Text, Image, Document } from '@react-pdf/renderer';
// utils
import styles from './PpeStyle';
import { endOfMonth, format, startOfMonth } from 'date-fns';
import { useMemo } from 'react';
import { useTheme } from '@mui/material';
import { sentenceCase } from 'change-case';
import { fDate } from '@/utils/formatTime';

// ----------------------------------------------------------------------
const PER_PAGE = 12;

export default function PpePDF ({ report, title = "PPE REPORT PREVIEW" }) {
	const theme = useTheme();

	const documents = useMemo(() => {
		if (report?.inventories.length > PER_PAGE) {
			const chunkSize = PER_PAGE;
			let arr = [];
			for (let i = 0; i < report.inventories.length; i += chunkSize) {
				const chunk = report.inventories.slice(i, i + chunkSize);
				arr.push(chunk)
			}
			return arr;
		} else {
			return [report.inventories];
		}
	}, [report]);

	const overallTotal = report?.inventories ? report.inventories.reduce((acc, curr) => acc + (curr?.max_order || 0) * (curr?.item_price || curr?.price), 0) : 0;

	const forcastMonth = report.budget_forcast_date ? `${fDate(startOfMonth(new Date(report.budget_forcast_date)), 'dd')} - ${fDate(endOfMonth(new Date(report.budget_forcast_date)), 'dd MMM yyyy')}` : "_______";
	return (
		<Document title={title}>
			{documents.map((doc, index) => {
				const total = doc.reduce((acc, curr) => acc + (curr?.max_order || 0) * (curr?.item_price || curr?.price), 0);
				const curr = doc.at(-1)?.item_currency || doc.at(-1)?.currency;
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
									<Text style={[styles.body1, { fontWeight: 700 }]}>{report?.form_number || "_______"}</Text>
								</View>
								<View style={[styles.col3, { alignItems: 'center', flexDirection: 'column' }]}>
									<Text style={styles.subtitle2}>Revision:</Text>
									<Text style={[styles.body1, { fontWeight: 700 }]}>{report?.revision_no || 0}</Text>
								</View>
								<View style={[styles.col3, { alignItems: 'center', flexDirection: 'column' }]}>
									<Text style={styles.subtitle2}>Rollout Date:</Text>
									<Text style={[styles.body1, { fontWeight: 700 }]}>{fDate(report?.created_at)}</Text>
								</View>
							</View>
						</View>

						<View style={[styles.gridContainer, styles.mb16]}>
							<View style={[styles.col6, { paddingRight: 8 }]}>
								<View style={{ flexDirection: 'column' }}>
									<Text style={styles.subtitle2}>Contract No.</Text>
									<View style={{ width: '100%' }}>
										<Text style={[styles.underlineText, styles.body1, { textTransform: "uppercase" }]}>{report?.contract_no || "_______"}</Text>
									</View>
								</View>

								<View style={{ flexDirection: 'column' }}>
									<Text style={styles.subtitle2}>Inventory Date</Text>
									<View style={{ width: '100%' }}>
										<Text style={[styles.underlineText, styles.body1]}>{report?.shortLabel || "_______"}</Text>
									</View>
								</View>

								<View style={{ flexDirection: 'column' }}>
									<Text style={styles.subtitle2}>Conducted By</Text>
									<View style={{ width: '100%' }}>
										<Text style={[styles.underlineText, styles.body1, { textTransform: "capitalize" }]}>{report?.conducted_by || "_______"}</Text>
									</View>
								</View>
							</View>

							<View style={[styles.col6, { paddingLeft: 8 }]}>
								<View style={{ flexDirection: 'column' }}>
									<Text style={styles.subtitle2}>Budget Forecast Date</Text>
									<View style={{ width: '100%' }}>
										<Text style={[styles.underlineText, styles.body1]}>{forcastMonth}</Text>
									</View>
								</View>

								<View style={{ flexDirection: 'column' }}>
									<Text style={styles.subtitle2}>Location</Text>
									<View style={{ width: '100%', minHeight: 16 }}>
										<Text style={[styles.underlineText, styles.body1, { textTransform: "capitalize" }]}>{report?.location || "_______"}</Text>
									</View>
								</View>

								<View style={{ flexDirection: 'column' }}>
									<Text style={styles.subtitle2}>Submitted</Text>
									<View style={{ width: '100%' }}>
										<Text style={[styles.underlineText, styles.body1]}>
											{report?.submitted_date ? fDate(report.submitted_date) : "_______"}
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
										<Text style={styles.subtitle3}>Inventory Status</Text>
									</View>

									<View style={[styles.tableCell_2]}>
										<Text style={styles.subtitle3}>Min Order</Text>
									</View>

									<View style={[styles.tableCell_2]}>
										<Text style={styles.subtitle3}>Max Order</Text>
									</View>

									<View style={[styles.tableCell_3]}>
										<Text style={styles.subtitle3}>Request Status</Text>
									</View>
								</View>
							</View>

							<View style={styles.tableBody}>
								{doc?.map((row, idx) => {
									const requestStatus = getRequestStatus((row?.max_order || 0), (row?.min_qty || row?.level || 0));
									console.log(requestStatus)
									return (
										<View style={styles.tableRow} key={idx}>
											<View style={styles.tableCell_1}>
												<Text style={{ fontSize: 6, paddingLeft: 8 }}>{(idx + 1) + (index * PER_PAGE)}</Text>
											</View>

											<View style={styles.tableCell_2}>
												<Text style={{ fontSize: 6, textTransform: 'capitalize', marginLeft: 8 }}>{row.item}</Text>
											</View>

											<View style={styles.tableCell_2}>
												<Text style={{ fontSize: 6, marginLeft: 16 }}>{(row?.inboundTotalQty || row?.inbound_total_qty || 0).toLocaleString()}</Text>
											</View>

											<View style={styles.tableCell_2}>
												<Text style={{ fontSize: 6 }}>{(row?.outboundTotalQty || row?.outbound_total_qty || 0).toLocaleString()}</Text>
											</View>

											<View style={styles.tableCell_2}>
												<Text style={{ fontSize: 6 }}>{(row?.current_stock_qty || row?.qty || 0).toLocaleString()}</Text>
											</View>

											<View style={styles.tableCell_2}>
												<Text style={{ fontSize: 6 }}>{(row?.min_qty || row?.level || 0).toLocaleString()}</Text>
											</View>

											<View style={styles.tableCell_2}>
												<Text style={{ fontSize: 6 }}>{row?.item_currency || row?.currency} {(row?.item_price || row?.price || 0).toLocaleString()}</Text>
											</View>

											<View style={styles.tableCell_2}>
												<View style={[styles.badge, {
													backgroundColor: (row.status === 'out_of_stock' && theme.palette.error.light) || (row.status === 'low_stock' && theme.palette.warning.light) || (row.status === 'need_reorder' && theme.palette.info.main) || theme.palette.success.light,
													width: '80%'
												}]}>
													<Text style={[styles.textDefault, { color: "#fff", textAlign: "center", fontSize: 6, lineHeight: 0, paddingRight: 1, paddingLeft: 1 }]}>{sentenceCase(row.status)}</Text>
												</View>
											</View>

											<View style={styles.tableCell_2}>
												<Text style={{ fontSize: 6 }}>{(row?.min_order || 0).toLocaleString()}</Text>
											</View>
											<View style={styles.tableCell_2}>
												<Text style={{ fontSize: 6 }}>{(row?.max_order || 0).toLocaleString()}</Text>
											</View>
											<View style={styles.tableCell_3}>
												<View style={[styles.badge, {
													backgroundColor: (requestStatus === 'out_of_stock' && theme.palette.error.light) || (requestStatus === 'low_stock' && theme.palette.warning.light) || (requestStatus === 'need_reorder' && theme.palette.info.main) || theme.palette.success.light
												}]}>
													<Text style={[styles.textDefault, { color: "#fff", textAlign: "center", fontSize: 6, lineHeight: 0, paddingRight: 1, paddingLeft: 1 }]}>{sentenceCase(requestStatus)}</Text>
												</View>
											</View>
										</View>
									)
								})}
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
								<View style={[styles.tableRow, { marginTop: 8, borderBottomWidth: 0 }]}>
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
								{(index + 1) === documents?.length && (
									<View style={[styles.tableRow, { marginTop: 8, borderBottomWidth: 0 }]}>
										<View style={styles.tableCell_1}></View>

										<View style={styles.tableCell_2}></View>

										<View style={[styles.tableCell_2]}></View>

										<View style={[styles.tableCell_2]}></View>

										<View style={styles.tableCell_2}></View>

										<View style={[styles.tableCell_2]}></View>

										<View style={[styles.tableCell_2]}>
											<Text style={styles.subtitle2}>Grand Total:</Text>
										</View>

										<View style={styles.tableCell_2}>
											<Text style={[styles.subtitle2, { borderBottomWidth: 1 }]}>{curr} {(overallTotal)?.toLocaleString()}</Text>
										</View>
									</View>
								)}
							</View>
						</View>

						{(index + 1) === documents?.length && (
							<View style={[styles.mb40, { marginTop: 24 }]}>
								<View style={{ marginBottom: 48 }}>
									<View style={[styles.gridContainer, styles.mb16]}>
										<Text style={styles.subtitle2}>Remarks</Text>
									</View>
									<View style={{ width: '100%', borderBottom: 1, minHeight: 16 }}>
										<Text style={styles.body1}>{report?.remarks}</Text>
									</View>
								</View>
								<View style={{ flexDirection: 'row' }}>
									<View style={{ width: "33.3%" }}>
										<Text style={[styles.body1, { textAlign: 'center', width: 140 }]}>{report?.submitted?.fullname}</Text>
										<Text style={[styles.body1, { borderTop: 1, width: 140, textAlign: 'center', paddingTop: 4, lineHeight: 0 }]}>Submitted By</Text>
										{report?.submitted && (
											<Text style={[styles.subtitle2, { width: 140, textAlign: 'center', paddingTop: 4 }]}>{report?.submitted?.position}</Text>
										)}
									</View>
									<View style={{ width: "33.3%" }}>
										<Text style={[styles.body1, { textAlign: 'center', width: 140 }]}>{report?.reviewer?.fullname}</Text>
										<Text style={[styles.body1, { borderTop: 1, width: 140, lineHeight: 0, textAlign: 'center', paddingTop: 4 }]}>Reviewed By</Text>
										{report?.reviewer && (
											<Text style={[styles.subtitle2, { width: 140, textAlign: 'center', paddingTop: 4 }]}>{report?.reviewer?.position}</Text>
										)}
									</View>
									<View style={{ width: "33.3%" }}>
										<Text style={[styles.body1, { textAlign: 'center', width: 140 }]}>{report?.approval?.fullname}</Text>
										<Text style={[styles.body1, { borderTop: 1, width: 140, lineHeight: 0, textAlign: 'center', paddingTop: 4 }]}>Approved By</Text>
										{report?.approval && (
											<Text style={[styles.subtitle2, { width: 140, textAlign: 'center', paddingTop: 4 }]}>{report?.approval?.position}</Text>
										)}
									</View>
								</View>
							</View>
						)}

						<View style={[styles.gridContainer, styles.footer]}>
							<View style={styles.col3}>
								<Text style={{ fontSize: 8, textAlign: 'left' }}>Uncontrolled Copy if Printed</Text>
							</View>
							<View style={styles.col3}>
								<Text style={{ fontSize: 8, textAlign: 'center' }}>&copy; FIAFI Group Company, {new Date().getFullYear()}. All Rights Reserved.</Text>
							</View>
							<View style={styles.col3}>
								<Text style={{ fontSize: 8, textAlign: 'right' }}>{format(new Date(), 'MM/dd/yy')} Page {`${index + 1} / ${documents.length}`}</Text>
							</View>
						</View>
					</Page>
				)
			})
			}
		</Document >
	);
}


function getRequestStatus (qty, minQty) {
	if (qty <= 0) return "out_of_stock";
	if (qty === minQty || minQty + 10 >= qty) return "need_reorder";
	if (minQty > qty) return "low_stock"
	if (qty > minQty) return "in_stock";
	return "in_stock";
}