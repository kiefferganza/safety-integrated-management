import { Fragment, useMemo } from "react";
import { Page, View, Text, Image, Document } from "@react-pdf/renderer";
import styles from "./stylesPDF";
import { format, getYear, isSameDay, isSameMonth } from "date-fns";
import { fDate } from "@/utils/formatTime";

const FORMATTED_DATE = format(new Date(), "MM/dd/yy");
const YEAR = new Date().getFullYear();

const MAX_ITEM = 40;

const shortLabelDate = ([start, end]) => {
    if (start && end) {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const startDateYear = getYear(startDate);

        const endDateYear = getYear(endDate);

        const isCurrentYear = YEAR === startDateYear && YEAR === endDateYear;

        const isSameDays =
            startDate && endDate ? isSameDay(startDate, endDate) : false;

        const isSameMonths =
            startDate && endDate ? isSameMonth(startDate, endDate) : false;

        return isCurrentYear
            ? isSameMonths
                ? isSameDays
                    ? fDate(endDate, "MMMM dd, yyyy")
                    : `${fDate(startDate, "MMMM dd")}-${fDate(
                          endDate,
                          "dd yyyy"
                      )}`
                : `${fDate(startDate, "MMMM")} - ${fDate(endDate, "MMMM yyyy")}`
            : `${fDate(startDate, "MMMM dd yyyy")} - ${fDate(
                  endDate,
                  "MMMM dd yyyy"
              )}`;
    }
    return "";
};

