/* eslint-disable jsx-a11y/alt-text */
import {
    Page,
    View,
    Text,
    Image,
    Document,
    Svg,
    Circle,
} from "@react-pdf/renderer";
// utils
import { styles } from "./PDFStyles";
import { format } from "date-fns";
import { useMemo } from "react";

// ----------------------------------------------------------------------

const PER_PAGE = 25;
const FORMATTED_DATE = format(new Date(), "MM/dd/yy");
const YEAR = new Date().getFullYear();
const summaryTotal = {
    activeTotal: {},
    expiredTotal: {},
    SN: 0,
    E: 0,
    active: 0,
    inactive: 0,
};
export function PDF(props) {
    const { employees = [], type = "thirdParty" } = props;

    const getLengthByStatus = (status) =>
        employees.filter((item) => item.status === status).length;

    const getUnassignedEmployeeLength = () =>
        employees.filter((item) => !item.user_id).length;

    const trainings =
        type === "thirdParty"
            ? employees[0]?.thirdPartyTrainings
            : type === "inHouse"
            ? employees[0]?.internalTrainings
            : employees[0]?.clientTrainings;
    summaryTotal.activeTotal = {};
    summaryTotal.expiredTotal = {};
    summaryTotal.SN = 0;
    summaryTotal.E = 0;
    summaryTotal.active = 0;
    summaryTotal.inactive = 0;
    const legends = {
        SN: 0,
        E: 0,
    };
    for (const key in trainings) {
        if (Object.prototype.hasOwnProperty.call(trainings, key)) {
            legends[key] = 0;
            summaryTotal.activeTotal[key] = 0;
            summaryTotal.expiredTotal[key] = 0;
        }
    }
    const pages = useMemo(() => {
        if (employees.length > PER_PAGE) {
            const chunkSize = PER_PAGE;
            let arr = [];
            for (let i = 0; i < employees.length; i += chunkSize) {
                const chunk = employees.slice(i, i + chunkSize);
                arr.push(chunk);
            }
            return arr;
        } else {
            return [employees];
        }
    }, [employees]);

    return (
        <Document title={""}>
            {pages.map((page, i) => (
                <Page size="A4" style={styles.page} key={i}>
                    <View
                        style={[
                            styles.mb16,
                            { minHeight: 40, alignItems: "flex-start" },
                        ]}
                    >
                        <Image
                            src={
                                window.location.origin +
                                "/image/media/logo/Fiafi-logo.png"
                            }
                            style={{ height: 32, padding: 2 }}
                        />
                    </View>
                    <View style={{ textAlign: "center", marginTop: "-30px" }}>
                        <Text style={[styles.h4]}>
                            Employee Training Tracker Report
                        </Text>
                    </View>

                    {i === 0 && (
                        <View style={styles.mb8}>
                            <View
                                style={[
                                    styles.gridContainer,
                                    styles.mb8,
                                    styles.mt8,
                                    styles.pt8,
                                    styles.pb8,
                                    {
                                        border: "1px solid #f5f5f5",
                                        borderRadius: 4,
                                    },
                                ]}
                            >
                                <View
                                    style={[
                                        styles.gridContainer,
                                        styles.pl4,
                                        {
                                            alignItems: "center",
                                            borderRight: "1px solid #f5f5f5",
                                            width: "100%",
                                            justifyContent: "flex-start",
                                        },
                                    ]}
                                >
                                    <View style={[styles.pl4]}>
                                        <Text style={[styles.h6, styles.info]}>
                                            Total
                                        </Text>
                                        <View style={{ flexDirection: "row" }}>
                                            <Text
                                                style={[
                                                    styles.bold,
                                                    styles.pr4,
                                                    { fontSize: 8 },
                                                ]}
                                            >
                                                {employees.length}
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: 8,
                                                    color: "#637381",
                                                }}
                                            >
                                                employees
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                <View
                                    style={[
                                        styles.gridContainer,
                                        styles.pl4,
                                        {
                                            alignItems: "center",
                                            borderRight: "1px solid #f5f5f5",
                                            width: "100%",
                                            justifyContent: "flex-start",
                                        },
                                    ]}
                                >
                                    <View style={[styles.pl4]}>
                                        <Text
                                            style={[styles.h6, styles.success]}
                                        >
                                            Active
                                        </Text>
                                        <View style={{ flexDirection: "row" }}>
                                            <Text
                                                style={[
                                                    styles.bold,
                                                    styles.pr4,
                                                    { fontSize: 8 },
                                                ]}
                                            >
                                                {getLengthByStatus("active")}
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: 8,
                                                    color: "#637381",
                                                }}
                                            >
                                                employees
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                <View
                                    style={[
                                        styles.gridContainer,
                                        styles.pl4,
                                        {
                                            alignItems: "center",
                                            borderRight: "1px solid #f5f5f5",
                                            width: "100%",
                                            justifyContent: "flex-start",
                                        },
                                    ]}
                                >
                                    <View style={[styles.pl4]}>
                                        <Text
                                            style={[styles.h6, styles.warning]}
                                        >
                                            Inactive
                                        </Text>
                                        <View style={{ flexDirection: "row" }}>
                                            <Text
                                                style={[
                                                    styles.bold,
                                                    styles.pr4,
                                                    { fontSize: 8 },
                                                ]}
                                            >
                                                {getLengthByStatus("inactive")}
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: 8,
                                                    color: "#637381",
                                                }}
                                            >
                                                employees
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                <View
                                    style={[
                                        styles.gridContainer,
                                        styles.pl4,
                                        {
                                            alignItems: "center",
                                            borderRight: "1px solid #f5f5f5",
                                            width: "100%",
                                            justifyContent: "flex-start",
                                        },
                                    ]}
                                >
                                    <View style={[styles.pl4]}>
                                        <Text style={[styles.h6, styles.error]}>
                                            Unassigned
                                        </Text>
                                        <View style={{ flexDirection: "row" }}>
                                            <Text
                                                style={[
                                                    styles.bold,
                                                    styles.pr4,
                                                    { fontSize: 8 },
                                                ]}
                                            >
                                                {getUnassignedEmployeeLength()}
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: 8,
                                                    color: "#637381",
                                                }}
                                            >
                                                employees
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    )}

                    <TableHeader
                        trainings={trainings}
                        type={type}
                        style={styles.bt}
                    />

                    <View>
                        {page.map((emp, idx) => (
                            <TableRow
                                key={emp.employee_id}
                                emp={emp}
                                idx={idx + i * PER_PAGE}
                                type={type}
                            />
                        ))}
                    </View>

                    <SummaryTotal
                        original={page}
                        type={type}
                        trainings={Object.values(trainings)}
                        legends={legends}
                    />

                    {i + 1 === pages.length && <Legend trainings={trainings} />}

                    <View style={[styles.gridContainer, styles.footer]}>
                        <View style={styles.col4}>
                            <Text
                                style={[
                                    styles.bold,
                                    {
                                        fontSize: 7,
                                        textAlign: "left",
                                        color: "#141414",
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
                                        color: "#141414",
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
                                        color: "#141414",
                                    },
                                ]}
                            >
                                {`${FORMATTED_DATE} Page ${i + 1} / ${
                                    pages.length
                                }`}
                            </Text>
                        </View>
                    </View>
                </Page>
            ))}
        </Document>
    );
}

