import { DRAWING_LIMITS } from "./limits";
/** Rejects SVG/HTML and oversized header dimensions before allocating a decoded browser bitmap. */
export function drawingRasterDimensions(bytes: Uint8Array, mime: string): { width: number; height: number } {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    let width = 0;
    let height = 0;
    const ascii = (at: number, count: number) => String.fromCharCode(...bytes.subarray(at, at + count));
    if (mime === "image/png" && bytes.length >= 24 && bytes[0] === 137 && ascii(1, 7) === "PNG\r\n\u001a\n" && ascii(12, 4) === "IHDR") {
        width = view.getUint32(16);
        height = view.getUint32(20);
    } else if (mime === "image/gif" && bytes.length >= 10 && ["GIF87a", "GIF89a"].includes(ascii(0, 6))) {
        width = view.getUint16(6, true);
        height = view.getUint16(8, true);
    } else if (mime === "image/webp" && bytes.length >= 30 && ascii(0, 4) === "RIFF" && ascii(8, 4) === "WEBP") {
        const format = ascii(12, 4);
        if (format === "VP8X") {
            width = 1 + bytes[24]! + (bytes[25]! << 8) + (bytes[26]! << 16);
            height = 1 + bytes[27]! + (bytes[28]! << 8) + (bytes[29]! << 16);
        } else if (format === "VP8 " && bytes[23] === 157 && bytes[24] === 1 && bytes[25] === 42) {
            width = view.getUint16(26, true) & 0x3fff;
            height = view.getUint16(28, true) & 0x3fff;
        } else if (format === "VP8L" && bytes[20] === 47) {
            const bits = view.getUint32(21, true);
            width = 1 + (bits & 0x3fff);
            height = 1 + ((bits >>> 14) & 0x3fff);
        }
    } else if (mime === "image/jpeg" && bytes.length >= 4 && bytes[0] === 255 && bytes[1] === 216) {
        let offset = 2;
        while (offset + 3 < bytes.length) {
            if (bytes[offset++] !== 255) break;
            while (bytes[offset] === 255) offset++;
            const marker = bytes[offset++];
            if (marker === undefined || marker === 217 || marker === 218) break;
            if (marker === 1 || (marker >= 208 && marker <= 215)) continue;
            if (offset + 2 > bytes.length) break;
            const length = view.getUint16(offset);
            if (length < 2 || offset + length > bytes.length) break;
            if ([192, 193, 194, 195, 197, 198, 199, 201, 202, 203, 205, 206, 207].includes(marker) && length >= 7) {
                height = view.getUint16(offset + 3);
                width = view.getUint16(offset + 5);
                break;
            }
            offset += length;
        }
    }
    if (!width || !height || width > DRAWING_LIMITS.side || height > DRAWING_LIMITS.side || width * height > DRAWING_LIMITS.pixels)
        throw new Error("Bitmap is not a supported raster or exceeds 8192 pixels / 24 megapixels");
    return { width, height };
}
/** Reads embedded raster dimensions without a browser decoder or network access. */
export function drawingRasterSourceDimensions(source: string): { width: number; height: number } {
    const comma = source.indexOf(",");
    const mime = source.slice(5, source.indexOf(";"));
    if (!/^data:image\/(png|jpeg|webp|gif);base64,/.test(source)) throw new Error("Expected embedded raster data");
    const binary = atob(source.slice(comma + 1));
    return drawingRasterDimensions(
        Uint8Array.from(binary, (character) => character.charCodeAt(0)),
        mime
    );
}
