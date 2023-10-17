/**
 * @file Helper module for mathematical processing.
 *
 * These functions and classes are only used internally,
 * meaning an end-user shouldn't need to access anything here.
 *
 * @module utils/maths
 */
/**
 * @typedef {Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array} TypedArray
 * @typedef {BigInt64Array | BigUint64Array} BigTypedArray
 * @typedef {TypedArray | BigTypedArray} AnyTypedArray
 */
/**
 * @param {TypedArray} input
 */
export function interpolate_data(input: TypedArray, [in_channels, in_height, in_width]: [any, any, any], [out_height, out_width]: [any, any], mode?: string, align_corners?: boolean): any;
/**
 * Helper method to transpose a `AnyTypedArray` directly
 * @param {T} array
 * @template {AnyTypedArray} T
 * @param {number[]} dims
 * @param {number[]} axes
 * @returns {[T, number[]]} The transposed array and the new shape.
 */
export function transpose_data<T extends AnyTypedArray>(array: T, dims: number[], axes: number[]): [T, number[]];
/**
 * Compute the softmax of an array of numbers.
 *
 * @param {number[]} arr The array of numbers to compute the softmax of.
 * @returns {number[]} The softmax array.
 */
export function softmax(arr: number[]): number[];
/**
 * Calculates the logarithm of the softmax function for the input array.
 * @param {number[]} arr The input array to calculate the log_softmax function for.
 * @returns {any} The resulting log_softmax array.
 */
export function log_softmax(arr: number[]): any;
/**
 * Calculates the dot product of two arrays.
 * @param {number[]} arr1 The first array.
 * @param {number[]} arr2 The second array.
 * @returns {number} The dot product of arr1 and arr2.
 */
export function dot(arr1: number[], arr2: number[]): number;
/**
 * Get the top k items from an iterable, sorted by descending order
 *
 * @param {Array} items The items to be sorted
 * @param {number} [top_k=0] The number of top items to return (default: 0 = return all)
 * @returns {Array} The top k items, sorted by descending order
 */
export function getTopItems(items: any[], top_k?: number): any[];
/**
 * Computes the cosine similarity between two arrays.
 *
 * @param {number[]} arr1 The first array.
 * @param {number[]} arr2 The second array.
 * @returns {number} The cosine similarity between the two arrays.
 */
export function cos_sim(arr1: number[], arr2: number[]): number;
/**
 * Calculates the magnitude of a given array.
 * @param {number[]} arr The array to calculate the magnitude of.
 * @returns {number} The magnitude of the array.
 */
export function magnitude(arr: number[]): number;
/**
 * Returns the value and index of the minimum element in an array.
 * @param {number[]} arr array of numbers.
 * @returns {number[]} the value and index of the minimum element, of the form: [valueOfMin, indexOfMin]
 * @throws {Error} If array is empty.
 */
export function min(arr: number[]): number[];
/**
 * Returns the value and index of the maximum element in an array.
 * @param {number[]} arr array of numbers.
 * @returns {number[]} the value and index of the maximum element, of the form: [valueOfMax, indexOfMax]
 * @throws {Error} If array is empty.
 */
export function max(arr: number[]): number[];
/**
 * Return the Discrete Fourier Transform sample frequencies.
 *
 * Code adapted from https://github.com/numpy/numpy/blob/25908cacd19915bf3ddd659c28be28a41bd97a54/numpy/fft/helper.py#L173-L221
 * Original Python doc: https://numpy.org/doc/stable/reference/generated/numpy.fft.rfftfreq.html
 * @example
 * rfftfreq(400, 1 / 16000) // (201) [0, 40, 80, 120, 160, 200, ..., 8000]
 * @param {number} n Window length
 * @param {number} [d = 1.0] Sample spacing (inverse of the sampling rate). Defaults to 1.
 * @throws {TypeError} If n is not an integer.
 * @returns {number[]} Array of length `Math.floor(n / 2) + 1;` containing the sample frequencies.
 */
export function rfftfreq(n: number, d?: number): number[];
/**
 * Performs median filter on the provided data. Padding is done by mirroring the data.
 * @param {AnyTypedArray} data The input array
 * @param {number} windowSize The window size
 */
export function medianFilter(data: AnyTypedArray, windowSize: number): any;
/**
 * Helper function to round a number to a given number of decimals
 * @param {number} num The number to round
 * @param {number} decimals The number of decimals
 * @returns {number} The rounded number
 */
export function round(num: number, decimals: number): number;
/**
 * FFT class provides functionality for performing Fast Fourier Transform on arrays
 * Code adapted from https://www.npmjs.com/package/fft.js
 */
