import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";

export function useStats() {
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [userName, setUserName] = useState("Guest");
    const [streak, setStreak] = useState(0);
    const [history, setHistory] = useState([]); // Powers the graph
    const [personalBest, setPersonalBest] = useState(0);

    const fetchLeaderboard = async () => {
        try {
            const { data } = await supabase
                .from('leaderboard')
                .select('*')
                .order('wpm', { ascending: false })
                .limit(10);
            if (data) setLeaderboard(data);
        } catch (e) {
            console.error("Leaderboard fetch failed", e);
        }
    };

    useEffect(() => {
        fetchLeaderboard();

        // Load Name
        const savedName = localStorage.getItem("tf_userName");
        if (savedName) setUserName(savedName);

        // Load PB
        const savedPB = localStorage.getItem("tf_personalBest");
        if (savedPB) setPersonalBest(Number(savedPB));

        // Load History for the Graph
        const savedHistory = localStorage.getItem("tf_history");
        if (savedHistory) {
            setHistory(JSON.parse(savedHistory));
        }
    }, []);

    const saveTestResult = async (wpm: number, accuracy: number) => {
        // 1. Update Local History Immediately (Crucial for Graph)
        const newEntry = { wpm, accuracy, date: Date.now() };
        const newHistory = [newEntry, ...history].slice(0, 25);
        setHistory(newHistory);
        localStorage.setItem("tf_history", JSON.stringify(newHistory));

        // 2. Save to Supabase (Global)
        try {
            await supabase
                .from('leaderboard')
                .insert([{ name: userName, wpm, accuracy }]);
            fetchLeaderboard();
        } catch (e) {
            console.error("Supabase save failed", e);
        }

        // 3. Handle PB calculations
        const isNewBest = wpm > personalBest;
        const diff = personalBest === 0 ? 0 : wpm - personalBest;

        if (isNewBest) {
            setPersonalBest(wpm);
            localStorage.setItem("tf_personalBest", wpm.toString());
        }

        return { isNewBest, diff };
    };

    const updateUserName = (name: string) => {
        setUserName(name);
        localStorage.setItem("tf_userName", name);
    };

    return { streak, history, leaderboard, userName, saveTestResult, updateUserName };
}