import Image from 'next/image'

/**
 * Image de hero : remplit tout le cadre (cover), avec un voile en bas pour la
 * lisibilite du titre.
 */
export function HeroImage({ url, alt }: { url: string; alt: string }) {
  return (
    <>
      <Image src={url} alt={alt} fill priority sizes="100vw" className="editorial-hero__img" />
      <span className="editorial-hero__scrim" aria-hidden="true" />
    </>
  )
}