export class FFT {
    /**
     * @param {number} size The size of the input array. Must be a power of two and bigger than 1.
     * @throws {Error} FFT size must be a power of two and bigger than 1.
     */
    constructor(size: number);
    size: number;
    _csize: number;
    table: Float32Array;
    _width: number;
    _bitrev: Int32Array;
    /**
     * Create a complex number array with size `2 * size`
     *
     * @returns {Float32Array} A complex number array with size `2 * size`
     */
    createComplexArray(): Float32Array;
    /**
     * Converts a complex number representation stored in a Float32Array to an array of real numbers.
     *
     * @param {Float32Array} complex The complex number representation to be converted.
     * @param {number[]} [storage] An optional array to store the result in.
     * @returns {number[]} An array of real numbers representing the input complex number representation.
     */
    fromComplexArray(complex: Float32Array, storage?: number[]): number[];
    /**
     * Convert a real-valued input array to a complex-valued output array.
     * @param {Float32Array} input The real-valued input array.
     * @param {Float32Array} [storage] Optional buffer to store the output array.
     * @returns {Float32Array} The complex-valued output array.
     */
    toComplexArray(input: Float32Array, storage?: Float32Array): Float32Array;
    /**
     * Completes the spectrum by adding its mirrored negative frequency components.
     * @param {Float32Array} spectrum The input spectrum.
     * @returns {void}
     */
    completeSpectrum(spectrum: Float32Array): void;
    /**
     * Performs a Fast Fourier Transform (FFT) on the given input data and stores the result in the output buffer.
     *
     * @param {Float32Array} out The output buffer to store the result.
     * @param {Float32Array} data The input data to transform.
     *
     * @throws {Error} Input and output buffers must be different.
     *
     * @returns {void}
     */
    transform(out: Float32Array, data: Float32Array): void;
    /**
     * Performs a real-valued forward FFT on the given input buffer and stores the result in the given output buffer.
     * The input buffer must contain real values only, while the output buffer will contain complex values. The input and
     * output buffers must be different.
     *
     * @param {Float32Array} out The output buffer.
     * @param {Float32Array} data The input buffer containing real values.
     *
     * @throws {Error} If the input and output buffers are the same.
     */
    realTransform(out: Float32Array, data: Float32Array): void;
    /**
     * Performs an inverse FFT transformation on the given `data` array, and stores the result in `out`.
     * The `out` array must be a different buffer than the `data` array. The `out` array will contain the
     * result of the transformation. The `data` array will not be modified.
     *
     * @param {Float32Array} out The output buffer for the transformed data.
     * @param {Float32Array} data The input data to transform.
     * @throws {Error} If `out` and `data` refer to the same buffer.
     * @returns {void}
     */
    inverseTransform(out: Float32Array, data: Float32Array): void;
    /**
     * Performs a radix-4 implementation of a discrete Fourier transform on a given set of data.
     *
     * @param {Float32Array} out The output buffer for the transformed data.
     * @param {Float32Array} data The input buffer of data to be transformed.
     * @param {number} inv A scaling factor to apply to the transform.
     * @returns {void}
     */
    _transform4(out: Float32Array, data: Float32Array, inv: number): void;
    /**
     * Performs a radix-2 implementation of a discrete Fourier transform on a given set of data.
     *
     * @param {Float32Array} data The input buffer of data to be transformed.
     * @param {Float32Array} out The output buffer for the transformed data.
     * @param {number} outOff The offset at which to write the output data.
     * @param {number} off The offset at which to begin reading the input data.
     * @param {number} step The step size for indexing the input data.
     * @returns {void}
     */
    _singleTransform2(data: Float32Array, out: Float32Array, outOff: number, off: number, step: number): void;
    /**
     * Performs radix-4 transformation on input data of length 8
     *
     * @param {Float32Array} data Input data array of length 8
     * @param {Float32Array} out Output data array of length 8
     * @param {number} outOff Index of output array to start writing from
     * @param {number} off Index of input array to start reading from
     * @param {number} step Step size between elements in input array
     * @param {number} inv Scaling factor for inverse transform
     *
     * @returns {void}
     */
    _singleTransform4(data: Float32Array, out: Float32Array, outOff: number, off: number, step: number, inv: number): void;
    /**
     * Real input radix-4 implementation
     * @param {Float32Array} out Output array for the transformed data
     * @param {Float32Array} data Input array of real data to be transformed
     * @param {number} inv The scale factor used to normalize the inverse transform
     */
    _realTransform4(out: Float32Array, data: Float32Array, inv: number): void;
    /**
     * Performs a single real input radix-2 transformation on the provided data
     *
     * @param {Float32Array} data The input data array
     * @param {Float32Array} out The output data array
     * @param {number} outOff The output offset
     * @param {number} off The input offset
     * @param {number} step The step
     *
     * @returns {void}
     */
    _singleRealTransform2(data: Float32Array, out: Float32Array, outOff: number, off: number, step: number): void;
    /**
     * Computes a single real-valued transform using radix-4 algorithm.
     * This method is only called for len=8.
     *
     * @param {Float32Array} data The input data array.
     * @param {Float32Array} out The output data array.
     * @param {number} outOff The offset into the output array.
     * @param {number} off The offset into the input array.
     * @param {number} step The step size for the input array.
     * @param {number} inv The value of inverse.
     */
    _singleRealTransform4(data: Float32Array, out: Float32Array, outOff: number, off: number, step: number, inv: number): void;
}
export type TypedArray = Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array;
export type BigTypedArray = BigInt64Array | BigUint64Array;
export type AnyTypedArray = TypedArray | BigTypedArray;
//# sourceMappingURL=maths.d.ts.map