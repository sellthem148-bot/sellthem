// Modèle de textes légaux (à faire valider par un juriste).
// Structuré par type (terms / privacy) puis par langue.

export interface LegalSection {
  h: string;
  p: string;
}
export interface LegalDoc {
  title: string;
  updated: string;
  intro: string;
  disclaimer: string;
  sections: LegalSection[];
}

type Locale = 'fr' | 'he' | 'en' | 'es';

const UPDATED = '21/06/2026';

export const terms: Record<Locale, LegalDoc> = {
  fr: {
    title: "Conditions Générales d'Utilisation",
    updated: `Dernière mise à jour : ${UPDATED}`,
    intro:
      "Bienvenue sur SellThem. En utilisant notre plateforme, vous acceptez les présentes conditions.",
    disclaimer: "Modèle de document — à faire valider par un conseil juridique.",
    sections: [
      { h: '1. Objet', p: "SellThem est une place de marché permettant à des particuliers de vendre et d'acheter des articles de seconde main en Israël." },
      { h: '2. Compte', p: "Vous devez avoir au moins 18 ans et fournir des informations exactes. Vous êtes responsable de la confidentialité de votre mot de passe." },
      { h: '3. Annonces', p: "Les vendeurs sont responsables de l'exactitude de leurs annonces et de la conformité des articles. Les articles illégaux, contrefaits ou dangereux sont interdits." },
      { h: '4. Transactions', p: "SellThem facilite la mise en relation. La vente s'effectue entre l'acheteur et le vendeur. Des frais de service peuvent s'appliquer." },
      { h: '5. Comportement', p: "Tout comportement frauduleux, harcèlement ou contournement de la plateforme peut entraîner la suspension du compte." },
      { h: '6. Responsabilité', p: "SellThem ne saurait être tenue responsable des litiges entre utilisateurs, dans les limites permises par la loi." },
      { h: '7. Contact', p: "Pour toute question : support@sellthem.co.il" }
    ]
  },
  en: {
    title: 'Terms of Service',
    updated: `Last updated: ${UPDATED}`,
    intro: 'Welcome to SellThem. By using our platform, you agree to these terms.',
    disclaimer: 'Template document — to be reviewed by legal counsel.',
    sections: [
      { h: '1. Purpose', p: 'SellThem is a marketplace for individuals to buy and sell second-hand items in Israel.' },
      { h: '2. Account', p: 'You must be at least 18 and provide accurate information. You are responsible for keeping your password confidential.' },
      { h: '3. Listings', p: 'Sellers are responsible for the accuracy of their listings and the compliance of items. Illegal, counterfeit or dangerous items are prohibited.' },
      { h: '4. Transactions', p: 'SellThem facilitates connections. Sales occur between buyer and seller. Service fees may apply.' },
      { h: '5. Conduct', p: 'Fraud, harassment or bypassing the platform may lead to account suspension.' },
      { h: '6. Liability', p: 'SellThem is not liable for disputes between users, to the extent permitted by law.' },
      { h: '7. Contact', p: 'Questions: support@sellthem.co.il' }
    ]
  },
  es: {
    title: 'Términos de Servicio',
    updated: `Última actualización: ${UPDATED}`,
    intro: 'Bienvenido a SellThem. Al usar nuestra plataforma, aceptas estos términos.',
    disclaimer: 'Documento modelo — debe ser revisado por un asesor legal.',
    sections: [
      { h: '1. Objeto', p: 'SellThem es un mercado para que particulares compren y vendan artículos de segunda mano en Israel.' },
      { h: '2. Cuenta', p: 'Debes tener al menos 18 años y proporcionar información veraz. Eres responsable de la confidencialidad de tu contraseña.' },
      { h: '3. Anuncios', p: 'Los vendedores son responsables de la exactitud de sus anuncios. Los artículos ilegales, falsificados o peligrosos están prohibidos.' },
      { h: '4. Transacciones', p: 'SellThem facilita el contacto. La venta ocurre entre comprador y vendedor. Pueden aplicarse comisiones.' },
      { h: '5. Conducta', p: 'El fraude, el acoso o eludir la plataforma pueden conllevar la suspensión de la cuenta.' },
      { h: '6. Responsabilidad', p: 'SellThem no se responsabiliza de disputas entre usuarios, en la medida permitida por la ley.' },
      { h: '7. Contacto', p: 'Preguntas: support@sellthem.co.il' }
    ]
  },
  he: {
    title: 'תנאי שימוש',
    updated: `עודכן לאחרונה: ${UPDATED}`,
    intro: 'ברוכים הבאים ל-SellThem. השימוש בפלטפורמה מהווה הסכמה לתנאים אלה.',
    disclaimer: 'מסמך לדוגמה — יש להעבירו לבדיקת יועץ משפטי.',
    sections: [
      { h: '1. מטרה', p: 'SellThem היא זירת מסחר המאפשרת לאנשים פרטיים לקנות ולמכור פריטים יד שנייה בישראל.' },
      { h: '2. חשבון', p: 'עליכם להיות בני 18 לפחות ולמסור מידע מדויק. אתם אחראים לשמירת סודיות הסיסמה.' },
      { h: '3. מודעות', p: 'המוכרים אחראים לדיוק המודעות ולתקינות הפריטים. אסור לפרסם פריטים לא חוקיים, מזויפים או מסוכנים.' },
      { h: '4. עסקאות', p: 'SellThem מקשרת בין הצדדים. המכירה מתבצעת בין הקונה למוכר. ייתכנו דמי שירות.' },
      { h: '5. התנהגות', p: 'הונאה, הטרדה או עקיפת הפלטפורמה עלולות להוביל להשעיית החשבון.' },
      { h: '6. אחריות', p: 'SellThem אינה אחראית למחלוקות בין משתמשים, בכפוף למותר על פי דין.' },
      { h: '7. יצירת קשר', p: 'שאלות: support@sellthem.co.il' }
    ]
  }
};

