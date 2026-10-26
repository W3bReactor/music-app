import styles from "./TrackPage.module.css";
import { TrackInfo } from "@/entities/track";
import { Spoiler } from "@/shared/ui";

export const TrackPage = () => {
  return (
    <section className={styles.track}>
      <TrackInfo />
      <Spoiler
        title={"Lyrics"}
        text={`You high baby? Yeah. Yeah? Talk to me. You want me to tell you
          something? I know what you want to hear. I know you want me baby, I
          think I want you too. I think I love you baby.  I think I love you
          too. I'm here to save you girl, come be in shady's world. I want to
          grow together, let's let our love unfurl. You know you want me baby,
          you know I want you too. They call me superman; I'm here to rescue
          you. I want to save you girl, come be in shady's world.  Oh boy you
          drive me crazy.  Bitch you make me hurl.  They call me superman, leap
          tall hoes in a single bound got no ring on this finger now. I'll never
          let another chick bring me down, in a relationship save it bitch,
          baby-sit? You make me sick, superman ain't saving shit, girl you can
          jump on shady's dick. Straight from the hip, cut to the chase, I tell
          the motherfuckin slut to her face. Play no games, say no names, ever
          since I broke over what’s her face.`}
      />
    </section>
  );
};
