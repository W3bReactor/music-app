import styles from "./IntroPage.module.css";
import { CardSlider, SvgIcon } from "@/shared/ui";
import { TrackCard } from "@/entities/track";
import { PlayBtn } from "@/features/play-track";
import { mockTracks } from "@/pages/intro/model/mockTracks";

export const IntroPage = () => {
  return (
    <section className={styles.introTracks}>
      <h2 className={styles.introTracksTitle}>Tracks</h2>
      <CardSlider>
        {mockTracks.map((track) => (
          <TrackCard
            key={track.id}
            track={track}
            playSlot={
              <PlayBtn
                className={styles.trackPlayBtn}
                item={{ id: track.id }}
                playingSlot={
                  <SvgIcon name={"playing"} className={styles.trackPlayIcon} />
                }
                pausedSlot={
                  <SvgIcon name={"play"} className={styles.trackPlayIcon} />
                }
              />
            }
          />
        ))}
      </CardSlider>
    </section>
  );
};
