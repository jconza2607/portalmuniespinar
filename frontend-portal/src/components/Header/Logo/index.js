import Image from "next/image";
import Link from "next/link";

// Theme Logo
import ThemeLogo from "../../../../public/img/logo5.png";

export default function Logo() {
  return (
    <>
      <div className="logo">
        <Link href="/">
        <Image
          src={ThemeLogo}
          alt="Logo Municipalidad"
          style={{ width: 'auto', height: 'auto' }}
          sizes="(max-width: 768px) 100px, 178px"
          placeholder="empty"
        />
        </Link>
      </div>
    </>
  );
}
