/* eslint-disable jsx-a11y/alt-text */
import { Page, View, Text, Image, Document } from "@react-pdf/renderer";
// utils
import { styles } from "./PDFStyles";
import { format } from "date-fns";
import { sentenceCase } from "change-case";
import { fCurrencyNumber } from "@/utils/formatNumber";
import { fDate, fDateTime } from "@/utils/formatTime";
import { convert } from "html-to-text";

// ----------------------------------------------------------------------

const FORMATTED_DATE = format(new Date(), "MM/dd/yy");
const YEAR = new Date().getFullYear();
export function PDF(props) {
    const {
        inventory: {
            item,
            img_src,
            date_created,
            date_updated,
            status,
            item_price,
            item_currency,
            current_stock_qty,
            min_qty,
            description,
            try: unit,
            bound: history,
        },
    } = props;

    return (
        <Document title={item}>
            <Page size="A4" style={styles.page}>
                <View
                    style={[
                        styles.mb16,
                        { minHeight: 40, alignItems: "flex-start" },
                    ]}
                    fixed
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
                    <Text style={[styles.h2]}>PPE Product Detail</Text>
                </View>
                <PpeDetailSummary
                    item={item}
                    img_src={img_src}
                    date_created={date_created}
                    date_updated={date_updated}
                    status={status}
                    item_price={item_price}
                    item_currency={item_currency}
                    current_stock_qty={current_stock_qty}
                    min_qty={min_qty}
                    unit={unit}
                />
                <View style={{ paddingHorizontal: 16 }}>
                    <View style={styles.mt24} />
                    <Text style={[styles.subtitle2, { color: "#363636" }]}>
                        History
                    </Text>
                    <View style={styles.mb4} />
                    <TableHead />
                    <View>
                        {history.map((h, idx) => (
                            <TableBodyRows
                                key={h.inventory_id}
                                row={h}
                                no={idx + 1}
                            />
                        ))}
                    </View>
                    <View
                        style={[
                            styles.bm,
                            styles.w1,
                            {
                                borderColor: "#f2f0f0",
                                borderBottomStyle: "dashed",
                            },
                        ]}
                    />
                    <View style={styles.mt16} />
                    <View
                        style={[
                            styles.bm,
                            styles.w1,
                            {
                                borderColor: "#f2f0f0",
                                borderBottomStyle: "dashed",
                            },
                        ]}
                    ></View>
                    <View style={styles.mb16} />
                    <Text
                        style={[
                            styles.subtitle2,
                            styles.mb8,
                            { color: "#363636" },
                        ]}
                    >
                        Description
                    </Text>
                    <View style={[{ flexDirection: "row" }, styles.bm]}>
                        <Text
                            style={[
                                styles.subtitle3,
                                styles.w1,
                                {
                                    color: "#363636",
                                },
                            ]}
                        >
                            {convert(description ?? "")}
                        </Text>
                    </View>
                </View>

                <Footer />
            </Page>
        </Document>
    );
}

