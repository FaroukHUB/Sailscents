/**
 * Données de départ du catalogue (catégories + produits), rédigées à partir des
 * textes fournis par le client. Utilisées une seule fois par la route de seed
 * pour peupler la base de production ; ensuite tout s'édite depuis l'admin.
 *
 * Les produits sont créés en BROUILLON avec des prix indicatifs à ajuster.
 */

export const SEED_CATEGORIES = [
  { name: 'Les Ouds', slug: 'les-ouds' },
  { name: 'Les Roses', slug: 'les-roses' },
  { name: 'Les Mukhalat', slug: 'les-mukhalat' },
]

type SeedProduct = {
  name: string
  slug: string
  categorySlug: string
  originCountry: string
  originMethod?: string
  shortDescription: string
  notesHeart: string
  description: string[]
  variants?: { label: string; price: number }[]
}

const DEFAULT_VARIANTS = [
  { label: '3 ml', price: 39 },
  { label: '6 ml', price: 69 },
  { label: '12 ml', price: 119 },
]

export const SEED_PRODUCTS: SeedProduct[] = [
  {
    name: 'Oud Vietnam',
    slug: 'oud-vietnam',
    categorySlug: 'les-ouds',
    originCountry: 'Vietnam',
    originMethod: 'Distillation — style vietnamien',
    shortDescription:
      'Huile de style vietnamien : douce et fruitée, notes de fruits rouges, miel et bois chocolaté.',
    notesHeart: 'Fruits rouges, figue, prune, miel, caramel, bois chocolaté',
    description: [
      'Les huiles de style vietnamien sont riches, aromatiques et acidulées. Le Vietnam abrite le kyara, ce bois de oud très rare et densément résiné, considéré comme la crème de la crème du monde du oud. Le pays est aussi la source du meilleur bois d’agar « du sol » — des fragments densément résinés issus d’arbres abattus, partiellement enfouis sous la terre et les feuilles.',
      'Aujourd’hui, le véritable bois vietnamien de distillation est presque introuvable : chaque morceau sorti de la jungle est acheté par les grandes maisons d’encens japonaises et les collectionneurs privés. On parle donc surtout d’huile de « style vietnamien », qui recompose les caractéristiques du oud vietnamien original.',
      'Le profil : doux, avec des notes de fruits rouges et de baies, de figue et de prune ; des touches de miel et de caramel ; un bois évoquant le chocolat doux. Aucune odeur rassise, fermentée ou aigre — et une couleur rougeâtre caractéristique.',
    ],
  },
  {
    name: 'Oud Borneo',
    slug: 'oud-borneo',
    categorySlug: 'les-ouds',
    originCountry: 'Bornéo',
    originMethod: 'Distillation — style bornéo',
    shortDescription:
      'Huile de style bornéo : aérée, légère et suave, entre pin, camphre et vanille crémeuse.',
    notesHeart: 'Aiguilles de pin, camphre, menthe, vanille crémeuse, miel cru, fleurs blanches',
    description: [
      'Les huiles de oud de Bornéo proviennent de plusieurs espèces d’Aquilaria cultivées sur l’île de Bornéo, au climat de forêt tropicale très chaud. Quelle que soit l’espèce, les huiles partagent un même profil : un caractère frais et léger, très apprécié dans le monde du oud.',
      'On parle de style « bornéo » car c’est le profil olfactif de la zone géographique — plus que l’espèce — qui compte. Le oud de l’île tend d’ailleurs à être supérieur à celui du continent malais ou indonésien.',
      'Le profil : aéré, léger et suave ; riche en terpénoïdes (aiguilles de pin, camphre, parfois menthe) ; des nuances crémeuses de vanille ; globalement sucré, avec parfois une pointe d’amertume, et des notes surprenantes de fleurs blanches, de miel cru et d’herbes. Souvent décrit comme transcendantal, méditatif et pétillant.',
    ],
  },
  {
    name: 'Oud Hindi (Assam)',
    slug: 'oud-hindi-assam',
    categorySlug: 'les-ouds',
    originCountry: 'Assam (Inde)',
    originMethod: 'Distillation traditionnelle indienne (trempage long)',
    shortDescription:
      'Huile de style indien : animale, fumée, cuir et foin — puissante, royale et intransigeante.',
    notesHeart: 'Animal, foin, thé, paille, bois, épices, fumée, cuir',
    description: [
      'Le oud « Hindi » — aussi appelé indien, bengali ou assam — était à l’origine distillé exclusivement à partir d’arbres de l’espèce Agallocha poussant en Assam, région montagneuse du nord-est de l’Inde connue pour ses plantations de thé.',
      'Très apprécié des familles royales du Moyen-Orient et des Émirats, ce style s’est diffusé dans toute la culture arabe. Son profil : animal, avec de fortes notes de foin et de fumier ; des nuances de thé, de paille, de bois et d’épices ; la fumée et le cuir comme signatures. Fort, austère, intransigeant — mais aussi royal et spirituellement élevant.',
      'Le style indien naît de la combinaison d’une espèce (Agallocha) et d’une méthode traditionnelle : un trempage plus long que la normale du bois avant distillation, qui produit cette pointe aigre et fermentée si caractéristique d’un bon « Hindi ».',
    ],
  },
  {
    name: 'Oud Meroki',
    slug: 'oud-meroki',
    categorySlug: 'les-ouds',
    originCountry: 'Merauke (Indonésie)',
    originMethod: 'Distillation — région de Maroke',
    shortDescription:
      'Oud indonésien de Maroke : vert, humide, pur et fumé — truffé, terreux et sauvage.',
    notesHeart: 'Vert (menthe), truffe, terre, bois, fumée',
    description: [
      'Voici un oud indonésien parmi les innombrables variétés du pays — une diversité énorme, tout comme la qualité en général. Les meilleurs exemples évoquent l’odeur du oud brûlé en encens : vert (comme la menthe), humide, pur et fumé.',
      'Les huiles de Maroke proviennent de la région du même nom (Merauke). Pures, elles sont truffées, terreuses, sauvages et boisées. Moins accessible que ses semblables, on le trouve difficilement — et qui dit rareté dit aussi qu’une bonne qualité reste précieuse.',
    ],
  },
  {
    name: 'Rose Taïfi',
    slug: 'rose-taifi',
    categorySlug: 'les-roses',
    originCountry: 'Taïf',
    originMethod: 'Rosa Damascena',
    shortDescription:
      'Rose de Taïf (Damascena) : opulente, puissante, agrumée et fruitée, finale finement musquée.',
    notesHeart: 'Agrumes, fruits, fraîcheur, épices fines, musc',
    description: [
      'La Rosa Damascena, la rose de Damas, doit son nom à l’antique cité de Damas — mais sa véritable origine est Shiraz, en Perse. Hybride de Rosa Gallica, Moschata et Fedtschenkoana, elle a voyagé de Shiraz à Damas, puis en Europe avec les Croisades, adoptée dans les jardins royaux et les apothicaires pour ses vertus et son parfum.',
      'Ma rose de Taïf est une Damascena à porter sur les vêtements, chemises et qamis, où elle tient vraiment longtemps.',
      'Très opulente et puissante, assez agrumée et fruitée, rafraîchissante par sa fraîcheur et finement épicée à la fois, elle s’achève sur des notes musquées.',
    ],
  },
  {
    name: 'Rose Kashmir',
    slug: 'rose-kashmir',
    categorySlug: 'les-roses',
    originCountry: 'Cachemire',
    originMethod: 'Rosa Damascena d’altitude',
    shortDescription:
      'Rose du Cachemire (Damascena) : une limonade d’agrumes, mandarine sucrée, note verte et miellée.',
    notesHeart: 'Mandarine sucrée, marmelade d’agrumes, note verte de tige, musc, miel',
    description: [
      'Une Damascena d’altitude, résistante au froid, à la très belle tenue. On a envie de la boire : une vraie limonade italienne.',
      'Note de mandarine sucrée, marmelade d’agrumes, accents verts de la tige, facettes musquées et miellées. Une rose de hautes altitudes, aussi belle et tenace que la Taïfi.',
    ],
  },
  {
    name: 'Oud Silani',
    slug: 'oud-silani',
    categorySlug: 'les-ouds',
    originCountry: 'Sri Lanka',
    originMethod: 'Distillation (Aquilaria)',
    shortDescription:
      'Oud du Sri Lanka : très aromatique et puissant, épices sèches et note marine — profondément addictif.',
    notesHeart: 'Épices sèches, note marine (écume, rochers), bois d’Aquilaria, encens',
    description: [
      'Le oud silani tire son nom de « Silan », l’autre nom du Sri Lanka en arabe.',
      'Une huile très aromatique et puissante : des notes d’épices sèches et une facette marine — l’odeur de rochers baignés d’écume — irrésistiblement addictive. Vient ensuite le cœur boisé de l’Aquilaria, cette odeur d’encens que l’on connaît par sa fumée.',
      'Un oud fin et profondément addictif, l’un des meilleurs Sri-Lankais que j’aie connus jusqu’à maintenant. Petit batch disponible actuellement : à acheter sans modération, et à savourer occasionnellement.',
    ],
  },
  {
    name: 'Rose Azerbaïdjan 1972',
    slug: 'rose-azerbaidjan-1972',
    categorySlug: 'les-roses',
    originCountry: 'Azerbaïdjan',
    originMethod: 'Rosa Damascena — macération vintage (1972)',
    shortDescription:
      'Une rose vintage de collection (1972) : le fruité frais viré au capiteux, spiritueux sucré et fûts de bois.',
    notesHeart: 'Agrumes, fruits rouges liquoreux, alcool spiritueux sucré, fûts de bois',
    description: [
      'Une rose vintage de collection. Avec l’âge, ses notes d’agrumes, fruitées et fraîches ont viré vers le capiteux : un alcool spiritueux sucré qui rappelle les fûts de bois où l’on conserve le whisky.',
      'On y retrouve aujourd’hui des notes de fruits rouges liquoreuses. L’âge de la macération est le facteur de cette transformation. Une rose de collection incroyable.',
    ],
  },
  {
    name: 'Rose Indienne',
    slug: 'rose-indienne',
    categorySlug: 'les-roses',
    originCountry: 'Inde',
    originMethod: 'Rosa Damascena (distillation tige incluse)',
    shortDescription:
      'Rose indienne Damascena : l’une des plus puissantes qui soit — agrumes fruités et amers, notes vertes de tige.',
    notesHeart: 'Agrumes fruités, amertume, notes vertes de tiges coupées, chaleur',
    description: [
      'Une rose très puissante — l’une des plus puissantes que j’aie eues dans ma vie. Une odeur d’agrumes fruités et amers à la fois, avec des notes vertes de tiges coupées : à croire qu’on a distillé la tige avec.',
      'Elle reste puissante sur les vêtements ; cette rose indienne chaude sort du lot. Une rose d’un autre monde — il faut la sentir pour le croire. Les passionnés de roses puissantes en seront ravis, à coup sûr.',
    ],
  },
  {
    name: 'Mukhalat Wahir',
    slug: 'mukhalat-wahir',
    categorySlug: 'les-mukhalat',
    originCountry: 'Composition',
    originMethod: 'Mélange de parfumeur',
    shortDescription:
      'Un mélange signature : oud naturel thaïlandais enlacé de roses, pris dans une spirale de musc.',
    notesHeart: 'Oud naturel thaïlandais, bouquet de roses, musc white animal (gazelle)',
    description: [
      'Un mélange simple et efficace, une composition de parfumeur d’expérience : séduisant, opulent, et d’une très longue tenue sur la peau.',
      'Des notes de oud naturel thaïlandais enlacé par un bouquet de roses, aussitôt pris dans une spirale de musc white animal (gazelle).',
      'C’est le mukhalat que je conseille à tout le monde — il fera l’unanimité dans votre entourage.',
    ],
  },
]

// Stock par defaut « en stock » (ajustable ensuite dans l'admin).
const DEFAULT_STOCK = 20

export const seedDefaultVariants = () => DEFAULT_VARIANTS.map((v) => ({ ...v, stock: DEFAULT_STOCK }))
export const SEED_DEFAULT_STOCK = DEFAULT_STOCK
