"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import type { SessionData } from "~/components/sessions/session-controls";
import { formatDuration } from "~/lib/format-duration";

interface EndSessionFormProps {
  sessionData: SessionData;
  onCancel: () => void;
  onSubmit: (data: { cashOut: number; notes: string }) => void;
}

export function EndSessionForm({
  sessionData,
  onCancel,
  onSubmit,
}: EndSessionFormProps) {
  const [cashOut, setCashOut] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalBuyIn =
    sessionData.buyIn +
    sessionData.rebuys.reduce((sum, rebuy) => sum + rebuy.amount, 0);

  const cashOutValue = Number.parseFloat(cashOut) || 0;
  const profit = cashOutValue - totalBuyIn;

  const now = new Date();
  const durationMs = now.getTime() - new Date(sessionData.startTime).getTime();
  const durationHours = durationMs / (1000 * 60 * 60);
  const hourlyRate = profit / durationHours;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      onSubmit({
        cashOut: cashOutValue,
        notes,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>End Session</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cash-out">Cash Out Amount ($)</Label>
              <Input
                id="cash-out"
                type="number"
                min="0"
                step="0.01"
                value={cashOut}
                onChange={(e) => setCashOut(e.target.value)}
                required
                disabled={isSubmitting}
                autoFocus
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Duration</p>
                <p className="font-medium">
                  {formatDuration(durationMs, true)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Buy-In</p>
                <p className="font-medium">${totalBuyIn.toFixed(2)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Profit/Loss</p>
                <p
                  className={`font-medium ${profit >= 0 ? "text-green-500" : "text-red-500"}`}
                >
                  ${profit >= 0 ? "+" : ""}
                  {profit.toFixed(2)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Hourly Rate</p>
                <p
                  className={`font-medium ${hourlyRate >= 0 ? "text-green-500" : "text-red-500"}`}
                >
                  ${hourlyRate >= 0 ? "+" : ""}
                  {hourlyRate.toFixed(2)}/hr
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="session-notes">Session Notes</Label>
              <Textarea
                id="session-notes"
                placeholder="Record thoughts, strategies, or mistakes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                disabled={isSubmitting}
              />
              {sessionData.notes && (
                <div className="mt-2 text-sm">
                  <p className="text-muted-foreground">
                    Original session notes:
                  </p>
                  <p className="mt-1 rounded-md bg-muted p-2 italic">
                    {sessionData.notes}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Session"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
