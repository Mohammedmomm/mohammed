import { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    dir: 'ltr',
    siteName: 'Smart Health Tools',
    nav: {
      home: 'Home',
      ageCalc: 'Age Calculator',
      bmiCalc: 'BMI Calculator',
      dashboard: 'Dashboard',
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
    },
    hero: {
      badge: 'Free Health Tools',
      title: 'Smart Health Tools',
      subtitle:
        'Calculate your age and BMI instantly with a fast and modern health tools website.',
      login: 'Login',
      register: 'Get Started Free',
    },
    features: {
      title: 'Our Tools',
      subtitle: 'Simple, accurate, and free health calculators.',
      age: {
        title: 'Age Calculator',
        desc: 'Know your exact age in years, months, days, hours, and more.',
      },
      bmi: {
        title: 'BMI Calculator',
        desc: 'Calculate your Body Mass Index and get personalized health tips.',
      },
    },
    age: {
      title: 'Age Calculator',
      birthDate: 'Date of Birth',
      calculate: 'Calculate Age',
      years: 'Years',
      months: 'Months',
      days: 'Days',
      hours: 'Hours',
      minutes: 'Minutes',
      seconds: 'Seconds',
      happyBirthday: 'Happy Birthday!',
      birthdayMsg: 'Wishing you a wonderful day!',
      saved: 'Result saved to history!',
      loginToSave: 'Login to save your results.',
    },
    bmi: {
      title: 'BMI Calculator',
      height: 'Height (cm)',
      weight: 'Weight (kg)',
      calculate: 'Calculate BMI',
      bmiValue: 'BMI',
      category: 'Category',
      underweight: 'Underweight',
      normal: 'Normal Weight',
      overweight: 'Overweight',
      obese: 'Obese',
      tips: {
        underweight:
          'Consider increasing your calorie intake with nutritious foods. Consult a nutritionist for personalized advice.',
        normal:
          'Great! You have a healthy weight. Maintain a balanced diet and regular physical activity.',
        overweight:
          'Consider a balanced diet and increasing physical activity. Small sustainable changes lead to big results.',
        obese:
          'Please consult a healthcare professional for a personalized weight management plan.',
      },
      saved: 'Result saved to history!',
      loginToSave: 'Login to save your results.',
    },
    auth: {
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email Address',
      phone: 'Phone Number (optional)',
      password: 'Password',
      loginTitle: 'Welcome Back',
      loginSubtitle: 'Login to access your health dashboard',
      registerTitle: 'Create Account',
      registerSubtitle: 'Join us to track your health calculations',
      loginBtn: 'Login',
      registerBtn: 'Create Account',
      noAccount: "Don't have an account?",
      hasAccount: 'Already have an account?',
      loginLink: 'Login',
      registerLink: 'Register now',
    },
    dashboard: {
      welcome: 'Welcome back',
      subtitle: 'Track and manage your health calculations',
      tools: 'Health Tools',
      history: 'Calculation History',
      noHistory: 'No calculations yet. Try one of our tools above!',
      ageCalc: 'Age Calculator',
      bmiCalc: 'BMI Calculator',
      ageDesc: 'Calculate your exact age',
      bmiDesc: 'Check your BMI & health status',
      memberSince: 'Member since',
    },
    footer: {
      desc: 'Free and accurate health tools for everyone.',
      rights: 'All rights reserved.',
      tools: 'Tools',
      age: 'Age Calculator',
      bmi: 'BMI Calculator',
      account: 'Account',
      login: 'Login',
      register: 'Register',
    },
    common: {
      loading: 'Loading...',
      save: 'Save Result',
      saving: 'Saving...',
      error: 'An error occurred. Please try again.',
    },
  },

  ar: {
    dir: 'rtl',
    siteName: 'أدوات الصحة الذكية',
    nav: {
      home: 'الرئيسية',
      ageCalc: 'حاسبة العمر',
      bmiCalc: 'حاسبة كتلة الجسم',
      dashboard: 'لوحة التحكم',
      login: 'تسجيل الدخول',
      register: 'إنشاء حساب',
      logout: 'تسجيل الخروج',
    },
    hero: {
      badge: 'أدوات صحية مجانية',
      title: 'أدوات الصحة الذكية',
      subtitle: 'احسب عمرك ومؤشر كتلة جسمك فوراً مع موقعنا السريع والعصري.',
      login: 'تسجيل الدخول',
      register: 'ابدأ مجاناً',
    },
    features: {
      title: 'أدواتنا',
      subtitle: 'حاسبات صحية بسيطة ودقيقة ومجانية.',
      age: {
        title: 'حاسبة العمر',
        desc: 'اعرف عمرك بالضبط بالسنوات والأشهر والأيام والساعات والمزيد.',
      },
      bmi: {
        title: 'حاسبة مؤشر كتلة الجسم',
        desc: 'احسب مؤشر كتلة جسمك واحصل على نصائح صحية مخصصة.',
      },
    },
    age: {
      title: 'حاسبة العمر',
      birthDate: 'تاريخ الميلاد',
      calculate: 'احسب العمر',
      years: 'سنوات',
      months: 'أشهر',
      days: 'أيام',
      hours: 'ساعات',
      minutes: 'دقائق',
      seconds: 'ثواني',
      happyBirthday: 'عيد ميلاد سعيد!',
      birthdayMsg: 'أتمنى لك يوماً رائعاً!',
      saved: 'تم حفظ النتيجة في السجل!',
      loginToSave: 'سجل دخولك لحفظ نتائجك.',
    },
    bmi: {
      title: 'حاسبة مؤشر كتلة الجسم',
      height: 'الطول (سم)',
      weight: 'الوزن (كجم)',
      calculate: 'احسب المؤشر',
      bmiValue: 'المؤشر',
      category: 'الفئة',
      underweight: 'نقص الوزن',
      normal: 'وزن طبيعي',
      overweight: 'زيادة الوزن',
      obese: 'سمنة',
      tips: {
        underweight:
          'فكر في زيادة السعرات الحرارية بأطعمة مغذية. استشر أخصائي تغذية للحصول على نصيحة شخصية.',
        normal:
          'رائع! لديك وزن صحي. حافظ على نظام غذائي متوازن ونشاط بدني منتظم.',
        overweight:
          'فكر في نظام غذائي متوازن وزيادة النشاط البدني. التغييرات الصغيرة المستدامة تؤدي إلى نتائج كبيرة.',
        obese:
          'يرجى استشارة متخصص رعاية صحية للحصول على خطة إدارة وزن مخصصة.',
      },
      saved: 'تم حفظ النتيجة في السجل!',
      loginToSave: 'سجل دخولك لحفظ نتائجك.',
    },
    auth: {
      firstName: 'الاسم الأول',
      lastName: 'الاسم الأخير',
      email: 'البريد الإلكتروني',
      phone: 'رقم الهاتف (اختياري)',
      password: 'كلمة المرور',
      loginTitle: 'مرحباً بعودتك',
      loginSubtitle: 'سجل دخولك للوصول إلى لوحة الصحة',
      registerTitle: 'إنشاء حساب',
      registerSubtitle: 'انضم إلينا لتتبع حساباتك الصحية',
      loginBtn: 'تسجيل الدخول',
      registerBtn: 'إنشاء حساب',
      noAccount: 'ليس لديك حساب؟',
      hasAccount: 'لديك حساب بالفعل؟',
      loginLink: 'سجل الدخول',
      registerLink: 'سجل الآن',
    },
    dashboard: {
      welcome: 'مرحباً',
      subtitle: 'تتبع وإدارة حساباتك الصحية',
      tools: 'الأدوات الصحية',
      history: 'سجل الحسابات',
      noHistory: 'لا توجد حسابات بعد. جرب إحدى أدواتنا أعلاه!',
      ageCalc: 'حاسبة العمر',
      bmiCalc: 'حاسبة كتلة الجسم',
      ageDesc: 'احسب عمرك بالضبط',
      bmiDesc: 'تحقق من مؤشرك وحالتك الصحية',
      memberSince: 'عضو منذ',
    },
    footer: {
      desc: 'أدوات صحية مجانية ودقيقة للجميع.',
      rights: 'جميع الحقوق محفوظة.',
      tools: 'الأدوات',
      age: 'حاسبة العمر',
      bmi: 'حاسبة كتلة الجسم',
      account: 'الحساب',
      login: 'تسجيل الدخول',
      register: 'إنشاء حساب',
    },
    common: {
      loading: 'جاري التحميل...',
      save: 'حفظ النتيجة',
      saving: 'جاري الحفظ...',
      error: 'حدث خطأ. يرجى المحاولة مرة أخرى.',
    },
  },
};

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const saved = localStorage.getItem('lang') || 'en';
    setLang(saved);
  }, []);

  function toggleLang() {
    const next = lang === 'en' ? 'ar' : 'en';
    setLang(next);
    localStorage.setItem('lang', next);
  }

  return (
    <LangContext.Provider value={{ lang, toggleLang, t: translations[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
