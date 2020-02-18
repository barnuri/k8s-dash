import React, { useState } from 'react';

interface Props {
    data: any[];
    cols: Col[];
}

interface Col {
    title: string;
    value: (item: any) => string;
    style?: (item: any) => React.CSSProperties | undefined;
    customComponent?: (item: any) => any;
}

const getStyle = (col: Col, item: any): React.CSSProperties => (col.style && col.style(item)) || {};

export default (props: Props) => {
    const [orderBy, setOrderBy] = useState(props.cols[0] as Col);
    const [orderByDir, setOrderByDir] = useState('asc' as 'asc' | 'desc');

    const setSort = (colName: Col) => {
        if (colName.title === orderBy.title) {
            !orderByDir || orderByDir === 'asc' ? setOrderByDir('desc') : setOrderByDir('asc');
        } else {
            setOrderBy(colName);
            setOrderByDir('asc');
        }
    };

    return (
        <>
            <table>
                <thead>
                    <tr>
                        {props.cols.map((col, colIndex) => (
                            <th key={`table-th-${colIndex}`} onClick={() => setSort(col)}>
                                <div unselectable='on'>
                                    {col.title}
                                    <img
                                        alt={orderByDir}
                                        title={orderByDir}
                                        src={`/${orderByDir}.png`}
                                        style={{ visibility: col.title === orderBy.title ? 'visible' : 'hidden' }}
                                    />
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {props.data
                        .sort((a, b) => (orderByDir === 'asc' ? 1 : -1) * (orderBy.value(a) || '').localeCompare(orderBy.value(b) || ''))
                        .map((rowData, rowIndex) => (
                            <tr key={`table-row-${rowIndex}`}>
                                {props.cols.map((col, colIndex) => (
                                    <td style={{ ...getStyle(col, rowData) }} key={`table-row-${rowIndex}-col-${colIndex}`}>
                                        {col.customComponent ? col.customComponent(rowData) : col.value(rowData)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                </tbody>
            </table>
            <style>{`
        table {
            font-family: arial, sans-serif;
            border-collapse: collapse;
            width: 100%;
        }
        td,
        th {
            border: 1px solid #dddddd;
            text-align: left;
            padding: 8px;
        }
        tr:nth-child(even) {
            background-color: #dddddd;
        }
        th > div {
            -webkit-user-select: none; /* Chrome/Safari */        
            -moz-user-select: none; /* Firefox */
            -ms-user-select: none; /* IE10+ */

            /* Rules below not implemented in browsers yet */
            -o-user-select: none;
            user-select: none;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        img {
            width: 30px;
            height: 30px;
        }
    `}</style>
        </>
    );
};
