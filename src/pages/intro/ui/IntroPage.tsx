import styles from "./IntroPage.module.css";
import { CardSlider } from "@/shared/ui";
import { TrackCard } from "@/entities/track";
import { mockTracks } from "@/pages/intro/model/mockTracks";

export const IntroPage = () => {
  return (
    <section className={styles.introTracks}>
      <h2 className={styles.introTracksTitle}>Tracks</h2>
      <CardSlider>
        {mockTracks.map((track) => (
          <TrackCard key={track.id} track={track} />
        ))}
      </CardSlider>
    </section>
  );
};
