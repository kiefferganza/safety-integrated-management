import LoadingScreen from "@/Components/loading-screen";
import { useRenderPDF } from "@/hooks/useRenderPDF";

export default function RenderedPDFViewer({
    style,
    className,
    innerRef,
    showToolbar = true,
    title = "",
    author = "",
    description = "",
    props = {},
    ...other
}) {
    const { url, loading, error } = useRenderPDF({
        title,
        author,
        description,
        props,
    });

    const src = url ? `${url}#toolbar=${showToolbar ? 1 : 0}` : null;

    if (loading)
        return (
            <div className={className} style={style}>
                <LoadingScreen />
            </div>
        );

    if (error) {
        console.log({ error });
        return (
            <div className={className} style={style}>
                <h2>Something went wrong!</h2>
                {/* {JSON.stringify(error)} */}
            </div>
        );
    }

    return (
        <iframe
            src={src}
            ref={innerRef}
            style={style}
            className={className}
            {...other}
        />
    );
}
