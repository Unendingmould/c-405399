import React, { useState } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';

interface FilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FilterModal = ({ open, onOpenChange }: FilterModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCoin, setSelectedCoin] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [amountRange, setAmountRange] = useState([0]);

  const handleApplyFilters = () => {
    // Apply filters logic here
    console.log({
      searchQuery,
      selectedType,
      selectedCoin,
      dateFrom,
      dateTo,
      amountRange: amountRange[0]
    });
    onOpenChange(false);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSelectedCoin('all');
    setDateFrom('');
    setDateTo('');
    setAmountRange([0]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass max-w-lg">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold text-foreground">
            Filter & Search
          </DialogTitle>
        </DialogHeader>
        
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by ID, asset, or details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Type and Coin Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type" className="text-muted-foreground">Type</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="deposit">Deposit</SelectItem>
                  <SelectItem value="withdrawal">Withdrawal</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                  <SelectItem value="trade">Trade</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="coin" className="text-muted-foreground">Coin</Label>
              <Select value={selectedCoin} onValueChange={setSelectedCoin}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Coins</SelectItem>
                  <SelectItem value="btc">Bitcoin (BTC)</SelectItem>
                  <SelectItem value="eth">Ethereum (ETH)</SelectItem>
                  <SelectItem value="usdt">Tether (USDT)</SelectItem>
                  <SelectItem value="xrp">Ripple (XRP)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date Range */}
          <div>
            <Label className="text-muted-foreground">Date Range</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                placeholder="From date"
              />
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                placeholder="To date"
              />
            </div>
          </div>

          {/* Amount Range */}
          <div>
            <Label className="text-muted-foreground">Amount (USD)</Label>
            <div className="flex items-center justify-between text-foreground mt-2 mb-2">
              <span>$0</span>
              <span className="font-medium">${amountRange[0].toLocaleString()}</span>
              <span>$10,000+</span>
            </div>
            <Slider
              value={amountRange}
              onValueChange={setAmountRange}
              max={10000}
              min={0}
              step={100}
              className="w-full"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleResetFilters}
            >
              Reset
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleApplyFilters}
            >
              Apply Filters
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Component to be used in transaction pages
export const FilterButton = () => {
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setFilterOpen(true)}
      >
        <Filter className="w-4 h-4 mr-2" />
        Filter & Search
      </Button>
      <FilterModal open={filterOpen} onOpenChange={setFilterOpen} />
    </>
  );
};

export default FilterModal;