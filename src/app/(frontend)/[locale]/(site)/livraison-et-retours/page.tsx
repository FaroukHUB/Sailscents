import Link from 'next/link'

import { StaticPageShell } from '@/components/StaticPageShell'
import { buildMetadata } from '@/lib/seo'
import { defaultLocale, isLocale, type Locale } from '@/i18n/config'

const PATH = '/livraison-et-retours'

const CONTENT: Record<Locale, {
  metaTitle: string
  metaDescription: string
  kicker: string
  title: string
  intro: string
  sections: { h2: string; body: string[] }[]
  questionBefore: string
  faqLabel: string
  questionMid: string
  contactLabel: string
  questionAfter: string
}> = {
  fr: {
    metaTitle: 'Livraison & retours',
    metaDescription: 'Modalités d’expédition, délais, frais, suivi, ainsi que les conditions de retour et de remboursement.',
    kicker: 'Commander en confiance',
    title: 'Livraison & retours',
    intro: 'Nos essences sont préparées et emballées avec soin. Voici comment se déroulent l’expédition et, si besoin, le retour de votre commande.',
    sections: [
      { h2: 'Préparation & expédition', body: ['Chaque commande est préparée à la main. Le délai de préparation et les transporteurs proposés sont précisés lors de la commande. [Délais et zones de livraison à compléter par l’éditeur.]'] },
      { h2: 'Frais & délais', body: ['Les frais de livraison et les délais estimés sont indiqués au moment du paiement, selon la destination et le mode d’expédition choisi. [Grille de frais à compléter.]'] },
      { h2: 'Suivi', body: ['Dès l’expédition, un e-mail de confirmation vous est adressé ; lorsque le transporteur le permet, il contient un numéro de suivi.'] },
      { h2: 'Retours & rétractation', body: ['Conformément à la réglementation, vous disposez d’un délai de quatorze (14) jours pour exercer votre droit de rétractation à compter de la réception, dans les conditions prévues par la loi. Certains produits, pour des raisons d’hygiène, peuvent en être exclus une fois descellés — [préciser les exclusions éventuelles].'] },
      { h2: 'Remboursement', body: ['Après réception et vérification du retour, le remboursement est effectué par le même moyen de paiement que celui utilisé lors de la commande, dans les délais légaux.'] },
    ],
    questionBefore: 'Une question ? Consultez notre ',
    faqLabel: 'FAQ',
    questionMid: ' ou ',
    contactLabel: 'écrivez-nous',
    questionAfter: '.',
  },
  en: {
    metaTitle: 'Shipping & returns',
    metaDescription: 'Shipping methods, times, fees, tracking, as well as return and refund conditions.',
    kicker: 'Order with confidence',
    title: 'Shipping & returns',
    intro: 'Our essences are prepared and packed with care. Here is how shipping — and, if needed, the return of your order — works.',
    sections: [
      { h2: 'Preparation & shipping', body: ['Each order is prepared by hand. The preparation time and available carriers are specified at checkout. [Shipping times and zones to be completed by the publisher.]'] },
      { h2: 'Fees & times', body: ['Shipping fees and estimated times are shown at payment, depending on the destination and chosen shipping method. [Fee schedule to be completed.]'] },
      { h2: 'Tracking', body: ['As soon as your order ships, a confirmation email is sent; where the carrier allows, it contains a tracking number.'] },
      { h2: 'Returns & withdrawal', body: ['In accordance with regulations, you have fourteen (14) days to exercise your right of withdrawal from receipt, under the conditions provided by law. For hygiene reasons, some products may be excluded once unsealed — [specify any exclusions].'] },
      { h2: 'Refund', body: ['After receipt and inspection of the return, the refund is issued using the same payment method as the order, within the legal timeframe.'] },
    ],
    questionBefore: 'A question? See our ',
    faqLabel: 'FAQ',
    questionMid: ' or ',
    contactLabel: 'write to us',
    questionAfter: '.',
  },
}

export const generateMetadata = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params
  const loc = isLocale(locale) ? locale : defaultLocale
  const t = CONTENT[loc]
  return buildMetadata({ fallbackTitle: t.metaTitle, fallbackDescription: t.metaDescription, path: PATH, locale: loc })
}

export default async function LivraisonRetoursPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  const locale = isLocale(raw) ? raw : defaultLocale
  const t = CONTENT[locale]
  const p = (path: string) => `/${locale}${path}`

  return (
    <StaticPageShell title={t.title} kicker={t.kicker} intro={t.intro}>
      {t.sections.map((section) => (
        <section key={section.h2}>
          <h2>{section.h2}</h2>
          {section.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>
      ))}
      <p>
        {t.questionBefore}
        <Link href={p('/faq')} className="text-[color:var(--color-accent)] underline">{t.faqLabel}</Link>
        {t.questionMid}
        <Link href={p('/contact')} className="text-[color:var(--color-accent)] underline">{t.contactLabel}</Link>
        {t.questionAfter}
      </p>
    </StaticPageShell>
  )
}
