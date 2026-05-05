let pendingProfileFile: File | null | undefined = undefined;

export const profileFile = {
  set: (file: File | null | undefined) => {
    pendingProfileFile = file;
  },
  get: (): File | null | undefined => pendingProfileFile,
  clear: () => {
    pendingProfileFile = undefined;
  },
};