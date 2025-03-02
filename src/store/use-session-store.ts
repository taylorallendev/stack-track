import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { SessionWithDetails } from "~/server/actions/session";
import { getActiveSession } from "~/server/actions/session";

export interface SessionRebuyClient {
  id?: string;
  amount: number;
  timestamp: Date;
}

export interface SessionData {
  id: string;
  stakes: string;
  buyIn: number;
  startTime: Date;
  site?: string;
  gameType?: string;
  notes?:
    | string
    | { id: string; content: string; timestamp: Date; sessionId: string }[];
  rebuys: SessionRebuyClient[];
  cashOut?: number;
  endTime?: Date;
  status: "active" | "completed";
}

type SessionStore = {
  // State
  activeSession: SessionData | null;
  isLoading: boolean;
  lastFetched: Date | null;

  // Actions
  fetchActiveSession: () => Promise<void>;
  setActiveSession: (session: SessionWithDetails) => void;
  clearActiveSession: () => void;
  addRebuy: (rebuy: SessionRebuyClient) => void;
  endSession: (cashOut: number, endTime?: Date) => void;
};

export const useSessionStore = create<SessionStore>()(
  persist(
    (set, get) => ({
      // Initial state
      activeSession: null,
      isLoading: false,
      lastFetched: null,

      // Actions
      fetchActiveSession: async () => {
        // Don't fetch if we've fetched recently (within 30 seconds)
        const lastFetched = get().lastFetched;
        const now = new Date();
        if (lastFetched && +now - +lastFetched < 30000) {
          return;
        }

        set({ isLoading: true });
        try {
          const session = await getActiveSession();

          if (session) {
            set({
              activeSession: {
                id: session.id,
                stakes: session.stakes,
                buyIn: parseFloat(session.buyIn),
                startTime: new Date(session.startTime),
                site: session.site?.name,
                gameType: session.gameType?.name,
                notes: session.notes ?? undefined,
                rebuys:
                  session.rebuys?.map((rebuy) => ({
                    id: rebuy.id,
                    amount: parseFloat(rebuy.amount),
                    timestamp: new Date(rebuy.timestamp),
                  })) ?? [],
                status: session.status ?? "active",
              },
              lastFetched: new Date(),
            });
          } else {
            set({ activeSession: null, lastFetched: new Date() });
          }
        } catch (error) {
          console.error("Error fetching active session:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      setActiveSession: (session) => {
        set({
          activeSession: {
            id: session.id,
            stakes: session.stakes,
            buyIn: parseFloat(session.buyIn),
            startTime: new Date(session.startTime),
            site: session.site?.name,
            gameType: session.gameType?.name,
            notes: session.notes ?? undefined,
            rebuys:
              session.rebuys?.map((rebuy) => ({
                id: rebuy.id,
                amount: parseFloat(rebuy.amount),
                timestamp: new Date(rebuy.timestamp),
              })) ?? [],
            status: session.status ?? "active",
          },
          lastFetched: new Date(),
        });
      },

      clearActiveSession: () => {
        set({ activeSession: null });
      },

      addRebuy: (rebuy) => {
        set((state) => {
          if (!state.activeSession) return state;

          return {
            activeSession: {
              ...state.activeSession,
              rebuys: [...state.activeSession.rebuys, rebuy],
            },
          };
        });
      },

      endSession: (cashOut, endTime = new Date()) => {
        set((state) => {
          if (!state.activeSession) return state;

          return {
            activeSession: {
              ...state.activeSession,
              cashOut,
              endTime,
              status: "completed",
            },
          };
        });
      },
    }),
    {
      name: "stack-track-session",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        activeSession: state.activeSession,
        lastFetched: state.lastFetched,
      }),
    },
  ),
);
