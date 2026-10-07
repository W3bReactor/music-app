import styles from "./Footer.module.css";
import { SvgIcon } from "@/shared/ui";

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerAbout}>
        <h2 className={styles.footerAboutTitle}>About</h2>
        <p className={styles.footerAboutDesc}>
          Melodies is a website that has been created for over{" "}
          <span className={styles.footerAboutDescPurple}>5 year’s</span> now and
          it is one of the most famous music player website’s in the world. in
          this website you can listen and download songs for free. also of you
          want no limitation you can buy our{" "}
          <span className={styles.footerAboutDescAqua}>premium pass’s.</span>
        </p>
      </div>
      <div className={styles.footerNav}>
        <div className={styles.footerNavColumn}>
          <h3 className={styles.footerNavTitle}>Melodies</h3>
          <ul className={styles.footerNavList}>
            <li className={styles.footerNavItem}>
              <a className={styles.footerNavLink} href="#">
                Songs
              </a>
            </li>
            <li className={styles.footerNavItem}>
              <a className={styles.footerNavLink} href="#">
                Radio
              </a>
            </li>
            <li className={styles.footerNavItem}>
              <a className={styles.footerNavLink} href="#">
                Podcast
              </a>
            </li>
          </ul>
        </div>
        <div className={styles.footerNavColumn}>
          <h3 className={styles.footerNavTitle}>Access</h3>
          <ul className={styles.footerNavList}>
            <li className={styles.footerNavItem}>
              <a className={styles.footerNavLink} href="#">
                Explore
              </a>
            </li>
            <li className={styles.footerNavItem}>
              <a className={styles.footerNavLink} href="#">
                Artists
              </a>
            </li>
            <li className={styles.footerNavItem}>
              <a className={styles.footerNavLink} href="#">
                Playlists
              </a>
            </li>
            <li className={styles.footerNavItem}>
              <a className={styles.footerNavLink} href="#">
                Albums
              </a>
            </li>
            <li className={styles.footerNavItem}>
              <a className={styles.footerNavLink} href="#">
                Trending
              </a>
            </li>
          </ul>
        </div>
        <div className={styles.footerNavColumn}>
          <h3 className={styles.footerNavTitle}>Contact</h3>
          <ul className={styles.footerNavList}>
            <li className={styles.footerNavItem}>
              <a className={styles.footerNavLink} href="#">
                About
              </a>
            </li>
            <li className={styles.footerNavItem}>
              <a className={styles.footerNavLink} href="#">
                Policy
              </a>
            </li>
            <li className={styles.footerNavItem}>
              <a className={styles.footerNavLink} href="#">
                Social Media
              </a>
            </li>
            <li className={styles.footerNavItem}>
              <a className={styles.footerNavLink} href="#">
                Support
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.footerColumn}>
        <h3 className={styles.footerColumnTitle}>Melodies</h3>
        <ul className={styles.footerSocial}>
          <li className={styles.footerSocialItem}>
            <a href="#" className={styles.footerSocialLink}>
              <SvgIcon name={"facebook"} className={styles.footerSocialIcon} />
            </a>
          </li>
          <li className={styles.footerSocialItem}>
            <a href="#" className={styles.footerSocialLink}>
              <SvgIcon name={"instagram"} className={styles.footerSocialIcon} />
            </a>
          </li>
          <li className={styles.footerSocialItem}>
            <a href="#" className={styles.footerSocialLink}>
              <SvgIcon name={"twitter"} className={styles.footerSocialIcon} />
            </a>
          </li>
          <li className={styles.footerSocialItem}>
            <a href="#" className={styles.footerSocialLink}>
              <SvgIcon name={"phone"} className={styles.footerSocialIcon} />
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};
