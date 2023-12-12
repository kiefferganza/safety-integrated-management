import { useMemo } from 'react';
import { Page, View, Text, Image, Document } from '@react-pdf/renderer';

import styles from './MatrixPDFStyle';
import { format, getDaysInMonth, eachYearOfInterval, getMonth } from 'date-fns';

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

const PER_PAGE = 40;
const FIRST_AND_LAST_PAGE = PER_PAGE - 10;

function generateDateRanges (startDate, endDate) {
	const startMonth = startDate.toLocaleString('default', { month: 'short' });
	const endMonth = endDate.toLocaleString('default', { month: 'short' });

	const yearsArray = eachYearOfInterval({ start: startDate, end: endDate });
	// if multiple years
	if (yearsArray.length > 1) {
		const dateRange = {};
		// If the last year is January
		let isLastDateJan = getMonth(endDate) === 0

		dateRange[yearsArray.at(0).getFullYear()] = `${startMonth.toLocaleString('default', { month: 'short' })} - Dec`;

		if (yearsArray.length > 1) {
			for (let i = 1; i < yearsArray.length - 1; i++) {
				const date = yearsArray.at(i);
				dateRange[date.getFullYear()] = `Jan - Dec`;
			}
		}

		if (isLastDateJan) {
			dateRange[yearsArray.at(-1).getFullYear()] = `Jan 1-${getDaysInMonth(endDate)}`;
			return dateRange;
		}
		dateRange[yearsArray.at(-1).getFullYear()] = `Jan - ${endMonth}`;
		return dateRange;
	}

	const year = startDate.getFullYear();
	if (startDate.getMonth() === endDate.getMonth()) {
		return {
			[year]: `${startMonth.toLocaleString('default', { month: 'short' })} 1-${getDaysInMonth(startDate)}`
		}
	}

	return {
		[year]: `${startMonth} - ${endMonth}`
	}
}

function populateSummary (curr, prev, titles) {
	const newObj = {};
	// let total = 0;
	for (const key in curr) {
    if(key in titles) {
      newObj[key] = (curr[key] || 0) + (prev[key] || 0);
    }else if(key !== 'total' && key !== 'summary') {
      delete curr[key];
    }
		// total += (curr[key] || 0) + (prev[key] || 0);
	}
	return newObj;
}

