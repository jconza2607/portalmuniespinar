"use client";

import Image from "next/image";
import Link from "next/link";
import { Tilt } from "react-tilt";
import TeamImg1 from "../../../public/img/team1.jpg";

const defaultOptions = {
  reverse: false,
  max: 35,
  perspective: 1000,
  scale: 1,
  speed: 2000,
  transition: true,
  axis: null,
  reset: true,
  easing: "cubic-bezier(.03,.98,.52,.99)",
};

export default function TeamCard(props) {
  const { tilt, image, name, designation, telefono } = props;

  return (
    <Tilt options={defaultOptions} className={tilt || ""}>
      <div className="single-team">
        <div className="t-head">
          {typeof image === "string" && image.startsWith("http") ? (
            <img src={image} alt={name || "Foto"} width={558} height={575} />
          ) : (
            <Image
              src={image || TeamImg1}
              alt={name || "Foto"}
              width={558}
              height={575}
            />
          )}
        </div>
        <div className="t-bottom">
          <p>{designation || "Neurosurgeon"}</p>
          <h2>
            <Link href="/doctor-details">{name || "Collis Molate"}</Link>
            <p>{telefono || "999 999 999"}</p>
          </h2>
        </div>
      </div>
    </Tilt>
  );
}
