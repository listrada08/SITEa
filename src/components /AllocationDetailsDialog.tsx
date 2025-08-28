
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface AllocationDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: string;
  investments: Investment[];
}

interface Investment {
  id: string;
  name: string;
  symbol: string;
  value: string;
  percentage: string;
  change: string;
  positive: boolean;
}

const AllocationDetailsDialog = ({ open, onOpenChange, category, investments }: AllocationDetailsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Detalhes de {category}
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Investimento</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>% da Categoria</TableHead>
                <TableHead>Variação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {investments.map((investment) => (
                <TableRow key={investment.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">{investment.name}</div>
                      <div className="text-sm text-gray-500">{investment.symbol}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{investment.value}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-gray-600">{investment.percentage}</div>
                  </TableCell>
                  <TableCell>
                    <div className={`flex items-center ${investment.positive ? 'text-green-600' : 'text-red-600'}`}>
                      {investment.positive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                      {investment.change}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="flex justify-end mt-6">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AllocationDetailsDialog;
