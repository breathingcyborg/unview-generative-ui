'use client'

import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { RegistryComponent } from '@/components/generative/registry';

export interface DataTableColumn<T = any> {
  key: keyof T | string;
  header: string;
  cellRenderer?: (value: any, row: T, rowIndex: number) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

export interface DataTableComponentProps<T = any> {
  data: T[];
  columns: DataTableColumn<T>[];
  title?: string;
  caption?: string;
  className?: string;
  rowClassName?: (row: T, rowIndex: number) => string;
}

const DataTableComponent: React.FC<DataTableComponentProps> = ({
  data,
  columns,
  title,
  caption,
  className,
  rowClassName,
}) => {
  const getRowValue = (row: any, key: string) => {
    // Basic support for dot-notation nested keys
    return key.split('.').reduce((obj, part) => obj && obj[part], row);
  };

  return (
    <div className={cn("rounded-md border", className)}>
      {title && <h3 className="text-lg font-semibold p-4 border-b">{title}</h3>}
      <Table>
        {caption && <TableCaption>{caption}</TableCaption>}
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={String(col.key)} className={cn(col.headerClassName)}>
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data && data.length > 0 ? (
            data.map((row, rowIndex) => (
              <TableRow key={rowIndex} className={cn(rowClassName?.(row, rowIndex))}>
                {columns.map((col, colIndex) => (
                  <TableCell key={`${rowIndex}-${String(col.key)}`} className={cn(col.className)}>
                    {col.cellRenderer
                      ? col.cellRenderer(getRowValue(row, String(col.key)), row, rowIndex)
                      : String(getRowValue(row, String(col.key)) ?? '')}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

const DataTablePrompt = `
To render a table of data, use the DataTableComponent.
Props:
- data: An array of objects. Each object represents a row.
- columns: An array of column definition objects. Each column object should have:
    - key: string (The key in the data object for this column. Can use dot notation for nested properties e.g., 'customer.name')
    - header: string (The text to display in the table header for this column)
    - (optional) cellRenderer: (value, row, rowIndex) => React.ReactNode (A function to custom render the cell content)
    - (optional) className: string (Tailwind classes for the cell)
    - (optional) headerClassName: string (Tailwind classes for the header cell)
- (optional) title: string (A title to display above the table)
- (optional) caption: string (A caption to display below the table body)
- (optional) className: string (Tailwind classes for the container div)
- (optional) rowClassName: (row, rowIndex) => string (A function to apply conditional classes to a row)

Example:
<DataTableComponent
  title="Low Stock Products"
  data={[{ product_id: 'P123', name: 'Wireless Mouse', quantity_on_hand: 5, reorder_level: 10, warehouse: { name: 'Main WH' } }]}
  columns={[
    { key: 'name', header: 'Product Name' },
    { key: 'warehouse.name', header: 'Warehouse' },
    { key: 'quantity_on_hand', header: 'Stock' },
    { key: 'reorder_level', header: 'Reorder At' },
  ]}
/>
`;

export const DataTableComponentRegistry: RegistryComponent = {
  component: DataTableComponent,
  prompt: DataTablePrompt,
};

export default DataTableComponent;