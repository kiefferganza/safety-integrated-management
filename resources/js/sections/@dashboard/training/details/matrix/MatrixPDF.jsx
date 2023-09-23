import { useMemo } from 'react';
import { Page, View, Text, Image, Document } from '@react-pdf/renderer';

import styles from './MatrixPDFStyle';
import { format } from 'date-fns';

// ----------------------------------------------------------------------

const POSITIONS = {
	"Driver": "#2f75b5",
	"HSE Deputy": "#c6e0b4",
	"PA/Safety Officer": "#ab0cff",
	"PA/Supervisor": "#85660c",
	"Electrician": "#782ab7",
	"Painter": "#1c8356",
	"laborer": "#17ff32",
	"Worker": "#ebd29e",
	"PA": "#e3e3e3",
	"Welder": "#1cbf4e",
	"Scaffolder": "#c5441c",
	"Mechanical Technician": "#dfa1fe",
	"Carpenter": "#ff00fc",
	"Safety Officer": "#8bc34a",
	"Engineer": "#f9a19f",
	"Grinder": "#91ad1c",
	"Site Supervisor": "#1cffcf",
	"QA/QC Engineer": "#2ed9ff",
	"Foreman": "#b10ca1",
	"Civil Manager": "#00b0f0",
	"Logistic": "#c174a7",
	"PA/Engineer": "#795548",
	"Surveyor": "#fe1cbf",
	"Storekeeper": "#b10068",
	"Security Guard": "#fae326",
	"Planner Engineer": "#e6ee9c",
};


const PER_PAGE = 30;

function addSummary (curr, prev) {
	const newObj = {};
	let total = 0;
	for (const key in curr) {
		if (key === 'summary' || key === 'total') continue;
		if (key === 'positions') {
			newObj[key] = new Set([...curr['positions'], ...prev['positions']]);
			continue;
		}
		newObj[key] = (curr[key] || 0) + (prev[key] || 0);
		total += (curr[key] || 0) + (prev[key] || 0);
	}
	newObj['total'] = total;
	return newObj;
}

export default function MatrixPDF ({ years, titles }) {

	const coursesLowerObj = titles.reduce((acc, curr) => {
		acc[curr.toLowerCase()] = 0;
		return acc;
	}, {});

	const pages = useMemo(() => {
		return Object.entries(years).map(yd => {
			const [year, data] = yd;
			if (data?.length > PER_PAGE) {
				const chunkSize = PER_PAGE;
				let arr = [];
				let j = 1;
				for (let i = 0; i < data.length; i += chunkSize) {
					const chunk = data.slice(i, i + chunkSize);
					arr.push([year + "_" + j, chunk]);
					j++;
				}
				return arr;
			} else {
				return [[year, data]];
			}
		});
	}, [years]);

	const total = {};
	pages.forEach(y => {
		y.forEach(([year, data]) => {
			data.forEach(data2 => {
				data2.data.forEach(comp => {
					const course = comp.courseName.toLowerCase();
					if (!total[year]) {
						total[year] = {
							...coursesLowerObj,
							'positions': new Set(),
							summary: null,
							total: 0,
						};
					}
					total[year]['positions'].add(comp.position);
					if (comp.isCompleted) {
						total[year][course] = total[year][course] ? total[year][course] + 1 : 1;
						total[year]['total'] += 1;
					}
				});
			})
		});
	});

	for (const year in total) {
		const yearTupple = year.split("_");
		if (yearTupple[1] && yearTupple[1] !== "1") {
			if (+yearTupple[1] > 1) {
				const prevTotal = total[`${yearTupple[0]}_${+yearTupple[1] - 1}`];
				if (prevTotal) {
					const prev = prevTotal?.summary || prevTotal;
					total[year]['summary'] = addSummary(total[year], prev);
				}
			}
		}
	}


	return (
		<Document title={"Training Matrix"}>
			{pages.map((page, idx) => (
				page.map(([year, data], pageIdx) => (
					<Page size="A3" style={styles.page} key={year + pageIdx}>
						<View>
							<View style={{ marginBottom: 16 }}>
								<View style={styles.mb16}>
									<View style={styles.gridContainer}>
										<Image source="/logo/Fiafi-logo.png" style={{ height: 48, padding: 2 }} />
									</View>
									<View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
										<Text style={styles.h2}>{`Training Matrix - YEAR ${year.split("_")[0]}`}</Text>
									</View>
								</View>
							</View>
							<View style={{ alignItems: 'center', justifyContent: 'center' }}>
								<MatrixTable titles={titles} data={data} year={year} total={total} />
							</View>
							<View style={{ marginTop: 16 }}>
								{idx === 0 && (
									<View style={styles.gridContainer}>
										<View style={{ width: '14%' }} />
										<View style={{ width: '72%' }}>
											<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 16 }}>
												<View style={{ width: '35%' }}>
													<Text style={[styles.h5]}>Position Legend:</Text>
												</View>
												<View style={{ flexDirection: 'row', alignItems: 'center', width: '65%' }}>
													<View style={{ flexDirection: 'row', alignItems: 'center' }}>
														<View style={{ height: 16 }}>
															<Text style={[styles.subtitle2]}>Completed: </Text>
														</View>
														<View style={{ width: '35%' }}>
															<View style={{ width: 60, height: 16, backgroundColor: "#808080", border: '0.25px solid #000' }} />
														</View>
													</View>
													<View style={{ flexDirection: 'row', alignItems: 'center' }}>
														<View style={{ height: 16 }}>
															<Text style={[styles.subtitle2]}>Not Completed: </Text>
														</View>
														<View style={{ width: '35%' }}>
															<View style={{ width: 60, height: 16, backgroundColor: "#ffa500", border: '0.25px solid #000' }} />
														</View>
													</View>
													<View style={{ flexDirection: 'row', alignItems: 'center' }}>
														<View style={{ height: 16 }}>
															<Text style={[styles.subtitle2]}>Expired: </Text>
														</View>
														<View style={{ width: '35%' }}>
															<View style={{ width: 60, height: 16, backgroundColor: "#d50000", border: '0.25px solid #000' }} />
														</View>
													</View>
												</View>
											</View>
											<View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
												{Object.entries(POSITIONS).map(([pos, color]) => (
													<View style={{ flexDirection: 'row', width: '33%' }} key={pos}>
														<View style={{ width: '65%' }}>
															<Text style={[styles.subtitle2]}>{pos}</Text>
														</View>
														<View style={{ width: '35%' }}>
															<View style={{ width: 60, height: 16, backgroundColor: color, border: '0.25px solid #000' }} />
														</View>
													</View>
												))}
											</View>
										</View>
										<View style={{ width: '14%' }} />
									</View>
								)}
							</View>
						</View>
						<View style={[styles.gridContainer, styles.footer]}>
							<View style={styles.col4}>
								<Text style={[styles.subtitle2, { textAlign: 'left' }]}>Uncontrolled Copy if Printed</Text>
							</View>
							<View style={styles.col6}>
								<Text style={[styles.subtitle2, { textAlign: 'center' }]}>&copy; FIAFI Group Company, {new Date().getFullYear()}. All Rights Reserved.</Text>
							</View>
							<View style={styles.col4}>
								<Text style={[styles.subtitle2, { textAlign: 'right' }]}>{format(new Date(), 'MM/dd/yy')} Page {pageIdx + 1}</Text>
							</View>
						</View>
					</Page>
				))
			))}
		</Document >
	)
}


