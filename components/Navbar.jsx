import Image from "next/image";

export default function Form() {
  return (
    <div>
      <section className="nav flex gap-2 bg-black">
        <Image
          src="/image/sairam_logo.svg"
          width={150}
          height={150}
          alt="SairamLogo"
        />
        <div className="divider"></div>
        <Image src="/image/lmes.png" width={150} height={100} alt="S2TLogo" />
      </section>
      <div className="w-full flex justify-center">
        <Image src="/image/hero.png" width={300} height={300} alt="S2TLogo" />
      </div>
    </div>

  );
}
