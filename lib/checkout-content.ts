import type { LocaleCode } from "@/lib/i18n";

export const policyIds = ["refund", "shipping", "privacy", "terms", "contact"] as const;

export type PolicyId = (typeof policyIds)[number];

type CheckoutContent = {
  eyebrow: string;
  title: string;
  intro: string;
  backToCart: string;
  account: string;
  signedInAs: string;
  accountCopy: string;
  signIn: string;
  changeAccount: string;
  accountUnavailable: string;
  accountLoading: string;
  delivery: string;
  deliveryCopy: string;
  payment: string;
  paymentCopy: string;
  paymentNote: string;
  order: string;
  empty: string;
  emptyCopy: string;
  returnToShop: string;
  items: string;
  subtotal: string;
  shipping: string;
  shippingValue: string;
  total: string;
  paymentButton: string;
  paymentLoading: string;
  policiesHint: string;
  close: string;
  demoEyebrow: string;
  demoNotice: string;
};

type PolicyContent = {
  label: string;
  title: string;
  lead: string;
  sections: Array<{ label: string; copy: string }>;
};

type LocaleCheckoutContent = {
  checkout: CheckoutContent;
  policies: Record<PolicyId, PolicyContent>;
};

const checkoutContent: Record<LocaleCode, LocaleCheckoutContent> = {
  en: {
    checkout: {
      eyebrow: "checkout / demo",
      title: "finish in focus.",
      intro: "Review your selected frames, then continue to a secure test payment.",
      backToCart: "back to cart",
      account: "account",
      signedInAs: "signed in as",
      accountCopy: "Sign in or create an account before opening the test payment. Your cart stays here while you do.",
      signIn: "sign in / create account",
      changeAccount: "change account",
      accountUnavailable: "Account access is being connected before this test checkout can open.",
      accountLoading: "checking account",
      delivery: "delivery",
      deliveryCopy: "This student project does not collect delivery addresses or dispatch physical products.",
      payment: "payment",
      paymentCopy: "Card details are entered only on Stripe’s secure test checkout. BLUR never receives or stores them.",
      paymentNote: "Test mode only. No real money is charged.",
      order: "your order",
      empty: "your cart is waiting.",
      emptyCopy: "Choose a frame before entering checkout.",
      returnToShop: "return to shop",
      items: "items",
      subtotal: "subtotal",
      shipping: "shipping",
      shippingValue: "not calculated",
      total: "total",
      paymentButton: "open secure test checkout",
      paymentLoading: "opening secure checkout",
      policiesHint: "Policies for this demo checkout",
      close: "close",
      demoEyebrow: "BLUR / student project — demo only",
      demoNotice: "This store is a test project. No real order, delivery, or payment is created.",
    },
    policies: {
      refund: {
        label: "refund policy",
        title: "refund policy",
        lead: "No real payment is accepted in this test environment.",
        sections: [
          { label: "test orders", copy: "All orders are simulations, so there is no real amount to refund." },
          { label: "before launch", copy: "A commercial version must publish a reviewed return and refund process before taking live orders." },
        ],
      },
      shipping: {
        label: "shipping",
        title: "shipping",
        lead: "Nothing is dispatched from this student-project storefront.",
        sections: [
          { label: "prototype only", copy: "Delivery dates, shipping prices, and address fields are not collected or used here." },
          { label: "before launch", copy: "A live store needs confirmed destinations, delivery partners, pricing, and region-specific terms." },
        ],
      },
      privacy: {
        label: "privacy policy",
        title: "privacy policy",
        lead: "The demo keeps the experience intentionally minimal.",
        sections: [
          { label: "browser preferences", copy: "Cart, language, and currency choices may be stored locally in the browser so the visit can continue smoothly." },
          { label: "accounts & payment", copy: "If enabled, Supabase handles account access and Stripe handles test card entry. BLUR does not receive or store card numbers." },
        ],
      },
      terms: {
        label: "terms of service",
        title: "terms of service",
        lead: "BLUR is a fictional student and portfolio concept.",
        sections: [
          { label: "visual prototype", copy: "Product cards, availability, and prices are part of the design exercise; they do not form a purchase contract." },
          { label: "future release", copy: "A commercial launch requires final legal, sales, privacy, and fulfilment terms for the regions it serves." },
        ],
      },
      contact: {
        label: "contact",
        title: "contact",
        lead: "This prototype does not provide real order support.",
        sections: [
          { label: "project questions", copy: "Use the project or course contact channel through which this BLUR demo was shared." },
          { label: "before launch", copy: "A verified support address, legal business details, and customer-service process must be added before commercial use." },
        ],
      },
    },
  },
  az: {
    checkout: {
      eyebrow: "ödəniş / demo",
      title: "fokusu tamamla.",
      intro: "Seçdiyin çərçivələri yoxla, sonra təhlükəsiz test ödənişinə keç.",
      backToCart: "səbətə qayıt",
      account: "hesab",
      signedInAs: "daxil olduğun hesab",
      accountCopy: "Test ödənişini açmazdan əvvəl daxil ol və ya hesab yarat. Bu müddətdə səbətin yerində qalır.",
      signIn: "daxil ol / hesab yarat",
      changeAccount: "hesabı dəyiş",
      accountUnavailable: "Bu test checkout açılmazdan əvvəl hesab bağlantısı qurulmalıdır.",
      accountLoading: "hesab yoxlanılır",
      delivery: "çatdırılma",
      deliveryCopy: "Bu tələbə layihəsi ünvan toplamır və fiziki məhsul göndərmir.",
      payment: "ödəniş",
      paymentCopy: "Kart məlumatı yalnız Stripe-in təhlükəsiz test checkout səhifəsində daxil edilir. BLUR bu məlumatı almır və saxlamır.",
      paymentNote: "Yalnız test rejimi. Real pul tutulmur.",
      order: "sənin sifarişin",
      empty: "səbətin gözləyir.",
      emptyCopy: "Checkout-a keçməzdən əvvəl çərçivə seç.",
      returnToShop: "mağazaya qayıt",
      items: "məhsullar",
      subtotal: "ara cəm",
      shipping: "çatdırılma",
      shippingValue: "hesablanmır",
      total: "cəmi",
      paymentButton: "təhlükəsiz test checkout-u aç",
      paymentLoading: "təhlükəsiz checkout açılır",
      policiesHint: "Bu demo checkout üçün qaydalar",
      close: "bağla",
      demoEyebrow: "BLUR / tələbə layihəsi — yalnız demo",
      demoNotice: "Bu mağaza test layihəsidir. Real sifariş, çatdırılma və ya ödəniş yaradılmır.",
    },
    policies: {
      refund: {
        label: "geri qaytarma qaydası",
        title: "geri qaytarma qaydası",
        lead: "Bu test mühitində real ödəniş qəbul edilmir.",
        sections: [
          { label: "test sifarişləri", copy: "Bütün sifarişlər simulyasiyadır, buna görə geri qaytarılacaq real məbləğ yoxdur." },
          { label: "canlı buraxılışdan əvvəl", copy: "Kommersiya versiyası real sifariş qəbul etməzdən əvvəl yoxlanılmış geri qaytarma prosesini dərc etməlidir." },
        ],
      },
      shipping: {
        label: "çatdırılma",
        title: "çatdırılma",
        lead: "Bu tələbə layihəsi mağazasından heç nə göndərilmir.",
        sections: [
          { label: "yalnız prototip", copy: "Çatdırılma tarixləri, qiymətləri və ünvan sahələri burada toplanmır və istifadə edilmir." },
          { label: "canlı buraxılışdan əvvəl", copy: "Canlı mağaza üçün ölkələr, çatdırılma tərəfdaşları, qiymətlər və regional qaydalar təsdiqlənməlidir." },
        ],
      },
      privacy: {
        label: "məxfilik qaydası",
        title: "məxfilik qaydası",
        lead: "Demo təcrübəni məqsədli şəkildə minimal saxlayır.",
        sections: [
          { label: "brauzer seçimləri", copy: "Səbət, dil və valyuta seçimləri ziyarətin rahat davam etməsi üçün brauzerdə lokal saxlanıla bilər." },
          { label: "hesab və ödəniş", copy: "Qoşulduğu halda hesab girişini Supabase, test kartı girişini isə Stripe idarə edir. BLUR kart nömrələrini almır və saxlamır." },
        ],
      },
      terms: {
        label: "xidmət şərtləri",
        title: "xidmət şərtləri",
        lead: "BLUR uydurma tələbə və portfolio konseptidir.",
        sections: [
          { label: "vizual prototip", copy: "Məhsul kartları, mövcudluq və qiymətlər dizayn məşqinin hissəsidir; satınalma müqaviləsi yaratmır." },
          { label: "gələcək buraxılış", copy: "Kommersiya buraxılışı xidmət etdiyi regionlar üçün yekun hüquqi, satış, məxfilik və çatdırılma şərtləri tələb edir." },
        ],
      },
      contact: {
        label: "əlaqə",
        title: "əlaqə",
        lead: "Bu prototip real sifariş dəstəyi təqdim etmir.",
        sections: [
          { label: "layihə sualları", copy: "BLUR demosunun paylaşdığı layihə və ya dərs əlaqə kanalından istifadə et." },
          { label: "canlı buraxılışdan əvvəl", copy: "Kommersiya istifadəsindən əvvəl təsdiqlənmiş dəstək ünvanı, hüquqi biznes məlumatı və müştəri xidməti prosesi əlavə edilməlidir." },
        ],
      },
    },
  },
  ru: {
    checkout: {
      eyebrow: "оформление / демо",
      title: "завершите фокус.",
      intro: "Проверьте выбранные оправы, затем перейдите к безопасной тестовой оплате.",
      backToCart: "вернуться в корзину",
      account: "аккаунт",
      signedInAs: "выполнен вход",
      accountCopy: "Войдите или создайте аккаунт перед открытием тестовой оплаты. Корзина останется сохранённой.",
      signIn: "войти / создать аккаунт",
      changeAccount: "сменить аккаунт",
      accountUnavailable: "Доступ к аккаунту подключается до открытия этого тестового оформления.",
      accountLoading: "проверяем аккаунт",
      delivery: "доставка",
      deliveryCopy: "Этот учебный проект не собирает адреса и не отправляет физические товары.",
      payment: "оплата",
      paymentCopy: "Данные карты вводятся только на защищённой тестовой странице Stripe. BLUR не получает и не хранит их.",
      paymentNote: "Только тестовый режим. Реальные деньги не списываются.",
      order: "ваш заказ",
      empty: "ваша корзина ждёт.",
      emptyCopy: "Выберите оправу перед оформлением.",
      returnToShop: "вернуться в магазин",
      items: "товары",
      subtotal: "подытог",
      shipping: "доставка",
      shippingValue: "не рассчитывается",
      total: "итого",
      paymentButton: "открыть безопасную тестовую оплату",
      paymentLoading: "открываем защищённую оплату",
      policiesHint: "Правила для этого демо-оформления",
      close: "закрыть",
      demoEyebrow: "BLUR / учебный проект — только демо",
      demoNotice: "Этот магазин — тестовый проект. Реальный заказ, доставка или платёж не создаются.",
    },
    policies: {
      refund: {
        label: "возврат",
        title: "политика возврата",
        lead: "В этой тестовой среде реальные платежи не принимаются.",
        sections: [
          { label: "тестовые заказы", copy: "Все заказы являются симуляциями, поэтому возвращать реальную сумму не нужно." },
          { label: "до запуска", copy: "Коммерческая версия должна опубликовать проверенный порядок возврата до приёма реальных заказов." },
        ],
      },
      shipping: {
        label: "доставка",
        title: "доставка",
        lead: "Этот учебный магазин ничего не отправляет.",
        sections: [
          { label: "только прототип", copy: "Сроки, стоимость доставки и поля адреса здесь не собираются и не используются." },
          { label: "до запуска", copy: "Для работающего магазина нужны подтверждённые страны, партнёры доставки, цены и региональные правила." },
        ],
      },
      privacy: {
        label: "конфиденциальность",
        title: "политика конфиденциальности",
        lead: "Демо намеренно сохраняет опыт минимальным.",
        sections: [
          { label: "настройки браузера", copy: "Выбор корзины, языка и валюты может временно храниться в браузере, чтобы продолжить посещение без потери состояния." },
          { label: "аккаунт и оплата", copy: "Если подключены, Supabase отвечает за доступ к аккаунту, а Stripe — за ввод тестовой карты. BLUR не получает и не хранит номера карт." },
        ],
      },
      terms: {
        label: "условия сервиса",
        title: "условия сервиса",
        lead: "BLUR — вымышленный учебный и портфолио-концепт.",
        sections: [
          { label: "визуальный прототип", copy: "Карточки товаров, наличие и цены являются частью дизайн-упражнения и не создают договор покупки." },
          { label: "будущий запуск", copy: "Коммерческий запуск потребует финальных юридических, торговых, конфиденциальных и доставочных условий для обслуживаемых регионов." },
        ],
      },
      contact: {
        label: "контакт",
        title: "контакт",
        lead: "Этот прототип не предоставляет поддержку реальных заказов.",
        sections: [
          { label: "вопросы о проекте", copy: "Используйте канал проекта или курса, через который была передана эта демо-версия BLUR." },
          { label: "до запуска", copy: "Перед коммерческим использованием необходимо добавить подтверждённый адрес поддержки, юридические данные и процесс обслуживания клиентов." },
        ],
      },
    },
  },
};

export function getCheckoutContent(locale: LocaleCode) {
  return checkoutContent[locale] ?? checkoutContent.en;
}