export const privacy: Record<Locale, LegalDoc> = {
  fr: {
    title: 'Politique de Confidentialité',
    updated: `Dernière mise à jour : ${UPDATED}`,
    intro: 'Cette politique explique comment SellThem traite vos données personnelles.',
    disclaimer: 'Modèle de document — à faire valider par un conseil juridique.',
    sections: [
      { h: '1. Données collectées', p: 'Nom, e-mail, ville, contenus publiés (annonces, messages) et données techniques de navigation.' },
      { h: '2. Utilisation', p: "Pour fournir le service, gérer votre compte, faciliter les transactions et améliorer la plateforme." },
      { h: '3. Partage', p: 'Vos données ne sont pas vendues. Elles peuvent être partagées avec des prestataires techniques (hébergement, paiement) strictement nécessaires.' },
      { h: '4. Conservation', p: 'Vos données sont conservées tant que votre compte est actif, puis supprimées ou anonymisées.' },
      { h: '5. Vos droits', p: "Vous pouvez accéder, corriger ou supprimer vos données en nous contactant." },
      { h: '6. Cookies', p: 'Des cookies sont utilisés pour la connexion et les préférences (langue).' },
      { h: '7. Contact', p: 'Pour exercer vos droits : privacy@sellthem.co.il' }
    ]
  },
  en: {
    title: 'Privacy Policy',
    updated: `Last updated: ${UPDATED}`,
    intro: 'This policy explains how SellThem processes your personal data.',
    disclaimer: 'Template document — to be reviewed by legal counsel.',
    sections: [
      { h: '1. Data collected', p: 'Name, email, city, published content (listings, messages) and technical browsing data.' },
      { h: '2. Use', p: 'To provide the service, manage your account, facilitate transactions and improve the platform.' },
      { h: '3. Sharing', p: 'Your data is not sold. It may be shared with strictly necessary technical providers (hosting, payment).' },
      { h: '4. Retention', p: 'Your data is kept while your account is active, then deleted or anonymized.' },
      { h: '5. Your rights', p: 'You may access, correct or delete your data by contacting us.' },
      { h: '6. Cookies', p: 'Cookies are used for login and preferences (language).' },
      { h: '7. Contact', p: 'To exercise your rights: privacy@sellthem.co.il' }
    ]
  },
  es: {
    title: 'Política de Privacidad',
    updated: `Última actualización: ${UPDATED}`,
    intro: 'Esta política explica cómo SellThem trata tus datos personales.',
    disclaimer: 'Documento modelo — debe ser revisado por un asesor legal.',
    sections: [
      { h: '1. Datos recopilados', p: 'Nombre, correo, ciudad, contenidos publicados (anuncios, mensajes) y datos técnicos de navegación.' },
      { h: '2. Uso', p: 'Para prestar el servicio, gestionar tu cuenta, facilitar transacciones y mejorar la plataforma.' },
      { h: '3. Compartir', p: 'Tus datos no se venden. Pueden compartirse con proveedores técnicos estrictamente necesarios (alojamiento, pago).' },
      { h: '4. Conservación', p: 'Tus datos se conservan mientras tu cuenta esté activa, luego se eliminan o anonimizan.' },
      { h: '5. Tus derechos', p: 'Puedes acceder, corregir o eliminar tus datos contactándonos.' },
      { h: '6. Cookies', p: 'Se usan cookies para el inicio de sesión y las preferencias (idioma).' },
      { h: '7. Contacto', p: 'Para ejercer tus derechos: privacy@sellthem.co.il' }
    ]
  },
  he: {
    title: 'מדיניות פרטיות',
    updated: `עודכן לאחרונה: ${UPDATED}`,
    intro: 'מדיניות זו מסבירה כיצד SellThem מעבדת את המידע האישי שלכם.',
    disclaimer: 'מסמך לדוגמה — יש להעבירו לבדיקת יועץ משפטי.',
    sections: [
      { h: '1. מידע שנאסף', p: 'שם, אימייל, עיר, תכנים שפורסמו (מודעות, הודעות) ונתוני גלישה טכניים.' },
      { h: '2. שימוש', p: 'למתן השירות, ניהול החשבון, הקלת עסקאות ושיפור הפלטפורמה.' },
      { h: '3. שיתוף', p: 'איננו מוכרים את המידע שלכם. ייתכן שיתוף עם ספקים טכניים הכרחיים בלבד (אחסון, תשלום).' },
      { h: '4. שמירה', p: 'המידע נשמר כל עוד החשבון פעיל, ולאחר מכן נמחק או הופך אנונימי.' },
      { h: '5. הזכויות שלכם', p: 'ניתן לגשת, לתקן או למחוק את המידע על ידי פנייה אלינו.' },
      { h: '6. עוגיות', p: 'נעשה שימוש בעוגיות לצורך התחברות והעדפות (שפה).' },
      { h: '7. יצירת קשר', p: 'למימוש הזכויות: privacy@sellthem.co.il' }
    ]
  }
};

export function getLegal(kind: 'terms' | 'privacy', locale: string): LegalDoc {
  const l = (['fr', 'he', 'en', 'es'].includes(locale) ? locale : 'fr') as Locale;
  return kind === 'terms' ? terms[l] : privacy[l];
}
