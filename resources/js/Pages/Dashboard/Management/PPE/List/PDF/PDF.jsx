/* eslint-disable jsx-a11y/alt-text */
import { Page, View, Text, Image, Document } from "@react-pdf/renderer";
// utils
import { styles } from "./PDFStyles";
import { format } from "date-fns";
import { fCurrencyNumber } from "@/utils/formatNumber";
import { sentenceCase } from "change-case";
import { fDate } from "@/utils/formatTime";
import { currencies } from "@/_mock/arrays/_currencies";

// ----------------------------------------------------------------------

const FORMATTED_DATE = format(new Date(), "MM/dd/yy");
const YEAR = new Date().getFullYear();
export function PDF(props) {
    const { ppe } = props;

    const getLengthByStatus = (status) =>
        ppe.filter((item) => item.status === status).length;

    return (
        <Document title={""}>
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
                    <Text style={[styles.h2]}>PPE Tracker</Text>
                </View>

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
                                        {ppe.length}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 8,
                                            color: "#637381",
                                        }}
                                    >
                                        items
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
                                <Text style={[styles.h6, styles.success]}>
                                    In Stock
                                </Text>
                                <View style={{ flexDirection: "row" }}>
                                    <Text
                                        style={[
                                            styles.bold,
                                            styles.pr4,
                                            { fontSize: 8 },
                                        ]}
                                    >
                                        {getLengthByStatus("in_stock")}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 8,
                                            color: "#637381",
                                        }}
                                    >
                                        items
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
                                <Text style={[styles.h6, styles.info]}>
                                    Need Reorder
                                </Text>
                                <View style={{ flexDirection: "row" }}>
                                    <Text
                                        style={[
                                            styles.bold,
                                            styles.pr4,
                                            { fontSize: 8 },
                                        ]}
                                    >
                                        {getLengthByStatus("need_reorder")}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 8,
                                            color: "#637381",
                                        }}
                                    >
                                        items
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
                                <Text style={[styles.h6, styles.warning]}>
                                    Low Stock
                                </Text>
                                <View style={{ flexDirection: "row" }}>
                                    <Text
                                        style={[
                                            styles.bold,
                                            styles.pr4,
                                            { fontSize: 8 },
                                        ]}
                                    >
                                        {getLengthByStatus("low_stock")}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 8,
                                            color: "#637381",
                                        }}
                                    >
                                        items
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
                                    Out Of Stock
                                </Text>
                                <View style={{ flexDirection: "row" }}>
                                    <Text
                                        style={[
                                            styles.bold,
                                            styles.pr4,
                                            { fontSize: 8 },
                                        ]}
                                    >
                                        {getLengthByStatus("out_of_stock")}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 8,
                                            color: "#637381",
                                        }}
                                    >
                                        items
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

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
                            style={[
                                styles.bold,
                                { color: "#363636", lineHeight: 1 },
                            ]}
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
                                flexBasis: 180,
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.bold,
                                { color: "#363636", lineHeight: 1 },
                            ]}
                        >
                            Product
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
                                flexBasis: 60,
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.bold,
                                { color: "#363636", lineHeight: 1 },
                            ]}
                        >
                            Qty/Min
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
                                flexBasis: 60,
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.bold,
                                { color: "#363636", lineHeight: 1 },
                            ]}
                        >
                            Unit
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
                                flexBasis: 95,
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.bold,
                                { color: "#363636", lineHeight: 1 },
                            ]}
                        >
                            Price
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
                                flexBasis: 70,
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.bold,
                                { color: "#363636", lineHeight: 1 },
                            ]}
                        >
                            Date Created
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
                                flexBasis: 70,
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.bold,
                                { color: "#363636", lineHeight: 1 },
                            ]}
                        >
                            Date Updated
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
                                flexBasis: 70,
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
                </View>

                <View>
                    {ppe.map((item, idx) => (
                        <TableRow
                            key={item.inventory_id}
                            row={item}
                            idx={idx}
                        />
                    ))}
                </View>

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
                            render={({ pageNumber, totalPages }) =>
                                `${FORMATTED_DATE} Page ${pageNumber} / ${totalPages}`
                            }
                        ></Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
}

