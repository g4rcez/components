"use client";
import { AnimatePresence } from "motion/react";
import { ComponentProps, useEffect, useMemo } from "react";
import { useReducer } from "use-typed-reducer";
import { useTweaks } from "../../hooks/use-tweaks";
import { Any } from "../../types";
import { FilterConfig } from "./filter";
import { GroupItem } from "./group";
import { InnerTable, InnerTableProps } from "./inner-table";
import { Metadata } from "./metadata";
import { Sorter } from "./sort";
import { Col, createOptionCols, TableOperationProps } from "./table-lib";
import { TableContextProps, TableProvider } from "./table.context";


export type TableProps<T extends Any> = Pick<InnerTableProps<T>, "cols" | "rows" | "loadingMore" | "border" | "Aside"> & {
  name: string;
} & Partial<
  TableOperationProps<T> & {
    loading: boolean;
    reference: keyof T;
    operations: boolean;
    useControl: boolean;
    inlineFilter: boolean;
    inlineSorter: boolean;
    sticky: number | null;
    onScrollEnd: () => void;
    getScrollRef?: () => HTMLElement | undefined;
    getRowProps: (row: T) => ComponentProps<"tr">;
  }
>;

const dispatcherFun = <Prev extends Any, T extends Prev | ((prev: Prev) => Prev)>(prev: Prev, setter: T) =>
  typeof setter === "function" ? setter(prev) : setter;

type DispatcherFun<T extends Any> = T | ((prev: T) => T);

const compareAndExec = <T extends any[]>(prev: T, state: T, exec?: (t: T) => void) => (prev === state ? undefined : exec?.(state));

export const Table = <T extends Any>(props: TableProps<T>) => {
  const tweaks = useTweaks();
  const contextState = useMemo((): TableContextProps => ({
    sticky: props.sticky === undefined ? tweaks.table.sticky ?? undefined : props.sticky ?? undefined
  }), [props.sticky, tweaks.table.sticky]);
  const operations = props.operations ?? tweaks.table.operations ?? true;
  const optionCols = useMemo(() => createOptionCols(props.cols), [props.cols]);
  const [state, dispatch] = useReducer(
    {
      cols: props.cols as Col<T>[],
      sorters: (props.sorters ?? []) as Sorter<T>[],
      groups: (props.groups ?? []) as GroupItem<T>[],
      filters: (props.filters ?? []) as FilterConfig<T>[],
    },
    (get) => {
      const create =
        <T extends Any>(key: string) =>
          (arg: T) => {
            const state = get.state();
            return { ...state, [key]: dispatcherFun(state[key as keyof typeof state], arg as any) };
          };
      return {
        cols: create<DispatcherFun<Col<T>[]>>("cols"),
        sorters: create<DispatcherFun<Sorter<T>[]>>("sorters"),
        groups: create<DispatcherFun<GroupItem<T>[]>>("groups"),
        filters: create<DispatcherFun<FilterConfig<T>[]>>("filters"),
      };
    },
    {
      postMiddleware: [
        (state, prev) => {
          props.set?.(state as any);
          compareAndExec(prev?.filters ?? [], state.filters ?? [], props.setFilters);
          compareAndExec(prev?.sorters ?? [], state.sorters ?? [], props.setSorters);
          compareAndExec(prev?.groups ?? [], state.groups ?? [], props.setGroups);
          compareAndExec(prev?.cols ?? [], state.cols ?? [], props.setCols);
          return state;
        },
      ],
    }
  );

  useEffect(() => {
    dispatch.cols(props.cols);
  }, [props.cols]);

  return (
    <TableProvider value={contextState}>
      <AnimatePresence initial={false}>
        {operations ? (
          <Metadata
            cols={state.cols}
            rows={props.rows}
            options={optionCols}
            groups={state.groups}
            filters={state.filters}
            setCols={dispatch.cols}
            sorters={state.sorters}
            setGroups={dispatch.groups}
            setFilters={dispatch.filters}
            setSorters={dispatch.sorters}
            pagination={props.pagination ?? null}
            inlineFilter={props.inlineFilter ?? true}
            inlineSorter={props.inlineSorter ?? true}
          />
        ) : null}
        {state.groups.length === 0 ? (
          <InnerTable
            {...props}
            index={0}
            cols={state.cols}
            options={optionCols}
            groups={state.groups}
            filters={state.filters}
            optionCols={optionCols}
            setCols={dispatch.cols}
            sorters={state.sorters}
            setGroups={dispatch.groups}
            setFilters={dispatch.filters}
            setSorters={dispatch.sorters}
            onScrollEnd={props.onScrollEnd}
            pagination={props.pagination ?? null}
            inlineFilter={props.inlineFilter ?? true}
            inlineSorter={props.inlineSorter ?? true}
          />
        ) : (
          <div className="flex flex-wrap gap-4">
            {state.groups.map((group, index) => (
              <div className="min-w-full" key={`group-${group.groupId}`}>
                <InnerTable
                  {...props}
                  group={group}
                  index={index}
                  cols={state.cols}
                  pagination={null}
                  rows={group.rows}
                  options={optionCols}
                  groups={state.groups}
                  filters={state.filters}
                  optionCols={optionCols}
                  setCols={dispatch.cols}
                  sorters={state.sorters}
                  setGroups={dispatch.groups}
                  setFilters={dispatch.filters}
                  setSorters={dispatch.sorters}
                  onScrollEnd={props.onScrollEnd}
                  inlineFilter={props.inlineFilter ?? true}
                  inlineSorter={props.inlineSorter ?? true}
                />
              </div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </TableProvider>
  );
};
