/**
 * Extends the Navigator interface to include the msSaveBlob method, which is specific to Internet explorer.
 *
 * @property {Function} msSaveBlob - A function that takes a Blob and an optional default file name,
 *                                   and returns a boolean indicating success or failure of the save operation.
 */
interface Navigator {
  msSaveBlob?: (blob: Blob, defaultName?: string) => boolean;
}