function TableHeader({
    trainings = {},
    type = "thirdParty",
    style,
    invertedTraining,
    ...others
}) {
    return (
        <View
            style={[
                styles.tableRow,
                styles.w1,
                styles.bl,
                style,
                { padding: 0 },
            ]}
            {...others}
        >
            <View
                style={[
                    styles.br,
                    {
                        flexGrow: 0,
                        flexBasis: 18,
                    },
                ]}
            >
                <View style={{ marginVertical: "auto" }}>
                    <Text
                        style={[
                            styles.bold,
                            {
                                color: "#2a2a2a",
                                lineHeight: 1,
                                textAlign: "center",
                            },
                        ]}
                    >
                        No.
                    </Text>
                </View>
            </View>
            <View
                style={[
                    styles.br,
                    {
                        flexGrow: 0.33,
                        flexBasis: 85,
                    },
                ]}
            >
                <View style={{ marginVertical: "auto" }}>
                    <Text
                        style={[
                            styles.bold,
                            {
                                color: "#2a2a2a",
                                lineHeight: 1,
                                textAlign: "center",
                            },
                        ]}
                    >
                        Name
                    </Text>
                </View>
            </View>
            <View
                style={[
                    styles.br,
                    {
                        flexGrow: 0.33,
                        flexBasis: 65,
                    },
                ]}
            >
                <View style={{ marginVertical: "auto" }}>
                    <Text
                        style={[
                            styles.bold,
                            {
                                color: "#2a2a2a",
                                lineHeight: 1,
                                textAlign: "center",
                            },
                        ]}
                    >
                        Position
                    </Text>
                </View>
            </View>
            <View
                style={[
                    styles.br,
                    {
                        flexGrow: 0.33,
                        flexBasis: 65,
                    },
                ]}
            >
                <View style={{ marginVertical: "auto" }}>
                    <Text
                        style={[
                            styles.bold,
                            {
                                color: "#2a2a2a",
                                lineHeight: 1,
                                textAlign: "center",
                            },
                        ]}
                    >
                        Department
                    </Text>
                </View>
            </View>
            <View
                style={[
                    styles.br,
                    {
                        flexGrow: 0,
                        flexBasis: 50,
                    },
                ]}
            >
                <View style={{ marginVertical: "auto" }}>
                    <Text
                        style={[
                            styles.bold,
                            {
                                color: "#2a2a2a",
                                lineHeight: 1,
                                textAlign: "center",
                            },
                        ]}
                    >
                        Company
                    </Text>
                </View>
            </View>
            <View
                style={[
                    styles.br,
                    {
                        flexDirection: invertedTraining
                            ? "column-reverse"
                            : "column",
                    },
                ]}
            >
                <View
                    style={[
                        {
                            paddingBottom: 4,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                        },
                        invertedTraining ? styles.bt : {},
                    ]}
                >
                    <Text
                        style={[
                            styles.bold,
                            {
                                color: "#2a2a2a",
                                lineHeight: 1,
                                paddingTop: 2,
                                textAlign: "center",
                            },
                        ]}
                    >
                        {type === "thirdParty"
                            ? "Third Party Training"
                            : type === "inHouse"
                            ? "In House Training"
                            : "Client Training"}
                    </Text>
                </View>
                <View
                    style={[
                        { flexDirection: "row" },
                        invertedTraining ? {} : styles.bt,
                    ]}
                >
                    {Object.values(trainings).map((t) => (
                        <View
                            style={[styles.br, { paddingHorizontal: 1.5 }]}
                            key={t.acronym}
                        >
                            <Text
                                style={[
                                    styles.bold,
                                    {
                                        fontSize: 6.5,
                                        color: "#4c4c54",
                                        lineHeight: 1,
                                        textAlign: "center",
                                        paddingTop: 1,
                                        paddingBottom: 2,
                                    },
                                ]}
                            >
                                {t.acronym}
                            </Text>
                        </View>
                    ))}
                    <View style={[styles.br, { flexGrow: 0, flexBasis: 15 }]}>
                        <Text
                            style={[
                                styles.bold,
                                {
                                    fontSize: 6.5,
                                    color: "#4c4c54",
                                    lineHeight: 1,
                                    textAlign: "center",
                                    paddingTop: 1,
                                    paddingBottom: 2,
                                },
                            ]}
                        >
                            SN
                        </Text>
                    </View>
                    <View style={[styles.br, { flexGrow: 0, flexBasis: 10 }]}>
                        <Text
                            style={[
                                styles.bold,
                                {
                                    fontSize: 6.5,
                                    color: "#4c4c54",
                                    lineHeight: 1,
                                    textAlign: "center",
                                    paddingTop: 1,
                                    paddingBottom: 2,
                                },
                            ]}
                        >
                            E
                        </Text>
                    </View>
                    <View style={[{ flexGrow: 0, flexBasis: 15 }]}>
                        <Text
                            style={[
                                styles.bold,
                                {
                                    fontSize: 6.5,
                                    color: "#4c4c54",
                                    lineHeight: 1,
                                    textAlign: "center",
                                    paddingTop: 1,
                                    paddingBottom: 2,
                                },
                            ]}
                        >
                            TT
                        </Text>
                    </View>
                </View>
            </View>
            <View
                style={[
                    styles.br,
                    {
                        flexGrow: 0,
                        flexBasis: 40,
                    },
                ]}
            >
                <View style={{ marginVertical: "auto" }}>
                    <Text
                        style={[
                            styles.bold,
                            {
                                color: "#2a2a2a",
                                textAlign: "center",
                            },
                        ]}
                    >
                        Employee
                    </Text>
                    <Text
                        style={[
                            styles.bold,
                            {
                                color: "#2a2a2a",
                                lineHeight: 1,
                                textAlign: "center",
                            },
                        ]}
                    >
                        Status
                    </Text>
                </View>
            </View>
        </View>
    );
}