function PpeDetailSummary({
    item,
    img_src,
    status,
    unit,
    item_currency,
    item_price,
    date_created,
    date_updated,
    current_stock_qty,
    min_qty,
}) {
    return (
        <>
            <View style={[styles.mt24, styles.gridContainer]}>
                <View
                    style={[
                        styles.col6,
                        styles.p4,
                        {
                            maxHeight: 260,
                            minHeight: 260,
                            backgroundColor: "#f2f0f0",
                            borderRadius: 4,
                        },
                    ]}
                >
                    {!!img_src && (
                        <Image
                            src={`${window.location.origin}/storage/media/photos/inventory/${img_src}`}
                            style={{
                                height: "100%",
                                width: "100%",
                                borderRadius: 4,
                            }}
                        />
                    )}
                </View>
                <View
                    style={[
                        styles.col6,
                        styles.pl16,
                        styles.pr16,
                        styles.pt8,
                        styles.pb8,
                        { justifyContent: "space-between" },
                    ]}
                >
                    <View>
                        <View style={[{ flexDirection: "row" }, styles.mb8]}>
                            <Text
                                style={[
                                    styles.subtitle2,
                                    styles.p4,
                                    {
                                        textTransform: "capitalize",
                                        lineHeight: 0,
                                        borderRadius: 4,
                                        flexGrow: 0,
                                        fontSize: 8,
                                    },
                                    (status === "out_of_stock" &&
                                        styles.bgError) ||
                                        (status === "low_stock" &&
                                            styles.bgWarning) ||
                                        (status === "need_reorder" &&
                                            styles.bgInfo) ||
                                        styles.bgSuccess,
                                ]}
                            >
                                {sentenceCase(status)}
                            </Text>
                        </View>
                        <Text style={[styles.h4, styles.mb16]}>{item}</Text>
                        <View
                            style={[
                                styles.mb16,
                                { flexDirection: "row", gap: 4 },
                            ]}
                        >
                            <Text style={[styles.h4]}>{item_currency}</Text>
                            <Text style={[styles.h4]}>
                                {fCurrencyNumber(item_price)}
                            </Text>
                        </View>
                        <View
                            style={[
                                styles.pt16,
                                styles.bt,
                                {
                                    gap: 6,
                                    borderColor: "#f2f0f0",
                                    borderTopStyle: "dashed",
                                },
                            ]}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Text style={[styles.body1, styles.bold]}>
                                    Unit:
                                </Text>
                                <Text style={[styles.body1]}>{unit}</Text>
                            </View>
                            <View
                                style={[styles.bt, { borderColor: "#f2f0f0" }]}
                            />
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Text style={[styles.body1, styles.bold]}>
                                    Created:
                                </Text>
                                <Text style={[styles.body1]}>
                                    {fDate(date_created)}
                                </Text>
                            </View>
                            <View
                                style={[styles.bt, { borderColor: "#f2f0f0" }]}
                            />
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Text style={[styles.body1, styles.bold]}>
                                    Last Update:
                                </Text>
                                <Text style={[styles.body1]}>
                                    {fDate(date_updated)}
                                </Text>
                            </View>
                            <View
                                style={[styles.bt, { borderColor: "#f2f0f0" }]}
                            />
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Text style={[styles.body1, styles.bold]}>
                                    Quantity:
                                </Text>
                                <View>
                                    <Text style={styles.body1}>
                                        Available:{" "}
                                        {current_stock_qty?.toLocaleString()}
                                    </Text>
                                    <Text style={styles.subtitle4}>
                                        Minium {min_qty?.toLocaleString()}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View
                        style={[
                            styles.bm,
                            styles.w1,
                            {
                                borderColor: "#f2f0f0",
                                borderBottomStyle: "dashed",
                            },
                        ]}
                    ></View>
                </View>
            </View>
        </>
    );
}

function TableHead() {
    return (
        <View
            style={[
                styles.tableRow,
                styles.w1,
                styles.bl,
                styles.bt,
                styles.bgOffPrimary,
                { padding: 0 },
            ]}
            fixed
        >
            <View
                style={[
                    styles.pl4,
                    styles.br,
                    {
                        flexGrow: 0,
                        paddingTop: 4,
                        paddingBottom: 4,
                        flexBasis: 25,
                    },
                ]}
            >
                <Text
                    style={[styles.bold, { color: "#363636", lineHeight: 1 }]}
                >
                    No.
                </Text>
            </View>
            <View
                style={[
                    styles.pl4,
                    styles.br,
                    {
                        flexGrow: 0,
                        paddingTop: 4,
                        paddingBottom: 4,
                        flexBasis: 75,
                    },
                ]}
            >
                <Text
                    style={[styles.bold, { color: "#363636", lineHeight: 1 }]}
                >
                    Type
                </Text>
            </View>
            <View
                style={[
                    styles.pl4,
                    styles.br,
                    {
                        flexGrow: 1,
                        paddingTop: 4,
                        paddingBottom: 4,
                        flexBasis: 90,
                    },
                ]}
            >
                <Text
                    style={[styles.bold, { color: "#363636", lineHeight: 1 }]}
                >
                    Requested By
                </Text>
            </View>
            <View
                style={[
                    styles.pl4,
                    styles.br,
                    {
                        flexGrow: 0,
                        paddingTop: 4,
                        paddingBottom: 4,
                        flexBasis: 120,
                    },
                ]}
            >
                <Text
                    style={[styles.bold, { color: "#363636", lineHeight: 1 }]}
                >
                    Date
                </Text>
            </View>
            <View
                style={[
                    styles.pl4,
                    styles.br,
                    {
                        flexGrow: 0,
                        paddingTop: 4,
                        paddingBottom: 4,
                        flexBasis: 75,
                    },
                ]}
            >
                <Text
                    style={[styles.bold, { color: "#363636", lineHeight: 1 }]}
                >
                    Quantity
                </Text>
            </View>
            <View
                style={[
                    styles.pl4,
                    styles.br,
                    {
                        flexGrow: 0,
                        paddingTop: 4,
                        paddingBottom: 4,
                        flexBasis: 75,
                    },
                ]}
            >
                <Text
                    style={[styles.bold, { color: "#363636", lineHeight: 1 }]}
                >
                    Previous Quantity
                </Text>
            </View>
        </View>
    );
}