function MatrixTable ({ titles, data, year, total }) {

	return (
		<View style={styles.gridContainer}>
			<View>
				<View style={styles.tableHead}>
					<View style={[styles.tableHeadCell, { minWidth: 26, width: 26 }]}>
						<View style={styles.tableHeadCellWrapper}>
							<Text style={[styles.tableHeadCellText, { padding: 0 }]}>S.no</Text>
						</View>
					</View>
					<View style={[styles.tableHeadCell, { width: 120 }]}>
						<View style={styles.tableHeadCellWrapper}>
							<Text style={styles.tableHeadCellText}>Name</Text>
						</View>
					</View>
					<View style={[styles.tableHeadCell, { width: 90 }]}>
						<View style={styles.tableHeadCellWrapper}>
							<Text style={styles.tableHeadCellText}>Position</Text>
						</View>
					</View>
					{titles?.map((title, idx) => (
						<View style={[styles.tableHeadCell, { width: 40 }]} key={idx}>
							<View style={styles.tableTextVerticialWrapper}>
								<Text style={[styles.tableHeadCellText, styles.tableTextVerticial]}>{title}</Text>
							</View>
						</View>
					))}
				</View>
				{(data || [])?.map((d, i) => {
					const splittedYear = year.split("_");
					let sNo = i + 1;
					if (splittedYear[1] && splittedYear[1] !== "1") {
						sNo = sNo + ((Number(splittedYear[1]) - 1) * 35);
					}
					return (
						<View key={i} style={styles.tableBody}>
							<View style={[styles.tableHeadCell, { justifyContent: 'center', minWidth: 26, width: 26, height: 16, padding: 0 }]}>
								<Text style={[styles.tableHeadCellText, { fontWeight: 500, color: "#000", paddingBottom: 0, paddingTop: 0.5, paddingLeft: 1 }]}>{sNo}</Text>
							</View>
							<View style={[styles.tableHeadCell, { justifyContent: 'center', width: 120, height: 16, padding: 0 }]}>
								<Text style={[styles.tableHeadCellText, { fontWeight: 500, color: "#000", paddingBottom: 0, paddingTop: 0.5, paddingLeft: 1 }]}>{d.fullName}</Text>
							</View>
							<View style={[styles.tableHeadCell, { justifyContent: 'center', width: 90, height: 16, padding: 0 }]}>
								<Text style={[styles.tableHeadCellText, { fontWeight: 500, color: "#000", paddingBottom: 0, paddingTop: 0.5, paddingLeft: 1 }]}>{d.position}</Text>
							</View>
							{titles?.map((title, idx) => {
								const course = d?.data?.find(d => d?.courseName?.trim()?.toLowerCase() === title?.trim()?.toLowerCase());
								return (
									<View style={[styles.tableHeadCell, { backgroundColor: course ? (course.expired ? '#d50000' : (course.isCompleted ? '#808080' : '#ffa500')) : (POSITIONS[d.position] || 'transparent'), width: 40, height: 16, padding: 0, paddingTop: 1.5 }]} key={idx}>
									</View>
								)
							})}
							<View style={[{ minWidth: 16, width: 16, height: 16, padding: 0 }]}>
								<Text style={[styles.tableHeadCellText, { fontWeight: 500, paddingBottom: 0, paddingTop: 1.5, paddingLeft: 4.2, color: "#000" }]}>{d?.completed_count}</Text>
							</View>
						</View>
					)
				})}
				<View style={{ flexDirection: 'row', marginVertical: 8 }}>
					<View style={[styles.tableHeadCell, { border: 0, justifyContent: 'center', minWidth: 26, width: 26, height: 16, padding: 0 }]}></View>
					<View style={[styles.tableHeadCell, { border: 0, justifyContent: 'center', width: 120, height: 16, padding: 0 }]}>
						<Text style={[styles.tableHeadCellText, { paddingVertical: 0, paddingLeft: 4, fontSize: 9, color: "#000", fontWeight: 700 }]}>Total</Text>
					</View>

					<View style={[styles.tableHeadCell, { border: 0, justifyContent: 'center', width: 90, height: 18, padding: 0 }]}>
						<Text style={[styles.tableHeadCellText, { paddingVertical: 0, paddingLeft: 4, fontSize: 9, color: "#000", fontWeight: 700 }]}>{total[year]?.positions?.size || 0}</Text>
					</View>
					{titles?.map((title, idx) => (
						<View style={[styles.tableHeadCell, { border: 0, width: 40, height: 18, padding: 0 }]} key={idx}>
							<Text style={[styles.tableHeadCellText, { paddingVertical: 0, paddingLeft: 4, fontSize: 9, textAlign: 'center', color: "#000", fontWeight: 700 }]}>{total[year][title.toLowerCase()] || 0}</Text>
						</View>
					))}
					<View style={[{ minWidth: 16, width: 16, height: 16, padding: 0, paddingLeft: 4.5 }]}>
						<Text style={[styles.tableHeadCellText, { fontWeight: 700, color: "#000" }]}>{total[year]?.total || 0}</Text>
					</View>
				</View>
				{total[year]['summary'] && (
					<View style={{ flexDirection: 'row', marginVertical: 8 }}>
						<View style={[styles.tableHeadCell, { border: 0, justifyContent: 'center', minWidth: 26, width: 26, height: 16, padding: 0 }]}></View>
						<View style={[styles.tableHeadCell, { border: 0, justifyContent: 'center', width: 120, height: 16, padding: 0 }]}>
							<Text style={[styles.tableHeadCellText, { paddingVertical: 0, paddingLeft: 4, fontSize: 9, color: "#000", fontWeight: 700 }]}>Summary Total</Text>
						</View>

						<View style={[styles.tableHeadCell, { border: 0, justifyContent: 'center', width: 90, height: 18, padding: 0 }]}>
							<Text style={[styles.tableHeadCellText, { paddingVertical: 0, paddingLeft: 4, fontSize: 9, color: "#000", fontWeight: 700 }]}>{total[year]['summary']?.positions?.size || 0}</Text>
						</View>
						{titles?.map((title, idx) => (
							<View style={[styles.tableHeadCell, { border: 0, width: 40, height: 18, padding: 0 }]} key={idx}>
								<Text style={[styles.tableHeadCellText, { paddingVertical: 0, fontSize: 9, textAlign: 'center', paddingLeft: 4, color: "#000", fontWeight: 700 }]}>{total[year]['summary'][title.toLowerCase()] || 0}</Text>
							</View>
						))}
						<View style={[{ minWidth: 16, width: 16, height: 16, padding: 0, paddingLeft: 4.5 }]}>
							<Text style={[styles.tableHeadCellText, { fontWeight: 700, color: "#000" }]}>{total[year]['summary']?.total || 0}</Text>
						</View>
					</View>
				)}
			</View>
		</View>
	)
}