function TableRow({ emp, idx, type = "thirdParty" }) {
    const trainings = Object.values(
        type === "thirdParty"
            ? emp.thirdPartyTrainings
            : type === "inHouse"
            ? emp.internalTrainings
            : emp.clientTrainings
    );
    const trainingStatus =
        emp.trainings[
            type === "thirdParty"
                ? "external"
                : type === "inHouse"
                ? "internal"
                : "client"
        ];

    return (
        <View style={[styles.tableRow, styles.w1, styles.bl, { padding: 0 }]}>
            <View
                style={[
                    styles.br,
                    {
                        flexGrow: 0,
                        paddingVertical: 4,
                        flexBasis: 18,
                    },
                ]}
            >
                <Text
                    style={[
                        {
                            color: "#363636",
                            lineHeight: 1,
                            textAlign: "center",
                        },
                    ]}
                >
                    {idx + 1}
                </Text>
            </View>
            <View
                style={[
                    styles.br,
                    {
                        flexGrow: 0.33,
                        paddingVertical: 4,
                        flexBasis: 85,
                    },
                ]}
            >
                <Text
                    style={[
                        {
                            color: "#363636",
                            lineHeight: 1,
                            textAlign: "center",
                        },
                    ]}
                >
                    {emp.fullname}
                </Text>
            </View>
            <View
                style={[
                    styles.br,
                    {
                        flexGrow: 0.33,
                        paddingVertical: 4,
                        flexBasis: 65,
                    },
                ]}
            >
                <Text
                    style={[
                        {
                            color: "#363636",
                            lineHeight: 1,
                            textTransform: "capitalize",
                            textAlign: "center",
                        },
                    ]}
                >
                    {emp.position ?? ""}
                </Text>
            </View>
            <View
                style={[
                    styles.br,
                    {
                        flexGrow: 0.33,
                        paddingVertical: 4,
                        flexBasis: 65,
                    },
                ]}
            >
                <Text
                    style={[
                        {
                            color: "#363636",
                            lineHeight: 1,
                            textAlign: "center",
                        },
                    ]}
                >
                    {emp.department ?? ""}
                </Text>
            </View>
            <View
                style={[
                    styles.pl4,
                    styles.br,
                    {
                        flexGrow: 0,
                        paddingVertical: 4,
                        paddingRight: 1,
                        flexBasis: 50,
                    },
                ]}
            >
                <Text style={[{ color: "#363636", lineHeight: 1 }]}>
                    {emp.company_name ?? ""}
                </Text>
            </View>

            <View
                style={[
                    styles.br,
                    {
                        flexDirection: "row",
                    },
                ]}
            >
                {trainings.map((t) => (
                    <View
                        style={[
                            styles.br,
                            {
                                paddingHorizontal: 1.5,
                                position: "relative",
                            },
                        ]}
                        key={t.acronym}
                    >
                        <Text
                            style={[
                                styles.bold,
                                {
                                    fontSize: 6.5,
                                    paddingTop: 1,
                                    lineHeight: 1,
                                    textAlign: "center",
                                    opacity: 0,
                                },
                            ]}
                        >
                            {t.acronym}
                        </Text>
                        {(t.sn || t.active || t.expired) && (
                            <SvgCircle
                                color={
                                    t.sn
                                        ? "febe00"
                                        : t.active > 0
                                        ? t.sn > 0
                                            ? "#FFAB00"
                                            : "#02a94d"
                                        : undefined
                                }
                                style={{
                                    position: "absolute",
                                    top: "39%",
                                    left: "39%",
                                }}
                            />
                        )}
                    </View>
                ))}
                <View style={[styles.br, { flexGrow: 0, flexBasis: 15 }]}>
                    <Text
                        style={[
                            {
                                color: "#363636",
                                lineHeight: 0,
                                textAlign: "center",
                                marginVertical: "auto",
                            },
                        ]}
                    >
                        {trainingStatus["SN"]}
                    </Text>
                </View>
                <View style={[styles.br, { flexGrow: 0, flexBasis: 10 }]}>
                    <Text
                        style={[
                            {
                                color: "#363636",
                                lineHeight: 0,
                                textAlign: "center",
                                marginVertical: "auto",
                            },
                        ]}
                    >
                        {trainingStatus["E"]}
                    </Text>
                </View>
                <View style={[{ flexGrow: 0, flexBasis: 15 }]}>
                    <Text
                        style={[
                            {
                                color: "#363636",
                                lineHeight: 0,
                                textAlign: "center",
                                marginVertical: "auto",
                            },
                        ]}
                    >
                        {trainingStatus["TT"]}
                    </Text>
                </View>
            </View>

            <View
                style={[
                    styles.br,
                    emp.status === "active"
                        ? styles.bgSuccess
                        : emp.status === "inactive"
                        ? styles.bgWarning
                        : styles.bgError,
                    {
                        flexGrow: 0,
                        paddingVertical: 4,
                        flexBasis: 40,
                    },
                ]}
            >
                <Text
                    style={[
                        styles.bold,
                        {
                            color: "#f2f2f2",
                            textTransform: "capitalize",
                            lineHeight: 1,
                            textAlign: "center",
                        },
                    ]}
                >
                    {emp.status}
                </Text>
            </View>
        </View>
    );
}