function TableBodyRows({ no, row }) {
    const requestedBy = row?.creator
        ? row.creator?.fullname
        : row?.requested_by_location;
    return (
        <View
            style={[styles.tableRow, styles.w1, styles.bl, { padding: 0 }]}
            wrap={false}
        >
            <View
                style={[
                    styles.pl4,
                    styles.br,
                    {
                        flexGrow: 0,
                        paddingTop: 4,
                        paddingBottom: 4,
                        flexBasis: 25,
                    },
                ]}
            >
                <Text style={[{ color: "#363636", lineHeight: 1 }]}>{no}</Text>
            </View>
            <View
                style={[
                    styles.pl4,
                    styles.br,
                    {
                        flexGrow: 0,
                        paddingTop: 4,
                        paddingBottom: 4,
                        flexBasis: 75,
                        flexDirection: "row",
                    },
                ]}
            >
                <Text
                    style={[
                        (row.type === "inbound" && styles.bgSuccess) ||
                            (row.type === "outbound" && styles.bgWarning) ||
                            styles.bgSuccess,
                        {
                            lineHeight: 0,
                            paddingVertical: 2,
                            paddingHorizontal: 4,
                            borderRadius: 4,
                            flexGrow: 0,
                        },
                    ]}
                >
                    {row.type === "inbound" ? "Restocked" : " Pulled Out"}
                </Text>
            </View>
            <View
                style={[
                    styles.pl4,
                    styles.br,
                    {
                        flexGrow: 1,
                        paddingTop: 4,
                        paddingBottom: 4,
                        flexBasis: 90,
                    },
                ]}
            >
                <Text style={[{ color: "#363636", lineHeight: 1 }]}>
                    {requestedBy}
                </Text>
            </View>
            <View
                style={[
                    styles.pl4,
                    styles.br,
                    {
                        flexGrow: 0,
                        paddingTop: 4,
                        paddingBottom: 4,
                        flexBasis: 120,
                    },
                ]}
            >
                <Text style={[{ color: "#363636", lineHeight: 1 }]}>
                    {row.date ? fDateTime(row.date) : ""}
                </Text>
            </View>
            <View
                style={[
                    styles.pl4,
                    styles.br,
                    {
                        flexGrow: 0,
                        paddingTop: 4,
                        paddingBottom: 4,
                        flexBasis: 75,
                    },
                ]}
            >
                <Text style={[{ color: "#363636", lineHeight: 1 }]}>
                    {`${row.type === "inbound" ? "+" : "-"} (${row.qty})`}
                </Text>
            </View>
            <View
                style={[
                    styles.pl4,
                    styles.br,
                    {
                        flexGrow: 0,
                        paddingTop: 4,
                        paddingBottom: 4,
                        flexBasis: 75,
                    },
                ]}
            >
                <Text style={[{ color: "#363636", lineHeight: 1 }]}>
                    {row.previous_qty}
                </Text>
            </View>
        </View>
    );
}

function Footer() {
    return (
        <View style={[styles.gridContainer, styles.footer]} fixed>
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
                    &copy; FIAFI Group Company, {YEAR}. All Rights Reserved.
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
                    render={({ pageNumber, totalPages }) =>
                        `${FORMATTED_DATE} Page ${pageNumber} / ${totalPages}`
                    }
                ></Text>
            </View>
        </View>
    );
}
