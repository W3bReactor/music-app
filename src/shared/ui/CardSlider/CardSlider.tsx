"use client";
import styles from "./CardSlider.module.css";
import { SvgIcon } from "@/shared/ui";
import { Children, useState } from "react";
import cn from "classnames";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

interface CardSliderProps {
  children: React.ReactNode;
}

export const CardSlider = ({ children }: CardSliderProps) => {
  const [prevEl, setPrevEl] = useState<HTMLButtonElement | null>(null);
  const [nextEl, setNextEl] = useState<HTMLButtonElement | null>(null);

  return (
    <div className={styles.swiperWrapper}>
      <button
        ref={setPrevEl}
        className={cn(styles.swiperBtn, styles.swiperPrevBtn)}
        aria-label="Previous Tracks"
      >
        <SvgIcon
          name={"arrow-down"}
          size={20}
          className={cn(styles.swiperIcon, styles.swiperPrevIcon)}
        />
      </button>
      <Swiper
        modules={[Navigation, Autoplay]}
        className={styles.swiper}
        spaceBetween={12}
        slidesPerView={5}
        navigation={{
          prevEl,
          nextEl,
        }}
        autoplay={{
          delay: 5000,
        }}
        loop={true}
      >
        {Children.map(children, (child) => (
          <SwiperSlide>{child}</SwiperSlide>
        ))}
      </Swiper>
      <button
        ref={setNextEl}
        className={cn(styles.swiperBtn, styles.swiperNextBtn)}
        aria-label="Next Tracks"
      >
        <SvgIcon
          name={"arrow-down"}
          size={20}
          className={cn(styles.swiperIcon, styles.swiperNextIcon)}
        />
      </button>
    </div>
  );
};