function SummaryTotal({ original, legends, trainings, type = "thirdParty" }) {
    const trainingTotals = {
        ttp: { ...legends },
        tntp: { ...legends },
        active: 0,
        inactive: 0,
    };
    original.forEach((arr) => {
        Object.values(
            type === "thirdParty"
                ? arr.thirdPartyTrainings
                : type === "inHouse"
                ? arr.internalTrainings
                : arr.clientTrainings
        ).forEach((item) => {
            if (item.acronym in summaryTotal.activeTotal) {
                summaryTotal.activeTotal[item.acronym] += item.active;
                summaryTotal.expiredTotal[item.acronym] += item.expired;
                summaryTotal.SN += item.sn;
                summaryTotal.E += item.expired;
            }
            if (item.acronym in trainingTotals.ttp) {
                trainingTotals.ttp[item.acronym] += item.active;
                trainingTotals.ttp.SN += item.sn;
                trainingTotals.ttp.E += item.expired;

                trainingTotals.tntp[item.acronym] += item.expired;
                trainingTotals.tntp.SN += item.sn;
                trainingTotals.tntp.E += item.expired;
            }
        });
        if (arr.status === "active") {
            summaryTotal.active += 1;
            trainingTotals.active += 1;
        } else {
            summaryTotal.inactive += 1;
            trainingTotals.inactive += 1;
        }
    });
    return (
        <View wrap={false}>
            <SummaryTotalHeader title="Total" trainings={trainings} />
            <SummaryTotalRow
                title="Train Personnel"
                trainings={trainings}
                items={trainingTotals.ttp}
                status={trainingTotals.active}
                statusStyle={styles.bgSuccess}
            />
            <SummaryTotalRow
                title="Not Train Personnel"
                trainings={trainings}
                items={trainingTotals.tntp}
                status={trainingTotals.inactive}
                statusStyle={styles.bgWarning}
            />
            <SummaryTotalHeader title="Summary Total" trainings={trainings} />
            <SummaryTotalRow
                title="Train Personnel"
                trainings={trainings}
                items={{
                    ...summaryTotal.activeTotal,
                    SN: summaryTotal.SN,
                    E: summaryTotal.E,
                }}
                status={summaryTotal.active}
                statusStyle={styles.bgSuccess}
            />
            <SummaryTotalRow
                title="Not Train Personnel"
                trainings={trainings}
                items={{
                    ...summaryTotal.expiredTotal,
                    SN: summaryTotal.SN,
                    E: summaryTotal.E,
                }}
                status={summaryTotal.inactive}
                statusStyle={styles.bgWarning}
            />
        </View>
    );
}