export default function MatrixPDF ({ years, titles, from, to }) {
	const dates = generateDateRanges(new Date(from), new Date(to));

	const coursesLowerObj = titles.reduce((acc, curr) => {
		acc[curr.toLowerCase()] = 0;
		return acc;
	}, {});
	const pages = useMemo(() => {
		return Object.entries(years).map(([year, data]) => {
			if (data?.length > PER_PAGE) {
				let arr = [];
        let i = 0;
				let j = 1;
        while(i < data.length) {
          const isFirstOrLastPage = (i === 0 || (i + PER_PAGE >= data.length));
          const chunkSize = isFirstOrLastPage ? FIRST_AND_LAST_PAGE : PER_PAGE
					const chunk = data.slice(i, i + chunkSize);
					arr.push([year + "_" + j, chunk]);
					j++;
          i += chunkSize;
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
							completed: {
								...coursesLowerObj,
								summary: null,
								total: 0,
							},
							hours: {
								...coursesLowerObj,
								summary: null,
								total: 0,
							},
              notCompleted: {
                ...coursesLowerObj,
                summary: null,
                total: 0
              },
              expired: {
                ...coursesLowerObj,
                summary: null,
                total: 0
              }
						};
					}
          if(course in coursesLowerObj) {
            total[year]['hours'][course] += comp.training_hrs;
            total[year]['hours']['total'] += comp.training_hrs;
            if (comp.isCompleted) {
              total[year]['completed'][course] += 1;
              total[year]['completed']['total'] += 1;
            }else {
              if(comp.expired) {
                total[year]['expired'][course] += 1;
                total[year]['expired']['total'] += 1;
              }else {
                total[year]['notCompleted'][course] += 1;
                total[year]['notCompleted']['total'] += 1;
              }
            }
          }
				});
			})
		});
	});

	for (const year in total) {
		const yearTupple = year.split("_");
		// skip first itteration
		if (yearTupple[1] === '1') continue;

		if (yearTupple[1]) {
			const prevIndex = `${yearTupple[0]}_${(+yearTupple[1] - 1)}`;

			const prevComp = total[prevIndex].completed;
			total[year].completed.summary = populateSummary(total[year].completed, prevComp, coursesLowerObj);
			total[year].completed.summary.total = (total[year].completed.summary?.total || 0) + (total[year].completed.total + (prevComp.summary?.total || prevComp.total));

      // not completed
			const prevNotComp = total[prevIndex].notCompleted;
			total[year].notCompleted.summary = populateSummary(total[year].notCompleted, prevNotComp, coursesLowerObj);
			total[year].notCompleted.summary.total = (total[year].notCompleted.summary?.total || 0) + (total[year].notCompleted.total + (prevNotComp.summary?.total || prevNotComp.total));
      
      // not completed
			const prevExp = total[prevIndex].expired;
			total[year].expired.summary = populateSummary(total[year].expired, prevExp, coursesLowerObj);
			total[year].expired.summary.total = (total[year].expired.summary?.total || 0) + (total[year].expired.total + (prevExp.summary?.total || prevExp.total));

			const prevHours = total[prevIndex].hours;
			total[year].hours.summary = populateSummary(total[year].hours, prevHours, coursesLowerObj)
			total[year].hours.summary.total = (total[year].hours.summary?.total || 0) + (total[year].hours.total + (prevHours.summary?.total || prevHours.total));
		}
	}

	return (
		<Document title={"Training Matrix"}>
			{pages.map((page, index) => (
				page.map(([year, data], pageIdx, pageArr) => {
					const y = year.split("_")[0];
					return (
						<Page size="A3" style={styles.page} key={year + pageIdx}>
							<View>
								<View style={{ marginBottom: 12 }}>
									<View style={styles.mb16}>
										<View style={styles.gridContainer}>
											<Image source="/logo/Fiafi-logo.png" style={{ height: 48, padding: 2 }} />
										</View>
										<View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
											<Text style={styles.h2}>{`Training Matrix - YEAR ${y}`}</Text>
										</View>
									</View>
								</View>

                {pageIdx === 0 && (
                  <View>
                    <View style={{ marginBottom: 32 }}>
                      <View style={styles.gridContainer}>
                        <View style={{ width: '14%' }} />
                        <View style={{ width: '72%' }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 8 }}>
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
                    </View>
                  </View>
                )}

								<View style={{ marginLeft: 34 }}>
									<Text style={[styles.h4, { color: '#305496' }]}>{dates[y]}, {y}</Text>
								</View>
								<View style={{ alignItems: 'center', justifyContent: 'center' }}>
									<MatrixTable pageIndex={pageIdx} titles={titles} data={data} year={year} total={total} pageLength={pageArr.length} />
								</View>
							</View>
							<View style={[styles.footer]}>
								<View style={[styles.gridContainer]}>
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
							</View>
						</Page>
					)
				})
			))}
		</Document >
	)
}


