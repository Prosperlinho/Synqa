import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { formatCompactUsd } from '@/lib/utils';
import type { TokenHolding } from '@/types';

export function HoldingsTable({ holdings }: { holdings: TokenHolding[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Token holdings</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {holdings.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">No token holdings indexed for this wallet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Token</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead className="text-right">USD value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {holdings.map((h) => (
                <TableRow key={h.id}>
                  <TableCell>
                    <span className="font-medium">{h.tokenSymbol}</span>
                    <span className="text-muted-foreground ml-1.5 text-xs">{h.tokenName}</span>
                  </TableCell>
                  <TableCell className="text-right font-tabular font-mono text-sm">{h.balance}</TableCell>
                  <TableCell className="text-right font-tabular">{formatCompactUsd(h.usdValue)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
