import styles from "./PlayerProgress.module.css";
import { AudioWave } from "@/shared/ui";
import { MOCK_PEAKS } from "@/shared/libs/mockPeaks";
import {
  selectDuration,
  selectSeek,
  subscribeToTime,
  usePlayerStore,
} from "@/entities/player";
import { useEffect, useState } from "react";

const fmt = (s: number) =>
  `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export const PlayerProgress = () => {
  const duration = usePlayerStore(selectDuration);
  const seek = usePlayerStore(selectSeek);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const unsubscribe = subscribeToTime(setCurrentTime);
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className={styles.playerControlRoad}>
      <span className={styles.playerControlTime}>{fmt(currentTime)}</span>
      <div className={styles.playerControlRoadProgress}>
        <AudioWave
          peaks={MOCK_PEAKS}
          progress={duration ? currentTime / duration : 0}
          seek={seek}
        />
      </div>
      <span className={styles.playerControlTime}>{fmt(duration)}</span>
    </div>
  );
};
