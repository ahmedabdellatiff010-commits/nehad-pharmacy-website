// Product catalog — no backend needed
const PRODUCTS = {
  'skincare-moisturizer': {
    id: 'skincare-moisturizer',
    name: 'مرطب البشرة المتقدم',
    category: 'العناية بالبشرة',
    price: 150,
    discount: 20,
    volumes: ['50 مل', '100 مل'],
    defaultVolume: '50 مل',
    tagline: 'ترطيب عميق وحماية للبشرة',
    description: 'مرطب طبيعي يحتوي على مكونات طبيعية تعطي البشرة النعومة والترطيب العميق. مناسب لجميع أنواع البشرة.',
    notes: {
      top: ['ترطيب فوري', 'امتصاص سريع'],
      heart: ['حماية طبيعية', 'آمن على البشرة'],
      base: ['مكونات طبيعية 100%', 'خالي من المواد الضارة']
    },
    isBestSeller: true,
    stock: 0
  },
  'skincare-cleanser': {
    id: 'skincare-cleanser',
    name: 'منظف الوجه اللطيف',
    category: 'العناية بالبشرة',
    price: 120,
    volumes: ['100 مل', '200 مل'],
    defaultVolume: '100 مل',
    tagline: 'تنظيف عميق بدون جفاف',
    description: 'منظف لطيف يزيل الأوساخ والمكياج دون المساس برطوبة البشرة الطبيعية. يترك البشرة نظيفة وناعمة.',
    notes: {
      top: ['تنظيف فعال', 'لا يسبب جفاف'],
      heart: ['لطيف على البشرة', 'مناسب يومياً'],
      base: ['صيغة متوازنة', 'معتمد من الخبراء']
    },
    stock: 50
  },
  'haircare-shampoo': {
    id: 'haircare-shampoo',
    name: 'شامبو العناية بالشعر',
    category: 'العناية بالشعر',
    price: 100,
    discount: 25,
    volumes: ['200 مل', '400 مل'],
    defaultVolume: '200 مل',
    tagline: 'لشعر صحي وقوي وناعم',
    description: 'شامبو طبيعي يعطي الشعر الحيوية واللمعان. يحمي الشعر من الهيشان والتقصف ويعطيه رائحة منعشة طوال اليوم.',
    notes: {
      top: ['تنظيف عميق', 'رائحة منعشة'],
      heart: ['حماية الشعر', 'تقوية الجذور'],
      base: ['مكونات طبيعية', 'لا يحتوي كبريتات']
    },
    isBestSeller: true,
    stock: 75
  },
  'haircare-conditioner': {
    id: 'haircare-conditioner',
    name: 'بلسم الشعر المغذي',
    category: 'العناية بالشعر',
    price: 110,
    volumes: ['150 مل', '300 مل'],
    defaultVolume: '150 مل',
    tagline: 'تغذية وترطيب مكثف للشعر',
    description: 'بلسم غني بالمكونات المغذية يعطي الشعر الحيوية واللمعان والنعومة. يمنع التقصف ويسهل تسريح الشعر.',
    notes: {
      top: ['ترطيب عميق', 'سهل التطبيق'],
      heart: ['تغذية الشعر', 'تقليل التقصف'],
      base: ['زيوت طبيعية', 'خالي من السلفات']
    },
    stock: 30
  },
  'personal-deodorant': {
    id: 'personal-deodorant',
    name: 'مزيل العرق الطبيعي',
    category: 'العناية الشخصية',
    price: 90,
    volumes: ['50 مل', '100 مل'],
    defaultVolume: '50 مل',
    tagline: 'حماية طول اليوم برائحة منعشة',
    description: 'مزيل عرق فعال ومأمون يحمي من الرائحة طول اليوم. معطر طبيعي يترك انطباعاً منعشاً ورائعاً.',
    notes: {
      top: ['حماية 24 ساعة', 'رائحة طويلة الأمد'],
      heart: ['مادة فعالة طبيعية', 'آمن على الجلد'],
      base: ['معطر طبيعي', 'خالي من الكحول']
    },
    stock: 100
  },
  'personal-body-lotion': {
    id: 'personal-body-lotion',
    name: 'لوشن الجسم المرطب',
    category: 'العناية الشخصية',
    price: 130,
    volumes: ['200 مل', '400 مل'],
    defaultVolume: '200 مل',
    tagline: 'ترطيب شامل للجسم بنعومة',
    description: 'لوشن خفيف يرطب الجسم بعمق ويعطيه ملمساً ناعماً. يحتوي على مكونات طبيعية تغذي البشرة وتحميها.',
    notes: {
      top: ['امتصاص سريع', 'رائحة لطيفة'],
      heart: ['ترطيب دائم', 'حماية البشرة'],
      base: ['مكونات طبيعية', 'آمن للاستخدام اليومي']
    },
    stock: 45
  },
  'kids-wash': {
    id: 'kids-wash',
    name: 'غسول الأطفال اللطيف',
    category: 'منتجات الأطفال',
    price: 85,
    volumes: ['200 مل', '400 مل'],
    defaultVolume: '200 مل',
    tagline: 'تنظيف لطيف وآمن للأطفال',
    description: 'غسول خاص بالأطفال لطيف جداً على البشرة الحساسة. يحافظ على رطوبة بشرة الطفل الطبيعية.',
    notes: {
      top: ['لطيف على البشرة', 'آمن تماماً'],
      heart: ['حماية الرطوبة الطبيعية', 'بدون دموع'],
      base: ['مكونات طبيعية', 'معتمد من أطباء الأطفال']
    },
    stock: 25
  },
  'kids-moisturizer': {
    id: 'kids-moisturizer',
    name: 'مرطب بشرة الأطفال',
    category: 'منتجات الأطفال',
    price: 100,
    volumes: ['100 مل', '200 مل'],
    defaultVolume: '100 مل',
    tagline: 'حماية وترطيب آمن للأطفال',
    description: 'مرطب آمن تماماً لبشرة الأطفال الحساسة. يحمي البشرة من الجفاف والتشقق مع الحفاظ على ليونتها الطبيعية.',
    notes: {
      top: ['حماية من الجفاف', 'امتصاص سريع'],
      heart: ['آمن للأطفال', 'بدون مواد ضارة'],
      base: ['مكونات طبيعية', 'معتمد دولياً']
    },
    stock: 20
  },
  'vitamins-c-serum': {
    id: 'vitamins-c-serum',
    name: 'مصل فيتامين C المركز',
    category: 'الفيتامينات والمكملات',
    price: 180,
    discount: 15,
    volumes: ['30 مل', '50 مل'],
    defaultVolume: '30 مل',
    tagline: 'تفتيح وحماية بقوة مضادات الأكسدة',
    description: 'مصل قوي غني بفيتامين C لتفتيح البشرة وحمايتها من الأكسدة. يقلل التجاعيد ويعطي إشراقة طبيعية.',
    notes: {
      top: ['تركيز عالي', 'امتصاص سريع'],
      heart: ['حماية من الأكسدة', 'تفتيح طبيعي'],
      base: ['نتائج مرئية', 'معتمد دولياً']
    },
    isBestSeller: true,
    stock: 15
  },
  'sunscreen-spf50': {
    id: 'sunscreen-spf50',
    name: 'واقي شمس SPF 50',
    category: 'العناية بالبشرة',
    price: 140,
    volumes: ['50 مل', '100 مل'],
    defaultVolume: '50 مل',
    tagline: 'حماية عالية من الأشعة الفوق البنفسجية',
    description: 'واقي شمس عالي الحماية يحمي البشرة من الأشعة الضارة. خفيف الوزن وسهل التطبيق.',
    notes: {
      top: ['حماية SPF 50', 'مقاوم للماء'],
      heart: ['آمن على البشرة', 'حماية شاملة'],
      base: ['لا يترك آثار', 'مناسب للاستخدام اليومي']
    },
    stock: 60
  },
  'makeup-foundation': {
    id: 'makeup-foundation',
    name: 'أساس سائل PRO',
    category: 'المكياج',
    price: 160,
    volumes: ['30 مل', '50 مل'],
    defaultVolume: '30 مل',
    tagline: 'تغطية مثالية وإطلالة احترافية',
    description: 'أساس سائل عالي الجودة يعطي تغطية متوازنة وطبيعية. مناسب لجميع أنواع البشرة.',
    notes: {
      top: ['تغطية مثالية', 'ثبات طويل الأمد'],
      heart: ['ملمس ناعم', 'لا يسبب جفاف'],
      base: ['صيغة متقدمة', 'مقاومة للعرق']
    },
    stock: 40
  },
  'makeup-lipstick': {
    id: 'makeup-lipstick',
    name: 'أحمر شفاه فاخر',
    category: 'المكياج',
    price: 95,
    volumes: ['3.5g'],
    defaultVolume: '3.5g',
    tagline: 'لون مشبع وملمس حريري',
    description: 'أحمر شفاه فاخر بألوان متنوعة وملمس ناعم. يرطب الشفاه ويدوم طويلاً.',
    notes: {
      top: ['ألوان زاهية', 'ملمس ناعم'],
      heart: ['ترطيب مستمر', 'ثبات طويل'],
      base: ['صيغة طبيعية', 'آمن للاستخدام اليومي']
    },
    stock: 80
  },
  'medical-antiseptic': {
    id: 'medical-antiseptic',
    name: 'مطهر جروح طبي',
    category: 'الصحة الطبية',
    price: 45,
    volumes: ['100 مل', '250 مل'],
    defaultVolume: '100 مل',
    tagline: 'تعقيم فعال وحماية من الالتهابات',
    description: 'مطهر طبي معتمد يعقم الجروح ويحميها من الالتهابات. سريع المفعول وآمن تماماً.',
    notes: {
      top: ['تعقيم فعال', 'سريع المفعول'],
      heart: ['حماية من الالتهابات', 'معتمد طبياً'],
      base: ['آمن للاستخدام', 'مناسب للعائلة']
    },
    stock: 35
  },
  'medical-bandages': {
    id: 'medical-bandages',
    name: 'ضمادات طبية متنوعة',
    category: 'الصحة الطبية',
    price: 35,
    volumes: ['20 قطعة'],
    defaultVolume: '20 قطعة',
    tagline: 'ضمادات آمنة لجميع أنواع الجروح',
    description: 'ضمادات طبية معقمة تناسب جميع أنواع الجروح الصغيرة والمتوسطة.',
    notes: {
      top: ['معقمة تماماً', 'التصاق قوي'],
      heart: ['آمنة على البشرة', 'سهل الإزالة'],
      base: ['متنوعة الأحجام', 'مواد طبيعية']
    },
    stock: 90
  },
  'offer-bundle': {
    id: 'offer-bundle',
    name: 'عرض العناية الشاملة',
    category: 'العروض الخاصة',
    price: 280,
    volumes: ['مجموعة'],
    defaultVolume: 'مجموعة',
    tagline: 'توفير 30% على مجموعة العناية الكاملة',
    description: 'مجموعة شاملة تحتوي على منتجات العناية الأساسية بسعر خاص. توفير كبير عند الشراء معاً.',
    notes: {
      top: ['توفير 30%', 'مجموعة شاملة'],
      heart: ['منتجات متكاملة', 'عرض محدود'],
      base: ['أفضل الخيارات', 'سعر مميز']
    },
    stock: 10
  },
  'offer-seasonal': {
    id: 'offer-seasonal',
    name: 'عرض موسمي مميز',
    category: 'العروض الخاصة',
    price: 120,
    volumes: ['متغير'],
    defaultVolume: 'متغير',
    tagline: 'تخفيضات حصرية على المنتجات المختارة',
    description: 'عروض موسمية حصرية على أفضل المنتجات. تخفيضات تصل إلى 40% على منتجات مختارة.',
    notes: {
      top: ['تخفيضات حتى 40%', 'عرض محدود الوقت'],
      heart: ['منتجات مختارة', 'جودة عالية'],
      base: ['توفير حقيقي', 'عرض حصري']
    },
    stock: 5
  }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PRODUCTS;
}