function TableRow({ row, idx }) {
    const {
        item,
        img_src,
        date_created,
        date_updated,
        status,
        item_price,
        item_currency,
        current_stock_qty,
        min_qty,
        try: unit,
    } = row;

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
                        paddingVertical: 4,
                        flexBasis: 25,
                    },
                ]}
            >
                <Text style={[{ color: "#363636", lineHeight: 1 }]}>
                    {idx + 1}
                </Text>
            </View>
            <View
                style={[
                    styles.pl4,
                    styles.br,
                    {
                        flexGrow: 0,
                        flexBasis: 180,
                        position: "relative",
                        paddingVertical: 4,
                    },
                ]}
            >
                <View
                    style={[
                        styles.avatar,
                        {
                            position: "absolute",
                            left: 3,
                            top: 3,
                        },
                    ]}
                >
                    <Image
                        style={[
                            styles.avatarImg,
                            { width: 12, height: 12, borderRadius: 0 },
                        ]}
                        src={
                            img_src
                                ? window.location.origin +
                                  `/storage/media/photos/inventory/${img_src}`
                                : window.location.origin +
                                  "/storage/assets/placeholder.svg"
                        }
                    />
                </View>
                <Text
                    style={[
                        {
                            marginLeft: 12,
                            color: "#363636",
                            lineHeight: 1,
                        },
                    ]}
                >
                    {item}
                </Text>
            </View>
            <View
                style={[
                    styles.pl4,
                    styles.br,
                    {
                        flexGrow: 0,
                        paddingVertical: 4,
                        flexBasis: 60,
                    },
                ]}
            >
                <Text
                    style={[
                        {
                            color: "#363636",
                            lineHeight: 1,
                            textTransform: "capitalize",
                        },
                    ]}
                >
                    {current_stock_qty}/{min_qty}
                </Text>
            </View>
            <View
                style={[
                    styles.pl4,
                    styles.br,
                    {
                        flexGrow: 0,
                        paddingVertical: 4,
                        flexBasis: 60,
                    },
                ]}
            >
                <Text style={[{ color: "#363636", lineHeight: 1 }]}>
                    {unit}
                </Text>
            </View>
            <View
                style={[
                    styles.pl4,
                    styles.br,
                    {
                        flexGrow: 0,
                        paddingVertical: 4,
                        flexBasis: 95,
                    },
                ]}
            >
                <Text style={[{ color: "#363636", lineHeight: 1 }]}>
                    {item_currency} {fCurrencyNumber(item_price)}
                </Text>
            </View>
            <View
                style={[
                    styles.pl4,
                    styles.br,
                    {
                        flexGrow: 0,
                        paddingVertical: 4,
                        flexBasis: 70,
                    },
                ]}
            >
                <Text style={[{ color: "#363636", lineHeight: 1 }]}>
                    {fDate(date_created)}
                </Text>
            </View>
            <View
                style={[
                    styles.pl4,
                    styles.br,
                    {
                        flexGrow: 0,
                        paddingVertical: 4,
                        flexBasis: 70,
                    },
                ]}
            >
                <Text style={[{ color: "#363636", lineHeight: 1 }]}>
                    {fDate(date_updated)}
                </Text>
            </View>

            <View
                style={[
                    styles.pl4,
                    styles.br,
                    status === "out_of_stock"
                        ? styles.bgError
                        : status === "low_stock"
                        ? styles.bgWarning
                        : status === "need_reorder"
                        ? styles.bgInfo
                        : styles.bgSuccess,
                    {
                        flexGrow: 0,
                        paddingVertical: 4,
                        flexBasis: 70,
                    },
                ]}
            >
                <Text
                    style={[
                        styles.bold,
                        {
                            color: "#f0f0f0",
                            textTransform: "capitalize",
                            lineHeight: 1,
                        },
                    ]}
                >
                    {status ? sentenceCase(status) : ""}
                </Text>
            </View>
        </View>
    );
}
