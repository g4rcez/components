import { Any } from "../../types";
import { Filter } from "./filter";
import { Group } from "./group";
import { Sort } from "./sort";
import { TableOperationProps, valueFromType } from "./table-lib";

export const Metadata = <T extends Any>(props: TableOperationProps<T>) => (
    <header className="__table-metadata__slot-1">
        <div className="__table-metadata__slot-2 __table-metadata__slot-extra-1">
            <div className="__table-metadata__slot-3">
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
            <ul className="__table-metadata__slot-4 __table-metadata__slot-extra-2">
                {props.filters.map((x) => (
                    <li key={`filter-table-${x.id}`} className="__table-metadata__border __table-metadata__slot-5">
                        <span>
                            <span className="__table-metadata__slot-6" aria-hidden="true" />
                            {x.label} {x.operation.label.toLowerCase()}:
                        </span>
                        <div className="__table-metadata__slot-7">
                            <span aria-hidden="true" className="__table-metadata__slot-8 __table-metadata__tw-final-1">
                                {x.value || " "}
                            </span>
                            <input
                                type={x.type}
                                value={x.value as string}
                                className="[appearance:textfield] __table-metadata__slot-9 __table-metadata__state-1 __table-metadata__tw-final-2"
                                onChange={(e) => {
                                    const value = valueFromType(e.target);
                                    props.setFilters((prev) => prev.map((item) => (x.id === item.id ? { ...item, value } : item)));
                                }}
                            />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    </header>
);
