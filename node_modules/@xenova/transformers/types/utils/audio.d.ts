/**
 * Helper function to read audio from a path/URL.
 * @param {string|URL} url The path/URL to load the audio from.
 * @param {number} sampling_rate The sampling rate to use when decoding the audio.
 * @returns {Promise<Float32Array>} The decoded audio as a `Float32Array`.
 */
export function read_audio(url: string | URL, sampling_rate: number): Promise<Float32Array>;
/**
 * Creates a frequency bin conversion matrix used to obtain a mel spectrogram.
 * @param {number} sr Sample rate of the audio waveform.
 * @param {number} n_fft Number of frequencies used to compute the spectrogram (should be the same as in `stft`).
 * @param {number} n_mels Number of mel filters to generate.
 * @returns {number[][]} Projection matrix to go from a spectrogram to a mel spectrogram.
 */
export function getMelFilters(sr: number, n_fft: number, n_mels?: number): number[][];
//# sourceMappingURL=audio.d.ts.map