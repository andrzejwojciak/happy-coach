/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
import Image from "next/image";

export default function About() {
  return (
    <>
      Something about <br></br> src="/images/happy-coach-logo-black.webp"
      <Image
        src="/images/happy-coach-logo-black.webp"
        alt="HappyCoach logo"
        width={300}
        height={300}
      />
      img src="/images/happy-coach-logo-black.png"
      <img src="/images/happy-coach-logo-black.png" />
      src="/public/images/happy-coach-logo-black.png"
      <Image
        src="/public/images/happy-coach-logo-black.png"
        alt="HappyCoach logo"
        width={300}
        height={300}
      />
      src="https://i.imgur.com/HpCMeLx.png"
      <Image
        src="https://i.imgur.com/HpCMeLx.png"
        alt="HappyCoach logo"
        width={300}
        height={300}
      />
    </>
  );
}
