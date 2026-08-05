import Link from 'next/link'

import { StaticPageShell } from '@/components/StaticPageShell'
import { buildMetadata } from '@/lib/seo'
import { defaultLocale, isLocale, type Locale } from '@/i18n/config'

const PATH = '/cgv'

type Section = { h2: string; body?: string; link?: { before: string; path: string; label: string; after: string } }

const CONTENT: Record<Locale, {
  metaTitle: string
  metaDescription: string
  kicker: string
  title: string
  intro: string
  sections: Section[]
}> = {
  fr: {
    metaTitle: 'Conditions générales de vente',
    metaDescription: 'Les conditions générales de vente applicables aux commandes passées sur le site Sailscents.',
    kicker: 'CGV',
    title: 'Conditions générales de vente',
    intro: 'Les présentes conditions encadrent les ventes réalisées sur le site. Elles constituent un modèle à faire valider par l’éditeur avant la mise en ligne définitive.',
    sections: [
      { h2: '1. Objet', body: 'Les présentes conditions générales de vente (CGV) régissent les relations entre l’éditeur du site et toute personne effectuant un achat sur le site.' },
      { h2: '2. Produits', body: 'Les produits proposés sont décrits avec la plus grande exactitude possible. Les matières naturelles pouvant présenter de légères variations, les visuels et descriptions n’ont pas de valeur contractuelle absolue.' },
      { h2: '3. Prix', body: 'Les prix sont indiqués en euros, toutes taxes comprises, hors frais de livraison précisés avant la validation de la commande. L’éditeur se réserve le droit de modifier ses prix à tout moment, les produits étant facturés sur la base des tarifs en vigueur au moment de la commande.' },
      { h2: '4. Commande', body: 'La commande est validée après acceptation des présentes CGV et confirmation du paiement. Un e-mail de confirmation récapitule les éléments de la commande.' },
      { h2: '5. Paiement', body: 'Le paiement s’effectue en ligne par les moyens proposés lors de la commande. La commande est traitée après confirmation du paiement. [Prestataire de paiement à préciser.]' },
      { h2: '6. Livraison', link: { before: 'Les modalités, délais et frais de livraison sont détaillés sur la page ', path: '/livraison-et-retours', label: 'Livraison & retours', after: '.' } },
      { h2: '7. Droit de rétractation', body: 'Vous disposez d’un délai de quatorze (14) jours pour exercer votre droit de rétractation dans les conditions prévues par la loi et rappelées sur la page Livraison & retours, sous réserve des exclusions légales.' },
      { h2: '8. Garanties', body: 'Les produits bénéficient des garanties légales de conformité et contre les vices cachés, dans les conditions prévues par la loi.' },
      { h2: '9. Données personnelles', link: { before: 'Le traitement de vos données est décrit dans notre ', path: '/confidentialite', label: 'politique de confidentialité', after: '.' } },
      { h2: '10. Droit applicable', body: 'Les présentes CGV sont soumises au droit applicable au siège de l’éditeur. En cas de litige, une solution amiable sera recherchée avant toute action contentieuse.' },
    ],
  },
  en: {
    metaTitle: 'Terms and conditions of sale',
    metaDescription: 'The terms and conditions of sale applicable to orders placed on the Sailscents site.',
    kicker: 'Terms of sale',
    title: 'Terms and conditions of sale',
    intro: 'These terms govern sales made on the site. They are a template to be validated by the publisher before final publication.',
    sections: [
      { h2: '1. Purpose', body: 'These terms and conditions of sale govern the relationship between the site’s publisher and anyone making a purchase on the site.' },
      { h2: '2. Products', body: 'The products offered are described as accurately as possible. As natural materials may show slight variations, visuals and descriptions have no absolute contractual value.' },
      { h2: '3. Prices', body: 'Prices are shown in euros, all taxes included, excluding shipping fees specified before the order is confirmed. The publisher reserves the right to change its prices at any time; products are invoiced on the basis of the rates in force at the time of the order.' },
      { h2: '4. Order', body: 'The order is confirmed after acceptance of these terms and confirmation of payment. A confirmation email summarises the order details.' },
      { h2: '5. Payment', body: 'Payment is made online using the methods offered at the time of order. The order is processed after payment confirmation. [Payment provider to be specified.]' },
      { h2: '6. Delivery', link: { before: 'Delivery methods, times and fees are detailed on the ', path: '/livraison-et-retours', label: 'Shipping & returns', after: ' page.' } },
      { h2: '7. Right of withdrawal', body: 'You have fourteen (14) days to exercise your right of withdrawal under the conditions provided by law and set out on the Shipping & returns page, subject to legal exclusions.' },
      { h2: '8. Warranties', body: 'Products benefit from the legal warranties of conformity and against hidden defects, under the conditions provided by law.' },
      { h2: '9. Personal data', link: { before: 'The processing of your data is described in our ', path: '/confidentialite', label: 'privacy policy', after: '.' } },
      { h2: '10. Applicable law', body: 'These terms are subject to the law applicable at the publisher’s registered office. In the event of a dispute, an amicable solution will be sought before any legal action.' },
    ],
  },
}

export const generateMetadata = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params
  const loc = isLocale(locale) ? locale : defaultLocale
  const t = CONTENT[loc]
  return buildMetadata({ fallbackTitle: t.metaTitle, fallbackDescription: t.metaDescription, path: PATH, locale: loc })
}

export default async function CgvPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  const locale = isLocale(raw) ? raw : defaultLocale
  const t = CONTENT[locale]
  const p = (path: string) => `/${locale}${path}`

  return (
    <StaticPageShell title={t.title} kicker={t.kicker} intro={t.intro}>
      {t.sections.map((section) => (
        <section key={section.h2}>
          <h2>{section.h2}</h2>
          {section.body && <p>{section.body}</p>}
          {section.link && (
            <p>
              {section.link.before}
              <Link href={p(section.link.path)} className="text-[color:var(--color-accent)] underline">
                {section.link.label}
              </Link>
              {section.link.after}
            </p>
          )}
        </section>
      ))}
    </StaticPageShell>
  )
}
