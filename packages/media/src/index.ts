// Public API of @repo/media — the Media & Files package.
//
// Everything a client component needs to browse, upload, pick and manage CDN
// media for the current project is exported from here. See README for usage.

export {
  MediaProvider,
  useMedia,
  readMediaProjectIdFromCookies,
  DEFAULT_PLATFORM_URL,
  CdnConnectionError,
} from "./context/MediaProvider";
export type { MediaContextValue } from "./context/MediaProvider";
export type { TokenSource, CdnConnectionOptions } from "./client/platform-connection";
export { fetchCdnConnection } from "./client/platform-connection";

export { CdnApiClient, CdnApiError } from "./client/cdn-api-client";

export {
  useMediaFiles,
  useMediaStats,
  useMediaFolders,
  useMediaFolder,
  useMediaFolderByName,
  useMediaFile,
  useMediaPublicFile,
  useMediaSignedUrl,
  useMediaVariantSignedUrls,
} from "./hooks/useMediaData";
export type { UseMediaFilesOptions } from "./hooks/useMediaData";

export {
  useMediaUpload,
  useMediaUploadMultiple,
  useMediaDelete,
  useMediaBulk,
  useMediaUpdate,
  useCreateFolder,
  useDeleteFolder,
  useUpdateVisibility,
} from "./hooks/useMediaMutations";

export {
  getMediaKind,
  isImageFile,
  getThumbnailUrl,
  formatBytes,
  formatDate,
} from "./utils/media";
export type { MediaKind } from "./utils/media";

export { MediaLibrary } from "./components/MediaLibrary";
export type { MediaLibraryProps } from "./components/MediaLibrary";
export { MediaPicker } from "./components/MediaPicker";
export type { MediaPickerProps } from "./components/MediaPicker";
export { ImagePicker } from "./components/ImagePicker";
export type { ImagePickerProps } from "./components/ImagePicker";
export { MediaGrid } from "./components/MediaGrid";
export type { MediaGridProps } from "./components/MediaGrid";
export { MediaList } from "./components/MediaList";
export type { MediaListProps } from "./components/MediaList";
export { MediaThumb } from "./components/MediaThumb";
export type { MediaThumbProps } from "./components/MediaThumb";
export { MediaUploader } from "./components/MediaUploader";
export type { MediaUploaderProps, QueuedUpload } from "./components/MediaUploader";
export { MediaPreview } from "./components/MediaPreview";
export type { MediaPreviewProps } from "./components/MediaPreview";

export type {
  CdnFile,
  CdnFileVariant,
  CdnTag,
  CdnFolderRef,
  CdnVisibility,
  CdnFileStatus,
  CdnPaginationMeta,
  CdnFileList,
  CdnStats,
  CdnFolder,
  CdnUploadResult,
  CdnMultiUploadResult,
  CdnChunkStatus,
  CdnChunkPending,
  CdnChunkComplete,
  CdnUpdateFileBody,
  CdnBulkAction,
  CdnBulkActionBody,
  CdnBulkActionResult,
  CdnSignedUrlResult,
  CdnConnection,
  CdnFileQuery,
  CdnUploadOptions,
} from "./types";