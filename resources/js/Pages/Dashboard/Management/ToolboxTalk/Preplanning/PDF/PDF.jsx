import styles, { colors } from "./pdfStyles";
import { Page, View, Text, Image, Document } from "@react-pdf/renderer";
import { format, isSameDay, isSameMonth } from "date-fns";
import { fDate } from "@/utils/formatTime";

const TODAY = new Date();
const FORMATTED_DATE = format(TODAY, "MM/dd/yy");
const YEAR = TODAY.getFullYear();

const MAX_ITEM = 38;

const TYPES = {
    1: "Civil",
    2: "Electrical",
    3: "Mechanical",
    4: "Workshop",
    5: "Office",
};

export function PDF({
    logo,
    data: { total, summary, dateTupple = [], pdfData = [] },
}) {
    // const dateFormattedString = dateTupple.length > 0 ? dateLabel(dateTupple[0], dateTupple[1]) : format("MMMM dd, yyyy");
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

                <View fixed>
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
                    return (
                        <View key={idx}>
                            <View wrap={false}>
                                <View style={styles.tableBody}>
                                    <View style={styles.tableRow}>
                                        {isFirst ? (
                                            <>
                                                <View
                                                    style={{
                                                        maxWidth: 83,
                                                        minWidth: 83,
                                                        width: "100%",
                                                    }}
                                                >
                                                    <View
                                                        style={[
                                                            styles.tableCell,
                                                            styles.bgPrimary,
                                                        ]}
                                                    >
                                                        <View
                                                            style={[
                                                                styles.textCenter,
                                                                styles.justifyCenter,
                                                                styles.w1,
                                                                styles.tableCell,
                                                            ]}
                                                        >
                                                            <Text
                                                                style={[
                                                                    styles.semibold,
                                                                    styles.textWhite,
                                                                ]}
                                                            >
                                                                {
                                                                    row.form_number
                                                                }
                                                            </Text>
                                                        </View>
                                                    </View>
                                                    <View
                                                        style={styles.tableCell}
                                                    />
                                                </View>
                                                <View
                                                    style={{
                                                        maxWidth: 80,
                                                        minWidth: 80,
                                                        width: "100%",
                                                    }}
                                                >
                                                    <View
                                                        style={[
                                                            styles.tableCell,
                                                            styles.bgPrimary,
                                                        ]}
                                                    >
                                                        <View
                                                            style={[
                                                                styles.textCenter,
                                                                styles.justifyCenter,
                                                                styles.w1,
                                                                styles.tableCell,
                                                            ]}
                                                        >
                                                            <Text
                                                                style={[
                                                                    styles.semibold,
                                                                    styles.textWhite,
                                                                ]}
                                                            >
                                                                Originator
                                                            </Text>
                                                        </View>
                                                    </View>
                                                    <View
                                                        style={styles.tableCell}
                                                    >
                                                        <View
                                                            style={[
                                                                styles.textCenter,
                                                                styles.justifyCenter,
                                                                styles.itemsCenter,
                                                                styles.flexRow,
                                                                styles.w1,
                                                                styles.tableCell,
                                                            ]}
                                                        >
                                                            {row?.originatorImg && (
                                                                <View
                                                                    style={
                                                                        styles.avatar
                                                                    }
                                                                >
                                                                    <Image
                                                                        style={
                                                                            styles.avatarImg
                                                                        }
                                                                        src={
                                                                            row.originatorImg
                                                                        }
                                                                    />
                                                                </View>
                                                            )}
                                                            <Text
                                                                style={
                                                                    styles.tableCellText
                                                                }
                                                            >
                                                                {row.originator}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </>
                                        ) : (
                                            <>
                                                <View
                                                    style={{
                                                        maxWidth: 83,
                                                        minWidth: 83,
                                                        width: "100%",
                                                    }}
                                                >
                                                    <View
                                                        style={[
                                                            styles.tableCell,
                                                        ]}
                                                    />
                                                </View>
                                                <View
                                                    style={{
                                                        maxWidth: 80,
                                                        minWidth: 80,
                                                        width: "100%",
                                                    }}
                                                >
                                                    <View
                                                        style={[
                                                            styles.tableCell,
                                                        ]}
                                                    />
                                                </View>
                                            </>
                                        )}

                                        <View
                                            style={{
                                                maxWidth: 38,
                                                minWidth: 38,
                                                width: "100%",
                                            }}
                                        >
                                            {isFirst && (
                                                <View
                                                    style={[
                                                        styles.tableCell,
                                                        styles.bgPrimary,
                                                    ]}
                                                >
                                                    <View
                                                        style={[
                                                            styles.textCenter,
                                                            styles.justifyCenter,
                                                            styles.w1,
                                                            styles.tableCell,
                                                        ]}
                                                    >
                                                        <Text
                                                            style={[
                                                                styles.semibold,
                                                                styles.textWhite,
                                                            ]}
                                                        >
                                                            Date
                                                        </Text>
                                                    </View>
                                                </View>
                                            )}
                                            <View style={styles.tableCell}>
                                                <View
                                                    style={[
                                                        styles.textCenter,
                                                        styles.justifyCenter,
                                                        styles.w1,
                                                        styles.tableCell,
                                                    ]}
                                                >
                                                    <Text
                                                        style={
                                                            styles.tableCellText
                                                        }
                                                    >
                                                        {fDate(
                                                            row.date_assigned,
                                                            "M/d/yyyy"
                                                        )}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>

                                        <View
                                            style={{
                                                maxWidth: 65,
                                                minWidth: 65,
                                                width: "100%",
                                            }}
                                        >
                                            {isFirst && (
                                                <View
                                                    style={[
                                                        styles.tableCell,
                                                        styles.bgPrimary,
                                                    ]}
                                                >
                                                    <View
                                                        style={[
                                                            styles.textCenter,
                                                            styles.justifyCenter,
                                                            styles.w1,
                                                            styles.tableCell,
                                                        ]}
                                                    >
                                                        <Text
                                                            style={[
                                                                styles.semibold,
                                                                styles.textWhite,
                                                            ]}
                                                        >
                                                            Location
                                                        </Text>
                                                    </View>
                                                </View>
                                            )}
                                            <View style={styles.tableCell}>
                                                <View
                                                    style={[
                                                        styles.textCenter,
                                                        styles.justifyCenter,
                                                        styles.w1,
                                                        styles.tableCell,
                                                    ]}
                                                >
                                                    <Text
                                                        style={
                                                            styles.tableCellText
                                                        }
                                                    >
                                                        {row.location}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>

                                        <View
                                            style={{
                                                maxWidth: 65,
                                                minWidth: 65,
                                                width: "100%",
                                            }}
                                        >
                                            {isFirst && (
                                                <View
                                                    style={[
                                                        styles.tableCell,
                                                        styles.bgPrimary,
                                                    ]}
                                                >
                                                    <View
                                                        style={[
                                                            styles.textCenter,
                                                            styles.justifyCenter,
                                                            styles.w1,
                                                            styles.tableCell,
                                                        ]}
                                                    >
                                                        <Text
                                                            style={[
                                                                styles.semibold,
                                                                styles.textWhite,
                                                            ]}
                                                        >
                                                            Exact Location
                                                        </Text>
                                                    </View>
                                                </View>
                                            )}
                                            <View style={styles.tableCell}>
                                                <View
                                                    style={[
                                                        styles.textCenter,
                                                        styles.justifyCenter,
                                                        styles.w1,
                                                        styles.tableCell,
                                                    ]}
                                                >
                                                    <Text
                                                        style={
                                                            styles.tableCellText
                                                        }
                                                    >
                                                        {row.exact_location}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>

                                        <View
                                            style={{
                                                maxWidth: 75,
                                                minWidth: 75,
                                                width: "100%",
                                            }}
                                        >
                                            {isFirst && (
                                                <View
                                                    style={[
                                                        styles.tableCell,
                                                        styles.bgPrimary,
                                                    ]}
                                                >
                                                    <View
                                                        style={[
                                                            styles.textCenter,
                                                            styles.justifyCenter,
                                                            styles.w1,
                                                            styles.tableCell,
                                                        ]}
                                                    >
                                                        <Text
                                                            style={[
                                                                styles.semibold,
                                                                styles.textWhite,
                                                            ]}
                                                        >
                                                            Conducted By
                                                        </Text>
                                                    </View>
                                                </View>
                                            )}
                                            <View style={styles.tableCell}>
                                                <View
                                                    style={[
                                                        styles.w1,
                                                        styles.tableCell,
                                                        styles.itemsCenter,
                                                        styles.flexRow,
                                                        styles.mr4,
                                                        styles.ml4,
                                                    ]}
                                                >
                                                    {row?.img && (
                                                        <View
                                                            style={
                                                                styles.avatar
                                                            }
                                                        >
                                                            <Image
                                                                style={
                                                                    styles.avatarImg
                                                                }
                                                                src={row.img}
                                                            />
                                                        </View>
                                                    )}
                                                    <Text
                                                        style={[
                                                            styles.tableCellText,
                                                            styles.textCenter,
                                                        ]}
                                                    >
                                                        {row.fullname}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>

                                        <View
                                            style={{
                                                maxWidth: 75,
                                                minWidth: 75,
                                                width: "100%",
                                            }}
                                        >
                                            {isFirst && (
                                                <View
                                                    style={[
                                                        styles.tableCell,
                                                        styles.bgPrimary,
                                                    ]}
                                                >
                                                    <View
                                                        style={[
                                                            styles.textCenter,
                                                            styles.justifyCenter,
                                                            styles.w1,
                                                            styles.tableCell,
                                                        ]}
                                                    >
                                                        <Text
                                                            style={[
                                                                styles.semibold,
                                                                styles.textWhite,
                                                            ]}
                                                        >
                                                            Witness
                                                        </Text>
                                                    </View>
                                                </View>
                                            )}
                                            <View style={styles.tableCell}>
                                                <View
                                                    style={[
                                                        styles.w1,
                                                        styles.tableCell,
                                                        styles.itemsCenter,
                                                        styles.flexRow,
                                                        styles.mr4,
                                                        styles.ml4,
                                                    ]}
                                                >
                                                    {row?.witnessImg && (
                                                        <View
                                                            style={
                                                                styles.avatar
                                                            }
                                                        >
                                                            <Image
                                                                style={
                                                                    styles.avatarImg
                                                                }
                                                                src={
                                                                    row.witnessImg
                                                                }
                                                            />
                                                        </View>
                                                    )}
                                                    <Text
                                                        style={[
                                                            styles.tableCellText,
                                                            styles.textCenter,
                                                        ]}
                                                    >
                                                        {row?.witness}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>

                                        <View
                                            style={{
                                                maxWidth: 40,
                                                minWidth: 40,
                                                width: "100%",
                                            }}
                                        >
                                            {isFirst && (
                                                <View
                                                    style={[
                                                        styles.tableCell,
                                                        styles.bgPrimary,
                                                    ]}
                                                >
                                                    <View
                                                        style={[
                                                            styles.textCenter,
                                                            styles.justifyCenter,
                                                            styles.w1,
                                                            styles.tableCell,
                                                        ]}
                                                    >
                                                        <Text
                                                            style={[
                                                                styles.semibold,
                                                                styles.textWhite,
                                                            ]}
                                                        >
                                                            TBT Type
                                                        </Text>
                                                    </View>
                                                </View>
                                            )}
                                            <View style={styles.tableCell}>
                                                <View
                                                    style={[
                                                        styles.textCenter,
                                                        styles.justifyCenter,
                                                        styles.w1,
                                                        styles.tableCell,
                                                    ]}
                                                >
                                                    <Text
                                                        style={
                                                            styles.tableCellText
                                                        }
                                                    >
                                                        {TYPES?.[
                                                            row.tbt_type
                                                        ] ?? ""}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>

                                        <View
                                            style={{
                                                maxWidth: 50,
                                                minWidth: 50,
                                                width: "100%",
                                            }}
                                        >
                                            {isFirst && (
                                                <View
                                                    style={[
                                                        styles.tableCell,
                                                        styles.bgPrimary,
                                                    ]}
                                                >
                                                    <View
                                                        style={[
                                                            styles.textCenter,
                                                            styles.justifyCenter,
                                                            styles.w1,
                                                            styles.tableCell,
                                                        ]}
                                                    >
                                                        <Text
                                                            style={[
                                                                styles.semibold,
                                                                styles.textWhite,
                                                            ]}
                                                        >
                                                            TBT Status
                                                        </Text>
                                                    </View>
                                                </View>
                                            )}
                                            <View style={styles.tableCell}>
                                                <View
                                                    style={[
                                                        styles.textCenter,
                                                        styles.justifyCenter,
                                                        styles.w1,
                                                        styles.tableCell,
                                                    ]}
                                                >
                                                    <Text
                                                        style={[
                                                            styles.tableCellText,
                                                            styles.semibold,
                                                            styles.badge,
                                                            {
                                                                paddingTop: 1,
                                                                paddingBottom: 1,
                                                                backgroundColor:
                                                                    row.status
                                                                        ? colors.successMain
                                                                        : colors.errorMain,
                                                                fontSize: 6,
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
                                </View>
                                {isLast && (
                                    <View>
                                        <View style={styles.tableRow}>
                                            <View
                                                style={[
                                                    styles.bgGray,
                                                    styles.w1,
                                                    {
                                                        minHeight: 6,
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
            <View style={{ marginTop: 32, marginBottom: 8 }}>
                <SummaryTotal
                    submitted={summary[i].submitted}
                    notSubmitted={summary[i].notSubmitted}
                />
            </View>
        );
    }

    const isLast = dataLength - 1 === i;

    return (
        <View style={{ marginTop: 32, marginBottom: isLast ? 16 : 8 }}>
            <Total
                submitted={total[i].submitted}
                notSubmitted={total[i].notSubmitted}
            />
            {dataLength - 1 === i && (
                <SummaryTotal
                    submitted={summary.submitted}
                    notSubmitted={summary.notSubmitted}
                />
            )}
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
                        width: "100%",
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
                        width: "100%",
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
                                width: "100%",
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
                            width: "100%",
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
                            fontSize: 8,
                            color: "#0a0a0a",
                            lineHeight: 1,
                        },
                    ]}
                >
                    Total TBT:
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
                        width: "100%",
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
                        width: "100%",
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
                        width: "100%",
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
                        width: "100%",
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
                : `${format(start, "MMMM dd")} - ${format(
                      end,
                      "MMMM dd, yyyy"
                  )}`;
        } else {
            return `${format(start, "MMMM dd, yyyy")}-${format(
                end,
                "MMMM dd, yyyy"
            )}`;
        }
    }
    return "";
};
