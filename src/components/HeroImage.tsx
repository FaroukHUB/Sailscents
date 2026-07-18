import Image from 'next/image'

/**
 * Image de hero « dézoomée » : l'image entière est affichée (contain, rien de
 * rogné), posée sur une version floutée et assombrie d'elle-même (cover) pour
 * remplir le cadre sans bande vide.
 */
export function HeroImage({ url, alt }: { url: string; alt: string }) {
  return (
    <>
      <Image src={url} alt="" fill aria-hidden sizes="100vw" className="editorial-hero__bg" />
      <Image src={url} alt={alt} fill priority sizes="100vw" className="editorial-hero__img" />
      <span className="editorial-hero__scrim" aria-hidden="true" />
    </>
  )
}