export function PDF({ data = [], filterDate, logo }) {
    const { total, summary, startIndices } = useMemo(() => {
        const total = [];
        const startIndices = [];
        const summary = {
            insCount: 0,
            withIns: 0,
            withOutIns: 0,
        };
        if (data.length > 0) {
            let insCount = 0;
            let withIns = 0;
            let withOutIns = 0;
            let startIndex = 0;

            for (let i = 0; i < data.length; i++) {
                const count = data[i].inspections_count;
                insCount += count;
                if (count) {
                    withIns++;
                } else {
                    withOutIns++;
                }
                if ((i + 1) % MAX_ITEM === 0 || i === data.length - 1) {
                    total.push({
                        insCount,
                        withIns,
                        withOutIns,
                    });
                    summary.insCount += insCount;
                    summary.withIns += withIns;
                    summary.withOutIns += withOutIns;
                    insCount = 0;
                    withIns = 0;
                    withOutIns = 0;
                    startIndex = i + 1;
                    startIndices.push(startIndex);
                }
            }

            return { total, summary, startIndices };
        }
        return { total, startIndices, summary };
    }, [data]);

    const checkBreakPoint = (index) => startIndices.indexOf(index);
    return (
        <Document
            title={`Safety Officer & PA's DOR Tracker${
                filterDate ? ` - ${shortLabelDate(filterDate)}` : ""
            }`}
        >
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
                        <Text style={[styles.h3, { color: "#616161" }]}>
                            Safety Officer & PA's DOR{" "}
                            {filterDate
                                ? `- ${shortLabelDate(filterDate)}`
                                : ""}
                        </Text>
                    </View>
                </View>

                <View>
                    {/* TABLE HEADER */}
                    <View
                        fixed
                        style={[
                            styles.tableRow,
                            styles.w1,
                            styles.bl,
                            styles.bt,
                            styles.bgOffPrimary,
                            { padding: 0 },
                        ]}
                    >
                        <View
                            style={[
                                styles.br,
                                {
                                    flexGrow: 0,
                                    paddingTop: 2,
                                    paddingBottom: 2,
                                    flexBasis: 20,
                                    height: 18,
                                    justifyContent: "center",
                                    paddingLeft: 1,
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.bold,
                                    { color: "#363636", lineHeight: 1 },
                                ]}
                            >
                                S.no
                            </Text>
                        </View>
                        <View
                            style={[
                                styles.pl4,
                                styles.br,
                                {
                                    flexGrow: 0,
                                    paddingTop: 2,
                                    paddingBottom: 2,
                                    flexBasis: 100,
                                    height: 18,
                                    justifyContent: "center",
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.bold,
                                    { color: "#363636", lineHeight: 1 },
                                ]}
                            >
                                Name
                            </Text>
                        </View>
                        <View
                            style={[
                                styles.pl4,
                                styles.br,
                                {
                                    flexGrow: 0,
                                    paddingTop: 2,
                                    paddingBottom: 2,
                                    flexBasis: 70,
                                    height: 18,
                                    justifyContent: "center",
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.bold,
                                    { color: "#363636", lineHeight: 1 },
                                ]}
                            >
                                Company
                            </Text>
                        </View>
                        <View
                            style={[
                                styles.pl4,
                                styles.br,
                                {
                                    flexGrow: 0,
                                    paddingTop: 2,
                                    paddingBottom: 2,
                                    flexBasis: 75,
                                    height: 18,
                                    justifyContent: "center",
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.bold,
                                    { color: "#363636", lineHeight: 1 },
                                ]}
                            >
                                Position
                            </Text>
                        </View>
                        <View
                            style={[
                                styles.pl4,
                                styles.br,
                                {
                                    flexGrow: 0,
                                    paddingTop: 2,
                                    paddingBottom: 2,
                                    flexBasis: 85,
                                    height: 18,
                                    justifyContent: "center",
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.bold,
                                    { color: "#363636", lineHeight: 1 },
                                ]}
                            >
                                Department
                            </Text>
                        </View>
                        <View
                            style={[
                                styles.pl4,
                                styles.br,
                                {
                                    flexGrow: 0,
                                    paddingTop: 2,
                                    paddingBottom: 2,
                                    flexBasis: 60,
                                    height: 18,
                                    justifyContent: "center",
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.bold,
                                    { color: "#363636", lineHeight: 1 },
                                ]}
                            >
                                Country
                            </Text>
                        </View>
                        <View
                            style={[
                                styles.pl4,
                                styles.br,
                                {
                                    flexGrow: 0,
                                    paddingTop: 2,
                                    paddingBottom: 2,
                                    flexBasis: 90,
                                    height: 18,
                                    justifyContent: "center",
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.bold,
                                    { color: "#363636", lineHeight: 1 },
                                ]}
                            >
                                Phone No.
                            </Text>
                        </View>
                        <View
                            style={[
                                styles.pl4,
                                styles.br,
                                {
                                    flexGrow: 0,
                                    paddingTop: 2,
                                    paddingBottom: 2,
                                    flexBasis: 55,
                                    height: 18,
                                    justifyContent: "center",
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.bold,
                                    { color: "#363636", lineHeight: 1 },
                                ]}
                            >
                                Status
                            </Text>
                        </View>
                        <View
                            style={[
                                styles.pl4,
                                styles.br,
                                {
                                    flexGrow: 0,
                                    paddingTop: 2,
                                    paddingBottom: 2,
                                    flexBasis: 50,
                                    height: 18,
                                    justifyContent: "center",
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.bold,
                                    { color: "#363636", lineHeight: 1 },
                                ]}
                            >
                                Inspections
                            </Text>
                        </View>
                    </View>

                    <View>
                        {/* TABLE BODY */}
                        {data.map((d, i) => {
                            const breakPointIndex = checkBreakPoint(i + 1);
                            return (
                                <Fragment key={d.id}>
                                    <View
                                        style={[
                                            styles.tableRow,
                                            styles.w1,
                                            styles.bl,
                                            {
                                                padding: 0,
                                                height: 16,
                                            },
                                        ]}
                                        wrap={false}
                                    >
                                        <View
                                            style={[
                                                styles.pl4,
                                                styles.br,
                                                {
                                                    flexGrow: 0,
                                                    paddingTop: 2,
                                                    paddingBottom: 2,
                                                    flexBasis: 20,
                                                    justifyContent: "center",
                                                },
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    styles.bold,
                                                    {
                                                        color: "#363636",
                                                        lineHeight: 1,
                                                    },
                                                ]}
                                            >
                                                {i + 1}
                                            </Text>
                                        </View>
                                        <View
                                            style={[
                                                styles.pl4,
                                                styles.br,
                                                {
                                                    flexGrow: 0,
                                                    paddingTop: 2,
                                                    paddingBottom: 2,
                                                    flexBasis: 100,
                                                    justifyContent: "center",
                                                },
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    {
                                                        color: "#363636",
                                                        lineHeight: 1,
                                                    },
                                                ]}
                                            >
                                                {d.fullname}
                                            </Text>
                                        </View>
                                        <View
                                            style={[
                                                styles.pl4,
                                                styles.br,
                                                {
                                                    flexGrow: 0,
                                                    paddingTop: 2,
                                                    paddingBottom: 2,
                                                    flexBasis: 70,
                                                    justifyContent: "center",
                                                },
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    {
                                                        color: "#363636",
                                                        lineHeight: 1,
                                                    },
                                                ]}
                                            >
                                                {d.company_name ?? "N/A"}
                                            </Text>
                                        </View>
                                        <View
                                            style={[
                                                styles.pl4,
                                                styles.br,
                                                {
                                                    flexGrow: 0,
                                                    paddingTop: 2,
                                                    paddingBottom: 2,
                                                    flexBasis: 75,
                                                    justifyContent: "center",
                                                },
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    {
                                                        color: "#363636",
                                                        lineHeight: 1,
                                                    },
                                                ]}
                                            >
                                                {d.position}
                                            </Text>
                                        </View>
                                        <View
                                            style={[
                                                styles.pl4,
                                                styles.br,
                                                {
                                                    flexGrow: 0,
                                                    paddingTop: 2,
                                                    paddingBottom: 2,
                                                    flexBasis: 85,
                                                    justifyContent: "center",
                                                },
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    {
                                                        color: "#363636",
                                                        lineHeight: 1,
                                                    },
                                                ]}
                                            >
                                                {d.department}
                                            </Text>
                                        </View>
                                        <View
                                            style={[
                                                styles.pl4,
                                                styles.br,
                                                {
                                                    flexGrow: 0,
                                                    paddingTop: 2,
                                                    paddingBottom: 2,
                                                    flexBasis: 60,
                                                    justifyContent: "center",
                                                },
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    {
                                                        color: "#363636",
                                                        lineHeight: 1,
                                                    },
                                                ]}
                                            >
                                                {d.country}
                                            </Text>
                                        </View>
                                        <View
                                            style={[
                                                styles.pl4,
                                                styles.br,
                                                {
                                                    flexGrow: 0,
                                                    paddingTop: 2,
                                                    paddingBottom: 2,
                                                    flexBasis: 90,
                                                    justifyContent: "center",
                                                },
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    d.phone_no === "N/A"
                                                        ? styles.bold
                                                        : {},
                                                    {
                                                        color: "#363636",
                                                        lineHeight: 1,
                                                    },
                                                ]}
                                            >
                                                {d.phone_no}
                                            </Text>
                                        </View>
                                        <View
                                            style={[
                                                styles.pl4,
                                                styles.br,
                                                {
                                                    flexGrow: 0,
                                                    paddingTop: 2,
                                                    paddingBottom: 2,
                                                    flexBasis: 55,
                                                    justifyContent: "center",
                                                },
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    styles.bold,
                                                    d.status === "active"
                                                        ? styles.success
                                                        : styles.warning,
                                                    {
                                                        lineHeight: 1,
                                                        textTransform:
                                                            "uppercase",
                                                    },
                                                ]}
                                            >
                                                {d.status}
                                            </Text>
                                        </View>
                                        <View
                                            style={[
                                                styles.pl4,
                                                styles.br,
                                                {
                                                    flexGrow: 0,
                                                    paddingTop: 2,
                                                    paddingBottom: 2,
                                                    flexBasis: 50,
                                                    justifyContent: "center",
                                                },
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    styles.bold,
                                                    {
                                                        color: "#363636",
                                                        lineHeight: 1,
                                                    },
                                                ]}
                                            >
                                                {d.inspections_count}
                                            </Text>
                                        </View>
                                    </View>

                                    {/* TOTAL WITH INSPECTIONS */}
                                    {breakPointIndex !== -1 && (
                                        <>
                                            {total.length > 1 && (
                                                <>
                                                    {/* TOTAL PERSONEL WITH INSPECTION */}
                                                    <View
                                                        style={[
                                                            styles.bm,
                                                            styles.bgOffPrimary,
                                                            {
                                                                padding:
                                                                    "4px 0 2px 0",
                                                                flexDirection:
                                                                    "row",
                                                                fontSize: 7,
                                                            },
                                                        ]}
                                                    >
                                                        <View
                                                            style={[
                                                                styles.pl4,
                                                                styles.bold,
                                                                {
                                                                    flexGrow: 0,
                                                                    paddingTop: 2,
                                                                    paddingBottom: 2,
                                                                    flexBasis: 140,
                                                                    justifyContent:
                                                                        "center",
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={[
                                                                    {
                                                                        color: "#363636",
                                                                        lineHeight: 1,
                                                                    },
                                                                ]}
                                                            >
                                                                Total Personel
                                                                Reported
                                                            </Text>
                                                        </View>
                                                        <View
                                                            style={[
                                                                styles.pl4,
                                                                styles.bold,
                                                                {
                                                                    flexGrow: 0,
                                                                    paddingTop: 2,
                                                                    paddingBottom: 2,
                                                                    flexBasis: 90,
                                                                    justifyContent:
                                                                        "center",
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={[
                                                                    {
                                                                        color: "#363636",
                                                                        lineHeight: 1,
                                                                    },
                                                                ]}
                                                            >
                                                                {total?.[
                                                                    breakPointIndex
                                                                ]?.withIns || 0}
                                                            </Text>
                                                        </View>
                                                        <View
                                                            style={[
                                                                styles.pl4,
                                                                {
                                                                    flexGrow: 0,
                                                                    paddingTop: 2,
                                                                    paddingBottom: 2,
                                                                    flexBasis: 305,
                                                                    justifyContent:
                                                                        "center",
                                                                },
                                                            ]}
                                                        />
                                                        <View
                                                            style={[
                                                                styles.pl4,
                                                                {
                                                                    flexGrow: 0,
                                                                    paddingTop: 2,
                                                                    paddingBottom: 2,
                                                                    flexBasis: 50,
                                                                    justifyContent:
                                                                        "center",
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={[
                                                                    styles.bold,
                                                                    {
                                                                        color: "#363636",
                                                                        lineHeight: 1,
                                                                    },
                                                                ]}
                                                            >
                                                                {total?.[
                                                                    breakPointIndex
                                                                ]?.insCount ||
                                                                    0}
                                                            </Text>
                                                        </View>
                                                    </View>

                                                    {/* TOTAL PERSONEL WITHOUT INSPECTION */}
                                                    <View
                                                        style={[
                                                            styles.bm,
                                                            styles.bgOffPrimary,
                                                            {
                                                                padding:
                                                                    "4px 0 2px 0",
                                                                flexDirection:
                                                                    "row",
                                                                fontSize: 7,
                                                            },
                                                        ]}
                                                    >
                                                        <View
                                                            style={[
                                                                styles.pl4,
                                                                styles.bold,
                                                                {
                                                                    flexGrow: 0,
                                                                    paddingTop: 2,
                                                                    paddingBottom: 2,
                                                                    flexBasis: 140,
                                                                    justifyContent:
                                                                        "center",
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={[
                                                                    {
                                                                        color: "#363636",
                                                                        lineHeight: 1,
                                                                    },
                                                                ]}
                                                            >
                                                                Total Personel
                                                                Did Not Report
                                                            </Text>
                                                        </View>
                                                        <View
                                                            style={[
                                                                styles.pl4,
                                                                styles.bold,
                                                                {
                                                                    flexGrow: 0,
                                                                    paddingTop: 2,
                                                                    paddingBottom: 2,
                                                                    flexBasis: 90,
                                                                    justifyContent:
                                                                        "center",
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={[
                                                                    {
                                                                        color: "#363636",
                                                                        lineHeight: 1,
                                                                    },
                                                                ]}
                                                            >
                                                                {total?.[
                                                                    breakPointIndex
                                                                ]?.withOutIns ||
                                                                    0}
                                                            </Text>
                                                        </View>
                                                        <View
                                                            style={[
                                                                styles.pl4,
                                                                {
                                                                    flexGrow: 0,
                                                                    paddingTop: 2,
                                                                    paddingBottom: 2,
                                                                    flexBasis: 355,
                                                                    justifyContent:
                                                                        "center",
                                                                },
                                                            ]}
                                                        />
                                                    </View>
                                                </>
                                            )}
                                            {/* SUMMARY AND BREAK */}
                                            {startIndices[breakPointIndex] ===
                                            data.length ? (
                                                <>
                                                    {data.length /
                                                        total.length +
                                                        3 >=
                                                        MAX_ITEM && (
                                                        <View
                                                            style={{
                                                                display: "none",
                                                            }}
                                                            break
                                                        />
                                                    )}
                                                    <View
                                                        style={[
                                                            styles.mt8,
                                                            styles.mb8,
                                                            {
                                                                padding:
                                                                    "4px 0 2px 0",
                                                                flexDirection:
                                                                    "row",
                                                                fontSize: 7,
                                                            },
                                                        ]}
                                                    >
                                                        <View
                                                            style={[
                                                                styles.pl4,
                                                                styles.bold,
                                                                {
                                                                    flexGrow: 0,
                                                                    paddingTop: 2,
                                                                    paddingBottom: 2,
                                                                    flexBasis:
                                                                        "100%",
                                                                    justifyContent:
                                                                        "center",
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={[
                                                                    styles.h6,
                                                                    {
                                                                        color: "#363636",
                                                                        lineHeight: 1,
                                                                    },
                                                                ]}
                                                            >
                                                                Summary Total:
                                                            </Text>
                                                        </View>
                                                    </View>
                                                    {/* Summary Total Personel Reported */}
                                                    <View
                                                        style={[
                                                            styles.bm,
                                                            styles.bgOffPrimary,
                                                            {
                                                                padding:
                                                                    "4px 0 2px 0",
                                                                flexDirection:
                                                                    "row",
                                                                fontSize: 7,
                                                            },
                                                        ]}
                                                    >
                                                        <View
                                                            style={[
                                                                styles.pl4,
                                                                styles.bold,
                                                                styles.bgOffPrimary,
                                                                {
                                                                    flexGrow: 0,
                                                                    paddingTop: 2,
                                                                    paddingBottom: 2,
                                                                    flexBasis: 140,
                                                                    justifyContent:
                                                                        "center",
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={[
                                                                    {
                                                                        color: "#363636",
                                                                        lineHeight: 1,
                                                                    },
                                                                ]}
                                                            >
                                                                Summary Total
                                                                Personel
                                                                Reported
                                                            </Text>
                                                        </View>
                                                        <View
                                                            style={[
                                                                styles.pl4,
                                                                styles.bold,
                                                                {
                                                                    flexGrow: 0,
                                                                    paddingTop: 2,
                                                                    paddingBottom: 2,
                                                                    flexBasis: 90,
                                                                    justifyContent:
                                                                        "center",
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={[
                                                                    {
                                                                        color: "#363636",
                                                                        lineHeight: 1,
                                                                    },
                                                                ]}
                                                            >
                                                                {
                                                                    summary.withIns
                                                                }
                                                            </Text>
                                                        </View>
                                                        <View
                                                            style={[
                                                                styles.pl4,
                                                                {
                                                                    flexGrow: 0,
                                                                    paddingTop: 2,
                                                                    paddingBottom: 2,
                                                                    flexBasis: 305,
                                                                    justifyContent:
                                                                        "center",
                                                                },
                                                            ]}
                                                        />
                                                        <View
                                                            style={[
                                                                styles.pl4,
                                                                {
                                                                    flexGrow: 0,
                                                                    paddingTop: 2,
                                                                    paddingBottom: 2,
                                                                    flexBasis: 50,
                                                                    justifyContent:
                                                                        "center",
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={[
                                                                    styles.bold,
                                                                    {
                                                                        color: "#363636",
                                                                        lineHeight: 1,
                                                                    },
                                                                ]}
                                                            >
                                                                {
                                                                    summary.insCount
                                                                }
                                                            </Text>
                                                        </View>
                                                    </View>
                                                    {/* Summary Total Personel Did Not Report */}
                                                    <View
                                                        style={[
                                                            styles.bm,
                                                            styles.bgOffPrimary,
                                                            {
                                                                padding:
                                                                    "4px 0 2px 0",
                                                                flexDirection:
                                                                    "row",
                                                                fontSize: 7,
                                                            },
                                                        ]}
                                                    >
                                                        <View
                                                            style={[
                                                                styles.pl4,
                                                                styles.bold,
                                                                {
                                                                    flexGrow: 0,
                                                                    paddingTop: 2,
                                                                    paddingBottom: 2,
                                                                    flexBasis: 140,
                                                                    justifyContent:
                                                                        "center",
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={[
                                                                    {
                                                                        color: "#363636",
                                                                        lineHeight: 1,
                                                                    },
                                                                ]}
                                                            >
                                                                Summary Total
                                                                Personel Did Not
                                                            </Text>
                                                            <Text
                                                                style={[
                                                                    {
                                                                        color: "#363636",
                                                                        lineHeight: 1,
                                                                    },
                                                                ]}
                                                            >
                                                                Report
                                                            </Text>
                                                        </View>
                                                        <View
                                                            style={[
                                                                styles.pl4,
                                                                styles.bold,
                                                                {
                                                                    flexGrow: 0,
                                                                    paddingTop: 2,
                                                                    paddingBottom: 2,
                                                                    flexBasis: 90,
                                                                    justifyContent:
                                                                        "center",
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={[
                                                                    {
                                                                        color: "#363636",
                                                                        lineHeight: 1,
                                                                    },
                                                                ]}
                                                            >
                                                                {
                                                                    summary.withOutIns
                                                                }
                                                            </Text>
                                                        </View>
                                                        <View
                                                            style={[
                                                                styles.pl4,
                                                                {
                                                                    flexGrow: 0,
                                                                    paddingTop: 2,
                                                                    paddingBottom: 2,
                                                                    flexBasis: 355,
                                                                    justifyContent:
                                                                        "center",
                                                                },
                                                            ]}
                                                        />
                                                    </View>
                                                </>
                                            ) : (
                                                <View
                                                    style={{
                                                        display: "none",
                                                    }}
                                                    break
                                                />
                                            )}
                                        </>
                                    )}
                                </Fragment>
                            );
                        })}
                    </View>
                </View>

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
