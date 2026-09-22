import styles from "./SearchInput.module.css";
import { SvgIcon } from "@/shared/ui";

export const SearchInput = () => {
  return (
    <label className={styles.searchInput} htmlFor="search">
      <SvgIcon className={styles.headerIcon} name={"search"} size={25} />
      <input
        id="search"
        type="text"
        placeholder={"Search For Musics, Artists, ..."}
        className={styles.input}
      />
    </label>
  );
};