function SummaryTotalHeader({ title = "", trainings }) {
    return (
        <View
            style={[
                styles.bgOffPrimary,
                styles.mt16,
                styles.w1,
                {
                    flexDirection: "row",
                    fontSize: 7,
                    paddingVertical: 4,
                },
            ]}
        >
            <View
                style={[
                    {
                        flexGrow: 1,
                        flexBasis: 180,
                        paddingVertical: 2,
                        paddingLeft: 2,
                    },
                ]}
            >
                <Text
                    style={[
                        styles.bold,
                        {
                            color: "#363636",
                            lineHeight: 0,
                        },
                    ]}
                >
                    {title}
                </Text>
            </View>
            {trainings.map((keys) => (
                <View
                    style={[
                        {
                            flexGrow: 0,
                            flexBasis: 42,
                            paddingVertical: 2,
                        },
                    ]}
                    key={keys.acronym}
                >
                    <Text
                        style={[
                            styles.bold,
                            {
                                color: "#363636",
                                lineHeight: 0,
                                textAlign: "center",
                            },
                        ]}
                    >
                        {keys.acronym}
                    </Text>
                </View>
            ))}
            <View
                style={[
                    {
                        flexGrow: 0,
                        flexBasis: 50,
                        paddingVertical: 2,
                    },
                ]}
            >
                <Text
                    style={[
                        styles.bold,
                        {
                            color: "#363636",
                            lineHeight: 0,
                            textAlign: "center",
                        },
                    ]}
                >
                    SN
                </Text>
            </View>
            <View
                style={[
                    {
                        flexGrow: 0,
                        flexBasis: 50,
                        paddingVertical: 2,
                    },
                ]}
            >
                <Text
                    style={[
                        styles.bold,
                        {
                            color: "#363636",
                            lineHeight: 0,
                            textAlign: "center",
                        },
                    ]}
                >
                    E
                </Text>
            </View>
        </View>
    );
}