function MatrixTable ({ titles, data, year, total, pageIndex, pageLength }) {
	return (
		<View style={[styles.gridContainer, { justifyContent: 'center' }]}>
			<View>
				<View style={styles.tableHead}>
					<View style={[styles.tableHeadCell, { borderTop: '1px solid #000', backgroundColor: '#305496', minWidth: 26, width: 26 }]}>
						<View style={styles.tableHeadCellWrapper}>
							<Text style={[styles.tableHeadCellText, { padding: 0 }]}>S.no</Text>
						</View>
					</View>
					<View style={[styles.tableHeadCell, { borderTop: '1px solid #000', backgroundColor: '#305496', width: 120 }]}>
						<View style={styles.tableHeadCellWrapper}>
							<Text style={styles.tableHeadCellText}>Name</Text>
						</View>
					</View>
					<View style={[styles.tableHeadCell, { borderTop: '1px solid #000', backgroundColor: '#305496', width: 90 }]}>
						<View style={styles.tableHeadCellWrapper}>
							<Text style={styles.tableHeadCellText}>Position</Text>
						</View>
					</View>
					{titles?.map((title, idx) => (
						<View style={[styles.tableHeadCell, { borderTop: '1px solid #000', backgroundColor: '#305496', width: 30 }]} key={idx}>
							<View style={styles.tableTextVerticialWrapper}>
								<Text style={[styles.tableHeadCellText, styles.tableTextVerticial]}>{title}</Text>
							</View>
						</View>
					))}

          {/* TOTAL PER ROW */}
          <View style={[styles.tableHeadCell, { borderTop: '1px solid #000', backgroundColor: '#305496', width: 20, minWidth: 20, padding: 0 }]}>
            <View style={styles.tableTextVerticialWrapper}>
              <Text style={[styles.tableHeadCellText, styles.tableTextVerticial, { padding: 0 }]}>Course Completed</Text>
            </View>
          </View>

				</View>
				{(data || [])?.map((d, i, dataArr) => {
          let sNo = 0;
          if(pageIndex === 0) {
            sNo = pageIndex * FIRST_AND_LAST_PAGE + (i + 1);
          }else {
            sNo = pageIndex * PER_PAGE - (PER_PAGE - FIRST_AND_LAST_PAGE) + (i + 1);
          }
					return (
						<View key={i} style={styles.tableBody}>
							<View style={[styles.tableHeadCell, { justifyContent: 'center', minWidth: 26, width: 26, height: 16, padding: 0 }]}>
								<Text style={[styles.tableHeadCellText, { fontWeight: 500, color: "#000", paddingBottom: 0, paddingTop: 0.5, paddingLeft: 1 }]}>{sNo}</Text>
							</View>
							<View style={[styles.tableHeadCell, { justifyContent: 'center', width: 120, height: 16, padding: 0 }]}>
								<Text style={[styles.tableHeadCellText, { fontWeight: 500, color: "#000", paddingBottom: 0, paddingTop: 0.5, paddingLeft: 1, textTransform: 'capitalize' }]}>{d.fullName}</Text>
							</View>
							<View style={[styles.tableHeadCell, { justifyContent: 'center', width: 90, height: 16, padding: 0 }]}>
								<Text style={[styles.tableHeadCellText, { fontWeight: 500, color: "#000", paddingBottom: 0, paddingTop: 0.5, paddingLeft: 1, textTransform: 'capitalize' }]}>{d.position}</Text>
							</View>
							{titles?.map((title, idx) => {
								const course = d?.data?.find(d => d?.courseName?.trim()?.toLowerCase() === title?.trim()?.toLowerCase());
								return (
									<View style={[styles.tableHeadCell, { backgroundColor: course ? (course.expired ? '#d50000' : (course.isCompleted ? '#808080' : '#ffa500')) : (POSITIONS[d.position] || 'transparent'), width: 30, height: 16, padding: 0, paddingTop: 1.5 }]} key={idx}>
									</View>
								)
							})}
              <View style={[{ minWidth: 20, width: 20, height: 16, padding: 0, borderRight: '1px solid #000', borderBottom: '1px solid #000' }]}>
								<Text style={[styles.tableHeadCellText, { fontWeight: 500, color: "#000", paddingTop: 0.5, textAlign: 'center' }]}>{d?.completed_count}</Text>
							</View>
              {(dataArr.length - 1 === i) && (
                <View style={[{ minWidth: 50, width: 50, height: 16, padding: 0 }]}>
                  <Text style={[styles.tableHeadCellText, { fontWeight: 500, color: "#000", paddingLeft: 4, paddingTop: 0.5 }]}>{total[year]?.completed?.total}</Text>
                </View>
              )}
						</View>
					)
				})}

				{/* Total Hours */}
				<View style={{ flexDirection: 'row' }}>
					<View style={[styles.tableHeadCell, { border: 0, justifyContent: 'center', minWidth: 26, width: 26, height: 32, padding: 0 }]}></View>
					<View style={[styles.tableHeadCell, { border: 0, justifyContent: 'center', width: 120, height: 32, padding: 0 }]}>
						<Text style={[styles.tableHeadCellText, { paddingVertical: 0, paddingLeft: 4, fontSize: 9, color: "#000", fontWeight: 700 }]}>Total Hours</Text>
					</View>
					<View style={[styles.tableHeadCell, { border: 0, justifyContent: 'center', width: 90, height: 32, padding: 0 }]}/>
					{titles?.map((title, idx) => (
						<View style={[styles.tableHeadCell, { border: 0, width: 30, height: 32, padding: 0 }]} key={idx}>
							<Text style={[styles.tableHeadCellText, { paddingVertical: 0, paddingLeft: 4, fontSize: 9, textAlign: 'center', color: "#000", fontWeight: 700 }]}>{total[year]['hours'][title.toLowerCase()] || 0}</Text>
              {(idx + 1) === titles.length && (
                <Text style={[styles.tableHeadCellText, { paddingVertical: 0, paddingLeft: 4, fontSize: 9, textAlign: 'center', color: "#000", fontWeight: 700 }]}>{(total[year]['hours']?.total || 0).toLocaleString()}</Text>
              )}
						</View>
					))}
				</View>
				{(total[year]['hours']['summary'] && ((pageLength - 1) === pageIndex)) && (
					<View style={{ flexDirection: 'row', marginVertical: 2 }}>
						<View style={[styles.tableHeadCell, { border: 0, justifyContent: 'center', minWidth: 26, width: 26, height: 32, padding: 0 }]}></View>
						<View style={[styles.tableHeadCell, { border: 0, justifyContent: 'center', width: 120, height: 32, padding: 0 }]}>
							<Text style={[styles.tableHeadCellText, { paddingVertical: 0, paddingLeft: 4, fontSize: 9, color: "#000", fontWeight: 700 }]}>Summary Total</Text>
						</View>

						<View style={[styles.tableHeadCell, { border: 0, justifyContent: 'center', width: 90, height: 32, padding: 0 }]}/>
						{titles?.map((title, idx) => (
							<View style={[styles.tableHeadCell, { border: 0, width: 30, height: 32, padding: 0 }]} key={idx}>
								<Text style={[styles.tableHeadCellText, { paddingVertical: 0, fontSize: 9, textAlign: 'center', paddingLeft: 4, color: "#000", fontWeight: 700 }]}>{total[year]['hours']['summary'][title.toLowerCase()] || 0}</Text>
                {(idx + 1) === titles.length && (
                  <Text style={[styles.tableHeadCellText, { paddingVertical: 0, paddingLeft: 4, fontSize: 9, textAlign: 'center', fontWeight: 700, color: "#000" }]}>{(total[year]['hours']['summary'].total || 0).toLocaleString()}</Text>
                )}
							</View>
						))}
					</View>
				)}

				<View style={{ width: '100%', borderTop: '1px solid #ccc', marginBottom: 8 }} />

				{/* Total Completed */}
				<View style={{ flexDirection: 'row' }}>
					<View style={[styles.tableHeadCell, { border: 0, justifyContent: 'center', minWidth: 26, width: 26, height: 32, padding: 0 }]}></View>
					<View style={[styles.tableHeadCell, { border: 0, justifyContent: 'center', width: 120, height: 32, padding: 0 }]}>
						<Text style={[styles.tableHeadCellText, { paddingVertical: 0, paddingLeft: 4, fontSize: 9, color: "#000", fontWeight: 700 }]}>Total Personel Per Course Completed</Text>
					</View>

					<View style={[styles.tableHeadCell, { border: 0, justifyContent: 'center', width: 90, height: 18, padding: 0 }]}/>
					{titles?.map((title, idx) => (
						<View style={[styles.tableHeadCell, { border: 0, width: 30, height: 32, padding: 0 }]} key={idx}>
							<Text style={[styles.tableHeadCellText, { paddingVertical: 0, paddingLeft: 4, fontSize: 9, textAlign: 'center', color: "#000", fontWeight: 700 }]}>{total[year]['completed'][title.toLowerCase()] || 0}</Text>
              {(idx + 1) === titles.length && (
               <Text style={[styles.tableHeadCellText, { paddingVertical: 0, paddingLeft: 4, fontSize: 9, textAlign: 'center', fontWeight: 700, color: "#000" }]}>{(total[year]['completed']?.total || 0).toLocaleString()}</Text>
              )}
						</View>
					))}
				</View>
				{total[year].completed.summary  && ((pageLength - 1) === pageIndex) && (
					<View style={{ flexDirection: 'row', marginVertical: 2 }}>
						<View style={[styles.tableHeadCell, { border: 0, justifyContent: 'center', minWidth: 26, width: 26, height: 32, padding: 0 }]}></View>
						<View style={[styles.tableHeadCell, { border: 0, justifyContent: 'center', width: 120, height: 32, padding: 0 }]}>
							<Text style={[styles.tableHeadCellText, { paddingVertical: 0, paddingLeft: 4, fontSize: 9, color: "#000", fontWeight: 700 }]}>Summary Total</Text>
						</View>

						<View style={[styles.tableHeadCell, { border: 0, justifyContent: 'center', width: 90, height: 18, padding: 0 }]}/>
						{titles?.map((title, idx) => (
							<View style={[styles.tableHeadCell, { border: 0, width: 30, height: 32, padding: 0 }]} key={idx}>
								<Text style={[styles.tableHeadCellText, { paddingVertical: 0, fontSize: 9, textAlign: 'center', paddingLeft: 4, color: "#000", fontWeight: 700 }]}>{total[year].completed.summary[title.toLowerCase()] || 0}</Text>
                {(idx + 1) === titles.length && (
                  <Text style={[styles.tableHeadCellText, { paddingVertical: 0, paddingLeft: 4, fontSize: 9, textAlign: 'center', fontWeight: 700, color: "#000" }]}>{(total[year].completed.summary?.total || 0).toLocaleString()}</Text>
                )}
							</View>
						))}
					</View>
				)}

				<View style={{ width: '100%', borderTop: '1px solid #ccc', marginBottom: 8 }} />

				{/* Total Not Completed */}
				<View style={{ flexDirection: 'row' }}>
					<View style={[styles.tableHeadCell, { border: 0, justifyContent: 'center', minWidth: 26, width: 26, height: 32, padding: 0 }]}></View>
					<View style={[styles.tableHeadCell, { border: 0, justifyContent: 'center', width: 100, height: 32, padding: 0 }]}>
						<Text style={[styles.tableHeadCellText, { paddingVertical: 0, paddingLeft: 4, fontSize: 9, color: "#000", fontWeight: 700 }]}>Total Personel w/Inc. Requirements</Text>
					</View>

					<View style={[styles.tableHeadCell, { border: 0, justifyContent: 'center', width: 110, height: 18, padding: 0 }]}/>
					{titles?.map((title, idx) => (
						<View style={[styles.tableHeadCell, { border: 0, width: 30, height: 32, padding: 0 }]} key={idx}>
							<Text style={[styles.tableHeadCellText, { paddingVertical: 0, paddingLeft: 4, fontSize: 9, textAlign: 'center', color: "#000", fontWeight: 700 }]}>{total[year].notCompleted[title.toLowerCase()] || 0}</Text>
              {(idx + 1) === titles.length && (
               <Text style={[styles.tableHeadCellText, { paddingVertical: 0, paddingLeft: 4, fontSize: 9, textAlign: 'center', fontWeight: 700, color: "#000" }]}>{(total[year].notCompleted?.total || 0).toLocaleString()}</Text>
              )}
						</View>
					))}
				</View>
				{total[year].notCompleted.summary && ((pageLength - 1) === pageIndex) && (
					<View style={{ flexDirection: 'row', marginVertical: 2 }}>
						<View style={[styles.tableHeadCell, { border: 0, justifyContent: 'center', minWidth: 26, width: 26, height: 32, padding: 0 }]}></View>
						<View style={[styles.tableHeadCell, { border: 0, justifyContent: 'center', width: 120, height: 32, padding: 0 }]}>
							<Text style={[styles.tableHeadCellText, { paddingVertical: 0, paddingLeft: 4, fontSize: 9, color: "#000", fontWeight: 700 }]}>Summary Total</Text>
						</View>

						<View style={[styles.tableHeadCell, { border: 0, justifyContent: 'center', width: 90, height: 18, padding: 0 }]}/>
						{titles?.map((title, idx) => (
							<View style={[styles.tableHeadCell, { border: 0, width: 30, height: 32, padding: 0 }]} key={idx}>
								<Text style={[styles.tableHeadCellText, { paddingVertical: 0, fontSize: 9, textAlign: 'center', paddingLeft: 4, color: "#000", fontWeight: 700 }]}>{total[year].notCompleted.summary[title.toLowerCase()] || 0}</Text>
                {(idx + 1) === titles.length && (
                  <Text style={[styles.tableHeadCellText, { paddingVertical: 0, paddingLeft: 4, fontSize: 9, textAlign: 'center', fontWeight: 700, color: "#000" }]}>{(total[year].notCompleted.summary?.total || 0).toLocaleString()}</Text>
                )}
							</View>
						))}
					</View>
				)}

      {/* <View style={{ width: '100%', borderTop: '1px solid #ccc', marginBottom: 8 }} /> */}

      {/* Total Expired */}
      {/* <View style={{ flexDirection: 'row' }}>
        <View style={[styles.tableHeadCell, { border: 0, justifyContent: 'center', minWidth: 26, width: 26, height: 32, padding: 0 }]}></View>
        <View style={[styles.tableHeadCell, { border: 0, justifyContent: 'center', width: 140, height: 32, padding: 0 }]}>
          <Text style={[styles.tableHeadCellText, { paddingVertical: 0, paddingLeft: 4, fontSize: 9, color: "#000", fontWeight: 700 }]}>Total Expired Training</Text>
        </View>

        <View style={[styles.tableHeadCell, { border: 0, justifyContent: 'center', width: 70, height: 18, padding: 0 }]}/>
        {titles?.map((title, idx) => (
          <View style={[styles.tableHeadCell, { border: 0, width: 30, height: 32, padding: 0 }]} key={idx}>
            <Text style={[styles.tableHeadCellText, { paddingVertical: 0, paddingLeft: 4, fontSize: 9, textAlign: 'center', color: "#000", fontWeight: 700 }]}>{total[year].expired[title.toLowerCase()] || 0}</Text>
            {(idx + 1) === titles.length && (
            <Text style={[styles.tableHeadCellText, { paddingVertical: 0, paddingLeft: 4, fontSize: 9, textAlign: 'center', fontWeight: 700, color: "#000" }]}>{(total[year].expired?.total || 0).toLocaleString()}</Text>
            )}
          </View>
        ))}
      </View>
      {total[year].expired.summary && ((pageLength - 1) === pageIndex)  && (
        <View style={{ flexDirection: 'row', marginVertical: 2 }}>
          <View style={[styles.tableHeadCell, { border: 0, justifyContent: 'center', minWidth: 26, width: 26, height: 32, padding: 0 }]}></View>
          <View style={[styles.tableHeadCell, { border: 0, justifyContent: 'center', width: 120, height: 32, padding: 0 }]}>
            <Text style={[styles.tableHeadCellText, { paddingVertical: 0, paddingLeft: 4, fontSize: 9, color: "#000", fontWeight: 700 }]}>Summary Total</Text>
          </View>

          <View style={[styles.tableHeadCell, { border: 0, justifyContent: 'center', width: 90, height: 18, padding: 0 }]}/>
          {titles?.map((title, idx) => (
            <View style={[styles.tableHeadCell, { border: 0, width: 30, height: 32, padding: 0 }]} key={idx}>
              <Text style={[styles.tableHeadCellText, { paddingVertical: 0, fontSize: 9, textAlign: 'center', paddingLeft: 4, color: "#000", fontWeight: 700 }]}>{total[year].expired.summary[title.toLowerCase()] || 0}</Text>
              {(idx + 1) === titles.length && (
                <Text style={[styles.tableHeadCellText, { paddingVertical: 0, paddingLeft: 4, fontSize: 9, textAlign: 'center', fontWeight: 700, color: "#000" }]}>{(total[year].expired.summary?.total || 0).toLocaleString()}</Text>
              )}
            </View>
          ))}
        </View>
      )} */}

			</View>
		</View >
	)
}