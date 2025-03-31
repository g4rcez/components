import { Any } from "../../types";
import { Filter } from "./filter";
import { Group } from "./group";
import { Sort } from "./sort";
import { TableOperationProps, valueFromType } from "./table-lib";

export const Metadata = <T extends Any>(props: TableOperationProps<T>) => (
    <header className="min-w-full mb-1">
        <div className="flex flex-wrap min-w-full items-center justify-between gap-x-4 gap-y-1">
            <div className="flex w-fit items-centeend gap-4 whitespace-nowrap py-2">
                <span>
                    <Filter cols={props.cols} options={props.options} filters={props.filters} set={props.setFilters} />
                </span>
                <span>
                    <Sort options={props.options} cols={props.cols} sorters={props.sorters} set={props.setSorters} />
                </span>
                <span>
                    <Group rows={props.rows} groups={props.groups} setGroups={props.setGroups} options={props.options} cols={props.cols} />
                </span>
            </div>
            <ul className="flex flex-wrap w-full flex-1 flex-grow flex-row items-center md:justify-end gap-4">
                {props.filters.map((x) => (
                    <li key={`filter-table-${x.id}`} className="flex gap-1 items-center rounded-xl border border-card-border px-4 py-0.5">
                        <span>
                            <span className="size-3 mr-2 aspect-square bg-primary inline-block rounded-full" aria-hidden="true" />
                            {x.label} {x.operation.label.toLowerCase()}:
                        </span>
                        <div className="relative w-min min-w-[1ch]">
                            <span aria-hidden="true" className="invisible whitespace-pre p-0">
                                {x.value || " "}
                            </span>
                            <input
                                type={x.type}
                                value={x.value as string}
                                className="absolute left-0 top-0 m-0 inline-block w-full bg-transparent p-0 placeholder-primary/70 outline-none [appearance:textfield] after:empty:text-primary/70 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                onChange={(e) => {
                                    const value = valueFromType(e.target);
                                    props.setFilters((prev) =>
                                        prev.map((item) =>
                                            x.id === item.id
                                                ? {
                                                      ...item,
                                                      value,
                                                  }
                                                : item
                                        )
                                    );
                                }}
                            />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    </header>
);
