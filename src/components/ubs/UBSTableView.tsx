
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from '@/components/ui/card';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { vaccinesList } from '@/data/mockUBSData';
import { UBSItem } from '@/types/ubs';

interface UBSTableViewProps {
  searchResults: UBSItem[];
}

const UBSTableView = ({ searchResults }: UBSTableViewProps) => {
  if (searchResults.length === 0) return null;

  return (
    <Card className="glass-card border-gray-100 overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50/80">
          <TableRow>
            <TableHead className="w-[240px]">UBS</TableHead>
            <TableHead className="w-[180px]">Endereço</TableHead>
            {vaccinesList.map(vaccine => (
              <TableHead key={vaccine} className="text-center">
                {vaccine}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {searchResults.map((ubs) => (
            <TableRow key={ubs.id} className="hover:bg-gray-50/80">
              <TableCell className="font-medium">{ubs.name}</TableCell>
              <TableCell className="text-gray-600">{ubs.address}</TableCell>
              {vaccinesList.map(vaccine => (
                <TableCell key={vaccine} className="text-center">
                  {ubs.vaccines[vaccine as keyof typeof ubs.vaccines] ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-gray-400 mx-auto" />
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default UBSTableView;
