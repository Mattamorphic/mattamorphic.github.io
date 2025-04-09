// Add the following declaration to provide type definitions for import.meta.glob
interface ImportMeta {
  glob: (pattern: string) => Record<
    string,
    () => Promise<{
      attributes: any;
      default: string;
    }>
  >;
}
