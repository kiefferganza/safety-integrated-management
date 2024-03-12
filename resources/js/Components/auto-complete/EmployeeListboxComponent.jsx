import {
    forwardRef,
    createContext,
    useContext,
    useRef,
    useEffect,
} from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { VariableSizeList } from "react-window";

const LISTBOX_PADDING = 6; // px

function renderRow(props) {
    const { data, index, style } = props;
    const dataSet = data[index];

    const inlineStyle = {
        ...style,
        top: style.top + LISTBOX_PADDING,
    };

    return (
        <Box component="li" {...dataSet[0]} style={inlineStyle}>
            <Avatar
                sx={{ mr: 2, flexShrink: 0 }}
                alt={dataSet[1].fullname ?? ""}
                src={
                    dataSet[1]?.profile?.thumbnail ??
                    route("image", {
                        path: "assets/images/default-profile.jpg",
                        w: 128,
                        h: 128,
                        fit: "crop",
                    })
                }
            />
            <Typography variant="subtitle2" noWrap>
                {dataSet[1].fullname ?? ""}{" "}
                <Typography
                    component="span"
                    sx={{ textTransform: "capitalize" }}
                >
                    ({dataSet[1].position})
                </Typography>
            </Typography>
        </Box>
    );
}

const OuterElementContext = createContext({});

const OuterElementType = forwardRef((props, ref) => {
    const outerProps = useContext(OuterElementContext);
    return <div ref={ref} {...props} {...outerProps} />;
});

function useResetCache(data) {
    const ref = useRef(null);
    useEffect(() => {
        if (ref.current != null) {
            ref.current.resetAfterIndex(0, true);
        }
    }, [data]);
    return ref;
}

const EmployeeListboxComponent = forwardRef(function EmployeeListboxComponent(
    props,
    ref
) {
    const { children, ...other } = props;
    const itemData = [];
    children.forEach((item) => {
        itemData.push(item);
        itemData.push(...(item.children || []));
    });

    const itemCount = itemData.length;
    const itemSize = 52;

    const getChildSize = () => {
        return itemSize;
    };

    const getHeight = () => {
        if (itemCount > 8) {
            return 8 * itemSize;
        }
        return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
    };

    const gridRef = useResetCache(itemCount);

    return (
        <div ref={ref}>
            <OuterElementContext.Provider value={other}>
                <VariableSizeList
                    itemData={itemData}
                    height={getHeight() + 2 * LISTBOX_PADDING}
                    width="100%"
                    ref={gridRef}
                    outerElementType={OuterElementType}
                    innerElementType="ul"
                    itemSize={getChildSize}
                    overscanCount={5}
                    itemCount={itemCount}
                >
                    {renderRow}
                </VariableSizeList>
            </OuterElementContext.Provider>
        </div>
    );
});

export default EmployeeListboxComponent;
