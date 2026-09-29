type PathLeaf = string | number | bigint | boolean | symbol | null | undefined;

type AppendPath<Parent extends string, Segment extends string, Separator extends string = "."> =
    [Segment] extends [never] ? Parent : [Parent] extends [never] ? Segment : `${Parent}${Separator}${Segment}`;

type IndexLabels<T extends readonly unknown[]> = { [Index in keyof T]: Index }[number];
type NumericIndex<Index> = Index extends `${infer Value extends number}` ? Value : Index extends number ? Index : never;
type ArrayIndex<T extends readonly unknown[]> = NumericIndex<IndexLabels<T>> & keyof T;

type ArrayPaths<T extends readonly unknown[], Parent extends string> =
    | AppendPath<Parent, `[${ArrayIndex<T>}]`, "">
    | AllPaths<T[number], AppendPath<Parent, `[${ArrayIndex<T>}]`, "">>;

type ObjectPaths<T, Parent extends string> = {
    [Key in keyof T & string]: AppendPath<Parent, Key> | AllPaths<T[Key], AppendPath<Parent, Key>>;
}[keyof T & string];

/**
 * Existing consumer path contract: dot-separated object keys and bracket array
 * indexes. Tuple paths intentionally recurse through the union of all element
 * types. Objects containing non-string keys retain their parent path (including
 * Date's symbol-keyed methods). This also preserves the existing tuple-index
 * behavior when extra properties are intersected with a tuple.
 */
export type AllPaths<T, ParentPath extends string = never> = T extends PathLeaf
    ? ParentPath
    : unknown extends T
      ? AppendPath<ParentPath, string>
      : T extends readonly unknown[]
        ? ArrayPaths<T, ParentPath>
        : [keyof T] extends [string]
          ? ObjectPaths<T, ParentPath>
          : ParentPath;