function SummaryTotalRow({ title, trainings, items, status, statusStyle }) {
    return (
        <View
            style={[
                styles.w1,
                {
                    flexDirection: "row",
                    fontSize: 7,
                },
            ]}
        >
            <View
                style={[
                    {
                        flexGrow: 1,
                        flexBasis: 180,
                        paddingVertical: 2,
                        paddingLeft: 2,
                    },
                ]}
            >
                {title && (
                    <Text
                        style={[
                            styles.bold,
                            {
                                color: "#2a2a2a",
                                lineHeight: 1,
                            },
                        ]}
                    >
                        {title}
                    </Text>
                )}
            </View>
            {trainings.map((keys) => (
                <View
                    style={[
                        {
                            flexGrow: 0,
                            flexBasis: 42,
                            paddingVertical: 2,
                        },
                    ]}
                    key={keys.acronym}
                >
                    <Text
                        style={[
                            styles.bold,
                            {
                                color: "#363636",
                                lineHeight: 0,
                                textAlign: "center",
                            },
                        ]}
                    >
                        {items[keys.acronym] ?? 0}
                    </Text>
                </View>
            ))}
            <View
                style={[
                    {
                        flexGrow: 0,
                        flexBasis: 50,
                        paddingVertical: 2,
                    },
                ]}
            >
                <Text
                    style={[
                        styles.bold,
                        {
                            color: "#363636",
                            lineHeight: 0,
                            textAlign: "center",
                        },
                    ]}
                >
                    {items?.SN ?? 0}
                </Text>
            </View>
            <View
                style={[
                    {
                        flexGrow: 0,
                        flexBasis: 50,
                        paddingVertical: 2,
                    },
                ]}
            >
                <Text
                    style={[
                        styles.bold,
                        {
                            color: "#363636",
                            lineHeight: 0,
                            textAlign: "center",
                        },
                    ]}
                >
                    {items.E ?? 0}
                </Text>
            </View>
        </View>
    );
}

