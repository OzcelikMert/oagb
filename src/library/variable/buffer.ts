// @ts-ignore
import {Readable} from "stream";

declare global {
    interface Buffer {
        convertToStream(): Readable
    }
}

// @ts-ignore
Buffer.prototype.convertToStream = function () {
    const readable = new Readable();
    readable._read = () => {};
    readable.push(this);
    readable.push(null);
    return readable;
};

export default {}