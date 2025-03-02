"use client";

import { useState } from "react";
import { updateBankroll } from "~/server/actions/bankroll";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { toast } from "sonner";

interface BankrollTransactionFormProps {
  type: "deposit" | "withdrawal";
  onSuccess: () => void;
}

export function BankrollTransactionForm({ type, onSuccess }: BankrollTransactionFormProps) {
  const [amount, setAmount] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount greater than zero");
      return;
    }

    setIsLoading(true);
    try {
      await updateBankroll(parseFloat(amount), type, notes);
      toast.success(`${type === "deposit" ? "Deposit" : "Withdrawal"} recorded successfully`);
      onSuccess();
    } catch (error) {
      toast.error(
        error instanceof Error 
          ? error.message 
          : `Failed to record ${type}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="amount">Amount ($)</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          placeholder={`Enter any notes about this ${type}...`}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      
      <div className="flex justify-end gap-2 mt-6">
        <Button 
          type="submit" 
          disabled={isLoading}
          variant={type === "deposit" ? "default" : "destructive"}
        >
          {isLoading ? "Processing..." : type === "deposit" ? "Deposit Funds" : "Withdraw Funds"}
        </Button>
      </div>
    </form>
  );
}