function Legend({ trainings = {} }) {
    return (
        <View
            style={[
                styles.mt16,
                {
                    flexDirection: "row",
                    alignSelf: "flex-end",
                    maxWidth: "60%",
                    marginTop: "auto",
                    marginBottom: "auto",
                },
            ]}
        >
            <View style={styles.mr16}>
                <Text style={[styles.subtitle4, styles.bold]}>Legend</Text>
            </View>
            <View>
                {Object.values(trainings).map((t) => (
                    <View
                        key={t.acronym}
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        <Text
                            style={[styles.subtitle4, styles.bold, styles.w1]}
                        >
                            {t.name}
                        </Text>
                        <Text
                            style={[
                                styles.subtitle4,
                                styles.bold,
                                { width: 15 },
                            ]}
                        >
                            -
                        </Text>
                        <Text
                            style={[
                                styles.subtitle4,
                                styles.bold,
                                { width: 35 },
                            ]}
                        >
                            {t.acronym}
                        </Text>
                    </View>
                ))}
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    <Text style={[styles.subtitle4, styles.bold, styles.w1]}>
                        Soon to Expire
                    </Text>
                    <Text
                        style={[styles.subtitle4, styles.bold, { width: 15 }]}
                    >
                        -
                    </Text>
                    <Text
                        style={[styles.subtitle4, styles.bold, { width: 35 }]}
                    >
                        SN
                    </Text>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    <Text style={[styles.subtitle4, styles.bold, styles.w1]}>
                        Expired
                    </Text>
                    <Text
                        style={[styles.subtitle4, styles.bold, { width: 15 }]}
                    >
                        -
                    </Text>
                    <Text
                        style={[styles.subtitle4, styles.bold, { width: 35 }]}
                    >
                        E
                    </Text>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    <Text style={[styles.subtitle4, styles.bold, styles.w1]}>
                        Total Trainings
                    </Text>
                    <Text
                        style={[styles.subtitle4, styles.bold, { width: 15 }]}
                    >
                        -
                    </Text>
                    <Text
                        style={[styles.subtitle4, styles.bold, { width: 35 }]}
                    >
                        TT
                    </Text>
                </View>
            </View>
        </View>
    );
}

function SvgCircle({ color = "#f90000", style = {} }) {
    return (
        <Svg width="5" height="5" style={style}>
            <Circle cx={2.5} cy={2.5} r={2.5} fill={color} />
        </Svg>
    );
}
