import { useMemo } from "react";
import styles, { colors } from "@/lib/pdfStyles";
import { Page, View, Text, Image, Document } from "@react-pdf/renderer";
import { format, isSameDay, isSameMonth } from "date-fns";
import { fDate } from "@/utils/formatTime";

const TODAY = new Date();
const FORMATTED_DATE = format(TODAY, "MM/dd/yy");
const YEAR = TODAY.getFullYear();

const MAX_ITEM = 25;

export function PDF({ data = [], logo }) {
    const { total, summary, dateTupple, pdfData } = useMemo(() => {
        const total = {};
        const summary = {};
        const dateTupple = [0, 0];
        const pdfData = [];
        if (data.length > 0) {
            let submitted = 0;
            let notSubmitted = 0;
            let summarySubmitted = 0;
            let summaryNotSubmitted = 0;

            dateTupple[0] = new Date(data[0].date_issued).getTime();
            dateTupple[1] = new Date(data[0].date_issued).getTime();

            for (let i = 0; i < data.length; i++) {
                const timestamps = new Date(data[i].date_issued).getTime();

                if (timestamps < dateTupple[0]) {
                    dateTupple[0] = timestamps;
                }

                if (timestamps > dateTupple[1]) {
                    dateTupple[1] = timestamps;
                }
                for (let j = 0; j < data[i].assigned.length; j++) {
                    const ass_id = data[i].assigned[j].id;
                    const ass = data[i].assigned[j];
                    const originator = data[i].fullname;
                    delete ass.id;
                    const newPdfData = {
                        ...data[i],
                        ass_id,
                        originator,
                        ...ass,
                    };
                    delete newPdfData.assigned;
                    pdfData.push(newPdfData);
                }
            }

            pdfData.forEach((dt, i) => {
                if (dt.status) {
                    submitted++;
                } else {
                    notSubmitted++;
                }
                if ((i + 1) % MAX_ITEM === 0 || i === pdfData.length - 1) {
                    total[i] = {
                        submitted,
                        notSubmitted,
                    };
                    summarySubmitted += submitted;
                    summaryNotSubmitted += notSubmitted;
                    summary[i] = {
                        submitted: summarySubmitted,
                        notSubmitted: summaryNotSubmitted,
                    };
                    submitted = 0;
                    notSubmitted = 0;
                }
            });

            return { total, summary, dateTupple, pdfData };
        }

        return { total, summary, dateTupple: [], pdfData: [] };
    }, [data]);

    const dateFormattedString = dateLabel(dateTupple[0], dateTupple[1]);
    return (
        <Document title="Toolbox Talk Tracker">
            <Page size="A4" style={styles.page}>
                <View style={styles.mb8} fixed>
                    <View style={[styles.gridContainer, styles.mb8]}>
                        <Image src={logo} style={{ height: 32, padding: 2 }} />
                    </View>
                    <View
                        style={{
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "row",
                        }}
                    >
                        <Text style={[styles.h4, { color: "#616161" }]}>
                            Toolbox Talk Tracker
                        </Text>
                    </View>
                </View>

                <View fixed style={styles.bm}>
                    <Text
                        style={{
                            fontSize: 8,
                            fontWeight: 600,
                            fontFamily: "Open Sans",
                        }}
                    >
                        {dateFormattedString}
                    </Text>
                </View>

                {pdfData.map((row, idx) => {
                    const prevId = pdfData[idx - 1]?.id;
                    const nextId = pdfData[idx + 1]?.id;
                    const isFirst = row.id !== prevId;
                    const isLast = row.id !== nextId;
                    const maxItem = (idx + 1) % MAX_ITEM === 0;
                    const isCutOff = maxItem && nextId === row.id;
                    const cut = total[idx - 1] && summary[idx - 1];
                    return (
                        <View key={idx} break={cut}>
                            <View wrap={false}>
                                <View style={styles.tableBody}>
                                    <View style={styles.tableRow}>
                                        {isFirst ? (
                                            <>
                                                <View
                                                    style={[
                                                        styles.br,
                                                        {
                                                            width: 96,
                                                        },
                                                    ]}
                                                >
                                                    <View
                                                        style={[
                                                            styles.flexCenter,
                                                            styles.tableCell,
                                                        ]}
                                                    >
                                                        <Text
                                                            style={
                                                                styles.semibold
                                                            }
                                                        >
                                                            {row.form_number}
                                                        </Text>
                                                    </View>
                                                    <View
                                                        style={[
                                                            styles.flexCenter,
                                                            styles.tableCell,
                                                            styles.bm0,
                                                            nextId !== row.id &&
                                                                styles.bm,
                                                        ]}
                                                    />
                                                </View>
                                                <View
                                                    style={[
                                                        styles.br,
                                                        {
                                                            maxWidth: 84,
                                                            minWidth: 84,
                                                        },
                                                    ]}
                                                >
                                                    <View
                                                        style={[
                                                            styles.flexCenter,
                                                            styles.tableCell,
                                                        ]}
                                                    >
                                                        <Text
                                                            style={
                                                                styles.semibold
                                                            }
                                                        >
                                                            Originator
                                                        </Text>
                                                    </View>
                                                    <View
                                                        style={[
                                                            styles.flexCenter,
                                                            styles.tableCell,
                                                        ]}
                                                    >
                                                        <Text
                                                            style={
                                                                styles.tableCellText
                                                            }
                                                        >
                                                            {row.originator}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </>
                                        ) : (
                                            <>
                                                <View
                                                    style={[
                                                        styles.br,
                                                        {
                                                            width: 96,
                                                        },
                                                    ]}
                                                >
                                                    <View
                                                        style={[
                                                            styles.flexCenter,
                                                            styles.tableCell,
                                                            styles.bm0,
                                                            (isCutOff ||
                                                                isLast) &&
                                                                styles.bm,
                                                        ]}
                                                    />
                                                </View>
                                                <View
                                                    style={[
                                                        styles.br,
                                                        {
                                                            maxWidth: 84,
                                                            minWidth: 84,
                                                        },
                                                    ]}
                                                >
                                                    <View
                                                        style={[
                                                            styles.flexCenter,
                                                            styles.tableCell,
                                                            styles.bm0,
                                                            (isCutOff ||
                                                                isLast) &&
                                                                styles.bm,
                                                        ]}
                                                    />
                                                </View>
                                            </>
                                        )}

                                        <View
                                            style={[
                                                styles.br,
                                                {
                                                    maxWidth: 42,
                                                    minWidth: 42,
                                                },
                                            ]}
                                        >
                                            {isFirst && (
                                                <View
                                                    style={[
                                                        styles.flexCenter,
                                                        styles.tableCell,
                                                    ]}
                                                >
                                                    <Text
                                                        style={styles.semibold}
                                                    >
                                                        Date
                                                    </Text>
                                                </View>
                                            )}
                                            <View
                                                style={[
                                                    styles.flexCenter,
                                                    styles.tableCell,
                                                ]}
                                            >
                                                <Text
                                                    style={styles.tableCellText}
                                                >
                                                    {fDate(
                                                        row.date_issued,
                                                        "M/d/yyyy"
                                                    )}
                                                </Text>
                                            </View>
                                        </View>

                                        <View
                                            style={[
                                                styles.br,
                                                {
                                                    maxWidth: 65,
                                                    minWidth: 65,
                                                },
                                            ]}
                                        >
                                            {isFirst && (
                                                <View
                                                    style={[
                                                        styles.flexCenter,
                                                        styles.tableCell,
                                                    ]}
                                                >
                                                    <Text
                                                        style={styles.semibold}
                                                    >
                                                        Location
                                                    </Text>
                                                </View>
                                            )}
                                            <View
                                                style={[
                                                    styles.flexCenter,
                                                    styles.tableCell,
                                                ]}
                                            >
                                                <Text
                                                    style={styles.tableCellText}
                                                >
                                                    {row.location}
                                                </Text>
                                            </View>
                                        </View>

                                        <View
                                            style={[
                                                styles.br,
                                                {
                                                    maxWidth: 63,
                                                    minWidth: 63,
                                                },
                                            ]}
                                        >
                                            {isFirst && (
                                                <View
                                                    style={[
                                                        styles.flexCenter,
                                                        styles.tableCell,
                                                    ]}
                                                >
                                                    <Text
                                                        style={styles.semibold}
                                                    >
                                                        Exact Location
                                                    </Text>
                                                </View>
                                            )}
                                            <View
                                                style={[
                                                    styles.flexCenter,
                                                    styles.tableCell,
                                                ]}
                                            >
                                                <Text
                                                    style={styles.tableCellText}
                                                >
                                                    {row.exact_location}
                                                </Text>
                                            </View>
                                        </View>

                                        <View
                                            style={[
                                                styles.br,
                                                {
                                                    maxWidth: 84,
                                                    minWidth: 84,
                                                },
                                            ]}
                                        >
                                            {isFirst && (
                                                <View
                                                    style={[
                                                        styles.flexCenter,
                                                        styles.tableCell,
                                                    ]}
                                                >
                                                    <Text
                                                        style={styles.semibold}
                                                    >
                                                        PA
                                                    </Text>
                                                </View>
                                            )}
                                            <View
                                                style={[
                                                    styles.flexCenter,
                                                    styles.tableCell,
                                                ]}
                                            >
                                                <Text
                                                    style={styles.tableCellText}
                                                >
                                                    {row.fullname}
                                                </Text>
                                            </View>
                                        </View>

                                        <View
                                            style={[
                                                styles.br,
                                                {
                                                    maxWidth: 84,
                                                    minWidth: 84,
                                                },
                                            ]}
                                        >
                                            {isFirst && (
                                                <View
                                                    style={[
                                                        styles.flexCenter,
                                                        styles.tableCell,
                                                    ]}
                                                >
                                                    <Text
                                                        style={styles.semibold}
                                                    >
                                                        Witness
                                                    </Text>
                                                </View>
                                            )}
                                            <View
                                                style={[
                                                    styles.flexCenter,
                                                    styles.tableCell,
                                                ]}
                                            >
                                                <Text
                                                    style={styles.tableCellText}
                                                >
                                                    {row.witness}
                                                </Text>
                                            </View>
                                        </View>

                                        <View
                                            style={[
                                                styles.br,
                                                {
                                                    maxWidth: 52,
                                                    minWidth: 52,
                                                },
                                            ]}
                                        >
                                            {isFirst && (
                                                <View
                                                    style={[
                                                        styles.flexCenter,
                                                        styles.tableCell,
                                                    ]}
                                                >
                                                    <Text
                                                        style={styles.semibold}
                                                    >
                                                        TBT Status
                                                    </Text>
                                                </View>
                                            )}
                                            <View
                                                style={[
                                                    styles.flexCenter,
                                                    styles.tableCell,
                                                    {
                                                        backgroundColor:
                                                            row.status
                                                                ? colors.successMain
                                                                : colors.errorMain,
                                                    },
                                                ]}
                                            >
                                                <Text
                                                    style={[
                                                        styles.tableCellText,
                                                        styles.semibold,
                                                        {
                                                            paddingRight: 2,
                                                            paddingLeft: 2,
                                                            color: "#ffffff",
                                                        },
                                                    ]}
                                                >
                                                    {row.status
                                                        ? "Submitted"
                                                        : "Not Submitted"}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                {isLast && (
                                    <View>
                                        <View style={styles.tableRow}>
                                            <View
                                                style={[
                                                    styles.bgGray,
                                                    styles.bl,
                                                    styles.br,
                                                    styles.bm,
                                                    styles.w1,
                                                    {
                                                        minHeight: 12,
                                                    },
                                                ]}
                                            />
                                        </View>
                                    </View>
                                )}
                            </View>

                            <TableTotalFooter
                                dataLength={pdfData.length}
                                i={idx}
                                total={total}
                                summary={summary}
                            />
                        </View>
                    );
                })}

                <View style={[styles.gridContainer, styles.footer]} fixed>
                    <View style={styles.col4}>
                        <Text
                            style={[
                                styles.bold,
                                {
                                    fontSize: 7,
                                    textAlign: "left",
                                    color: "#616161",
                                },
                            ]}
                        >
                            Uncontrolled Copy if Printed
                        </Text>
                    </View>
                    <View style={styles.col6}>
                        <Text
                            style={[
                                styles.bold,
                                {
                                    fontSize: 7,
                                    textAlign: "center",
                                    color: "#616161",
                                },
                            ]}
                        >
                            &copy; FIAFI Group Company, {YEAR}. All Rights
                            Reserved.
                        </Text>
                    </View>
                    <View style={styles.col4}>
                        <Text
                            style={[
                                styles.bold,
                                {
                                    fontSize: 7,
                                    textAlign: "right",
                                    color: "#616161",
                                },
                            ]}
                            render={(params) => {
                                return `${FORMATTED_DATE} Page ${params.pageNumber} / ${params.totalPages}`;
                            }}
                        ></Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
}

function TableTotalFooter({ dataLength, i, total, summary }) {
    if (dataLength === 0 || i === 0 || (!total[i] && !summary[i])) return null;

    if (dataLength <= MAX_ITEM) {
        return (
            <View style={{ marginTop: 32, marginBottom: 40 }}>
                <SummaryTotal
                    submitted={summary[i].submitted}
                    notSubmitted={summary[i].notSubmitted}
                />
            </View>
        );
    }

    return (
        <View style={{ marginTop: 32, marginBottom: 40 }}>
            <Total
                submitted={total[i].submitted}
                notSubmitted={total[i].notSubmitted}
            />
            <SummaryTotal
                submitted={summary[i].submitted}
                notSubmitted={summary[i].notSubmitted}
            />
            <View style={{ height: 30 }} />
        </View>
    );
}

function Total({ submitted = 0, notSubmitted = 0 }) {
    return (
        <View>
            {/* TOTAL SUBMITTED */}
            <View
                style={[
                    styles.tableFooter,
                    { borderBottom: "0.5px solid #ffffff" },
                ]}
            >
                <View
                    style={{
                        minWidth: 518,
                        maxWidth: 518,
                        borderRight: 0,
                    }}
                >
                    <Text style={[styles.tableTotalText, styles.pl8]}>
                        Total Submitted
                    </Text>
                </View>
                <View
                    style={{
                        minWidth: 52,
                        maxWidth: 52,
                    }}
                >
                    <Text
                        style={[styles.tableTotalText, { textAlign: "center" }]}
                    >
                        {submitted}
                    </Text>
                </View>
            </View>
            {/* TOTAL NOT SUBMITTED */}
            <View style={styles.tableFooter}>
                <View style={styles.tableFooter}>
                    <View
                        style={[
                            {
                                minWidth: 518,
                                maxWidth: 518,
                                borderRight: 0,
                            },
                        ]}
                    >
                        <Text style={[styles.tableTotalText, styles.pl8]}>
                            Total Not Submitted
                        </Text>
                    </View>
                    <View
                        style={{
                            minWidth: 52,
                            maxWidth: 52,
                        }}
                    >
                        <Text
                            style={[
                                styles.tableTotalText,
                                { textAlign: "center" },
                            ]}
                        >
                            {notSubmitted}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

function SummaryTotal({ submitted = 0, notSubmitted = 0 }) {
    return (
        <View>
            <View style={[styles.mt8, styles.mb8]}>
                <Text
                    style={[
                        styles.h6,
                        {
                            color: "#0a0a0a",
                            lineHeight: 1,
                        },
                    ]}
                >
                    Summary Total:
                </Text>
            </View>
            {/* SUMMARY TOTAL SUBMITTED */}
            <View
                style={[
                    styles.tableFooter,
                    { borderBottom: "0.5px solid #ffffff" },
                ]}
            >
                <View
                    style={{
                        minWidth: 518,
                        maxWidth: 518,
                        borderRight: 0,
                    }}
                >
                    <Text style={[styles.tableTotalText, styles.pl8]}>
                        Summary Total Submitted
                    </Text>
                </View>
                <View
                    style={{
                        minWidth: 52,
                        maxWidth: 52,
                    }}
                >
                    <Text
                        style={[styles.tableTotalText, { textAlign: "center" }]}
                    >
                        {submitted}
                    </Text>
                </View>
            </View>
            {/* SUMMARY TOTAL NOT SUBMITTED */}
            <View style={styles.tableFooter}>
                <View
                    style={{
                        minWidth: 518,
                        maxWidth: 518,
                        borderRight: 0,
                    }}
                >
                    <Text style={[styles.tableTotalText, styles.pl8]}>
                        Summary Not Total Submitted
                    </Text>
                </View>
                <View
                    style={{
                        minWidth: 52,
                        maxWidth: 52,
                    }}
                >
                    <Text
                        style={[styles.tableTotalText, { textAlign: "center" }]}
                    >
                        {notSubmitted}
                    </Text>
                </View>
            </View>
        </View>
    );
}

const dateLabel = (startDate, endDate) => {
    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);

        const startDateYear = start.getFullYear();
        const endDateYear = end.getFullYear();

        const isSameYear = startDateYear === endDateYear;

        if (isSameYear) {
            const isSameDays = isSameDay(start, end);
            const isSameMonths = isSameMonth(start, end);
            return isSameMonths
                ? isSameDays
                    ? format(end, "MMMM dd, yyyy")
                    : `${format(start, "MMMM dd")}-${format(end, "dd, yyyy")}`
                : `${format(start, "MMMM dd")} - ${format("MMMM dd, yyyy")}`;
        } else {
            return `${format(start, "MMMM dd, yyyy")}-${format(
                end,
                "MMMM dd, yyyy"
            )}`;
        }
    }
    return "";
};
