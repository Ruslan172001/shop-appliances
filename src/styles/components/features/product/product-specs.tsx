import { Table, TableBody, TableCell, TableRow } from "../../ui/table";
interface ProductSpecsProps {
  specifications?: Record<string, string | number | boolean | null> | null;
}
export default function ProductSpecs({ specifications }: ProductSpecsProps) {
  if (!specifications || Object.keys(specifications).length === 0) {
    return null;
  }

  const formatValue = (value: string | number | boolean | null): string => {
    if (typeof value === "boolean") return value ? "Да" : "Нет";
    if (value === null) return "—";
    return String(value);
  };
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Характеристики</h2>
      <Table>
        <TableBody>
          {Object.entries(specifications).map(([key, value]) => (
            <TableRow key={key}>
              <TableCell className="font-medium text-muted-foreground">
                {key}
              </TableCell>
              <TableCell>{formatValue(value)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
