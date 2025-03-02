"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { formatDistanceStrict } from "date-fns";
import { useSessionStore } from "~/store/use-session-store";
import { addRebuy } from "~/server/actions/session";
import { toast } from "sonner";

interface ActiveSessionPanelProps {
  onEndSession: () => void;
}

export function ActiveSessionPanel({ onEndSession }: ActiveSessionPanelProps) {
  const {
    activeSession,
    isLoading,
    fetchActiveSession,
    addRebuy: addRebuyToStore,
  } = useSessionStore();

  const [rebuyAmount, setRebuyAmount] = useState("25");
  const [isRebuyDialogOpen, setIsRebuyDialogOpen] = useState(false);
  const [isAddingRebuy, setIsAddingRebuy] = useState(false);

  // Fetch active session on mount
  useEffect(() => {
    fetchActiveSession().catch(console.error);

    // Set up an interval to refresh the session data every 2 minutes
    const interval = setInterval(
      () => {
        fetchActiveSession().catch(console.error);
      },
      2 * 60 * 1000,
    );

    return () => clearInterval(interval);
  }, [fetchActiveSession]);

  if (isLoading || !activeSession) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading active session...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  const handleRebuySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number.parseFloat(rebuyAmount);

    if (!isNaN(amount) && amount > 0 && activeSession) {
      setIsAddingRebuy(true);
      try {
        // Create a form to submit
        const formData = new FormData();
        formData.append("sessionId", activeSession.id);
        formData.append("amount", amount.toString());

        // Call the server action
        const result = await addRebuy(formData);

        if (result.success) {
          // Update local state via Zustand
          addRebuyToStore({
            id: result.rebuy?.id,
            amount,
            timestamp: new Date(),
          });

          toast.success("Rebuy added successfully");
          setIsRebuyDialogOpen(false);
        } else {
          toast.error("Failed to add rebuy");
        }
      } catch (error) {
        console.error("Error adding rebuy:", error);
        toast.error("Error adding rebuy");
      } finally {
        setIsAddingRebuy(false);
      }
    }
  };

  const totalBuyIn =
    activeSession.buyIn +
    activeSession.rebuys.reduce((sum, rebuy) => sum + rebuy.amount, 0);

  // Calculate session duration
  const now = new Date();
  const duration = formatDistanceStrict(activeSession.startTime, now, {
    addSuffix: false,
  });

  // Get start time formatted
  const startTime = activeSession.startTime.toLocaleString([], {
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    day: "numeric",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Session - {activeSession.stakes}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Stakes</p>
            <p className="font-medium">{activeSession.stakes}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Initial Buy-In</p>
            <p className="font-medium">${activeSession.buyIn.toFixed(2)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Site/Location</p>
            <p className="font-medium">{activeSession.site}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Started At</p>
            <p className="font-medium">{startTime}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Duration</p>
            <p className="font-medium">{duration}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Investment</p>
            <p className="font-medium">${totalBuyIn.toFixed(2)}</p>
          </div>
        </div>

        {activeSession.rebuys.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">
              Rebuys ({activeSession.rebuys.length})
            </p>
            <div className="max-h-40 space-y-1 overflow-y-auto rounded-md border p-2">
              {activeSession.rebuys.map((rebuy, index) => (
                <div
                  key={rebuy.id ?? index}
                  className="flex justify-between text-sm"
                >
                  <span>
                    Rebuy #{index + 1} at{" "}
                    {new Date(rebuy.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <span>${rebuy.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="font-medium">Total Buy-In</span>
              <span className="font-medium">${totalBuyIn.toFixed(2)}</span>
            </div>
          </div>
        )}

        {activeSession.notes && (
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Session Notes</p>
            {typeof activeSession.notes === "string" ? (
              <p className="text-sm">{activeSession.notes}</p>
            ) : (
              <div className="space-y-2">
                {activeSession.notes.map((note) => (
                  <div key={note.id} className="text-sm">
                    <p className="text-xs text-muted-foreground">
                      {new Date(note.timestamp).toLocaleString()}
                    </p>
                    <p>{note.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col gap-4 sm:flex-row">
          <Dialog open={isRebuyDialogOpen} onOpenChange={setIsRebuyDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex-1">
                Add Rebuy
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleRebuySubmit}>
                <DialogHeader>
                  <DialogTitle>Add Rebuy</DialogTitle>
                  <DialogDescription>
                    Enter the amount you want to add to your current session.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Label htmlFor="rebuy-amount">Rebuy Amount ($)</Label>
                  <Input
                    id="rebuy-amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={rebuyAmount}
                    onChange={(e) => setRebuyAmount(e.target.value)}
                    disabled={isAddingRebuy}
                  />
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsRebuyDialogOpen(false)}
                    disabled={isAddingRebuy}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isAddingRebuy}>
                    {isAddingRebuy ? "Adding..." : "Add Rebuy"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Button
            variant="destructive"
            className="flex-1"
            onClick={onEndSession}
          >
            End Session
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
