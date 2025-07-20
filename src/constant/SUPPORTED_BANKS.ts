const SUPPORTED_BANKS:Bank[] = [
  {
    name: "Access Bank",
    slug: "access-bank",
    code: "044",
    ussd: "901#",
    logo: "https://nigerianbanks.xyz/logo/access-bank.png"
  },
  {
    name: "Access Bank (Diamond)",
    slug: "access-bank-diamond",
    code: "063",
    ussd: "426#",
    logo: "https://nigerianbanks.xyz/logo/access-bank-diamond.png"
  },
  {
    name: "ASO Savings and Loans",
    slug: "asosavings",
    code: "090001",
    ussd: "",
    logo: "https://nigerianbanks.xyz/logo/asosavings.png"
  },
  {
    name: "Bowen Microfinance Bank",
    slug: "bowen-microfinance-bank",
    code: "090148",
    ussd: "",
    logo: "https://nigerianbanks.xyz/logo/default-image.png"
  },
  {
    name: "CEMCS Microfinance Bank",
    slug: "cemcs-microfinance-bank",
    code: "090154",
    ussd: "",
    logo: "https://nigerianbanks.xyz/logo/cemcs-microfinance-bank.png"
  },
  {
    name: "Citibank Nigeria",
    slug: "citibank-nigeria",
    code: "023",
    ussd: "",
    logo: "https://nigerianbanks.xyz/logo/citibank-nigeria.png"
  },
  {
    name: "Ecobank Nigeria",
    slug: "ecobank-nigeria",
    code: "050",
    ussd: "326#",
    logo: "https://nigerianbanks.xyz/logo/ecobank-nigeria.png"
  },
  {
    name: "Ekondo Microfinance Bank",
    slug: "ekondo-microfinance-bank",
    code: "090097",
    ussd: "540178#",
    logo: "https://nigerianbanks.xyz/logo/ekondo-microfinance-bank.png"
  },
  {
    name: "Fidelity Bank",
    slug: "fidelity-bank",
    code: "070",
    ussd: "770#",
    logo: "https://nigerianbanks.xyz/logo/fidelity-bank.png"
  },
  {
    name: "First Bank of Nigeria",
    slug: "first-bank-of-nigeria",
    code: "011",
    ussd: "894#",
    logo: "https://nigerianbanks.xyz/logo/first-bank-of-nigeria.png"
  },
  {
    name: "First City Monument Bank",
    slug: "first-city-monument-bank",
    code: "214",
    ussd: "329#",
    logo: "https://nigerianbanks.xyz/logo/first-city-monument-bank.png"
  },
  {
    name: "Globus Bank",
    slug: "globus-bank",
    code: "000027",
    ussd: "989#",
    logo: "https://nigerianbanks.xyz/logo/globus-bank.png"
  },
  {
    name: "Guaranty Trust Bank",
    slug: "guaranty-trust-bank",
    code: "058",
    ussd: "737#",
    logo: "https://nigerianbanks.xyz/logo/guaranty-trust-bank.png"
  },
  {
    name: "Hasal Microfinance Bank",
    slug: "hasal-microfinance-bank",
    code: "090121",
    ussd: "322127#",
    logo: "https://nigerianbanks.xyz/logo/default-image.png"
  },
  {
    name: "Jaiz Bank",
    slug: "jaiz-bank",
    code: "301",
    ussd: "389301#",
    logo: "https://nigerianbanks.xyz/logo/default-image.png"
  },
  {
    name: "Keystone Bank",
    slug: "keystone-bank",
    code: "082",
    ussd: "7111#",
    logo: "https://nigerianbanks.xyz/logo/keystone-bank.png"
  },
  {
    name: "Kuda Bank",
    slug: "kuda-bank",
    code: "090267",
    ussd: "",
    logo: "https://nigerianbanks.xyz/logo/kuda-bank.png"
  },
  {
    name: "Lotus Bank",
    slug: "lotus-bank",
    code: "000029",
    ussd: "5045#",
    logo: "https://nigerianbanks.xyz/logo/lotus-bank.png"
  },
  {
    name: "Moniepoint MFB",
    slug: "moniepoint-mfb-ng",
    code: "090405",
    ussd: "5573#",
    logo: "https://nigerianbanks.xyz/logo/moniepoint-mfb-ng.png"
  },
  {
    name: "One Finance",
    slug: "one-finance",
    code: "565",
    ussd: "1303#",
    logo: "https://nigerianbanks.xyz/logo/default-image.png"
  },
  {
    name: "OPay",
    slug: "paycom",
    code: "100004",
    ussd: "955#",
    logo: "https://nigerianbanks.xyz/logo/paycom.png"
  },
  {
    name: "Paga",
    slug: "paga",
    code: "327",
    ussd: "",
    logo: "https://nigerianbanks.xyz/logo/paga.png"
  },
  {
    name: "PalmPay",
    slug: "palmpay",
    code: "100033",
    ussd: "861#",
    logo: "https://nigerianbanks.xyz/logo/palmpay.png"
  },
  {
    name: "Parallex Bank",
    slug: "parallex-bank",
    code: "000030",
    ussd: "3223180#",
    logo: "https://nigerianbanks.xyz/logo/default-image.png"
  },
  {
    name: "Polaris Bank",
    slug: "polaris-bank",
    code: "076",
    ussd: "833#",
    logo: "https://nigerianbanks.xyz/logo/polaris-bank.png"
  },
  {
    name: "Providus Bank",
    slug: "providus-bank",
    code: "101",
    ussd: "",
    logo: "https://nigerianbanks.xyz/logo/default-image.png"
  },
  {
    name: "Rubies MFB",
    slug: "rubies-mfb",
    code: "090175",
    ussd: "7797#",
    logo: "https://nigerianbanks.xyz/logo/default-image.png"
  },
  {
    name: "Sparkle Microfinance Bank",
    slug: "sparkle-microfinance-bank",
    code: "090325",
    ussd: "",
    logo: "https://nigerianbanks.xyz/logo/sparkle-microfinance-bank.png"
  },
  {
    name: "Stanbic IBTC Bank",
    slug: "stanbic-ibtc-bank",
    code: "221",
    ussd: "909#",
    logo: "https://nigerianbanks.xyz/logo/stanbic-ibtc-bank.png"
  },
  {
    name: "Standard Chartered Bank",
    slug: "standard-chartered-bank",
    code: "068",
    ussd: "",
    logo: "https://nigerianbanks.xyz/logo/standard-chartered-bank.png"
  },
  {
    name: "Sterling Bank",
    slug: "sterling-bank",
    code: "232",
    ussd: "822#",
    logo: "https://nigerianbanks.xyz/logo/sterling-bank.png"
  },
  {
    name: "Suntrust Bank",
    slug: "suntrust-bank",
    code: "100",
    ussd: "5230#",
    logo: "https://nigerianbanks.xyz/logo/default-image.png"
  },
  {
    name: "TAJ Bank",
    slug: "taj-bank",
    code: "000026",
    ussd: "898#",
    logo: "https://nigerianbanks.xyz/logo/taj-bank.png"
  },
  {
    name: "TCF MFB",
    slug: "tcf-mfb",
    code: "51211",
    ussd: "908#",
    logo: "https://nigerianbanks.xyz/logo/default-image.png"
  },
  {
    name: "Titan Trust Bank",
    slug: "titan-trust-bank",
    code: "000025",
    ussd: "922#",
    logo: "https://nigerianbanks.xyz/logo/default-image.png"
  },
  {
    name: "Union Bank of Nigeria",
    slug: "union-bank-of-nigeria",
    code: "032",
    ussd: "826#",
    logo: "https://nigerianbanks.xyz/logo/union-bank-of-nigeria.png"
  },
  {
    name: "United Bank For Africa",
    slug: "united-bank-for-africa",
    code: "033",
    ussd: "919#",
    logo: "https://nigerianbanks.xyz/logo/united-bank-for-africa.png"
  },
  {
    name: "Unity Bank",
    slug: "unity-bank",
    code: "215",
    ussd: "7799#",
    logo: "https://nigerianbanks.xyz/logo/default-image.png"
  },
  {
    name: "VFD",
    slug: "vfd",
    code: "090110",
    ussd: "",
    logo: "https://nigerianbanks.xyz/logo/default-image.png"
  },
  {
    name: "Wema Bank",
    slug: "wema-bank",
    code: "035",
    ussd: "945#",
    logo: "https://nigerianbanks.xyz/logo/wema-bank.png"
  },
  {
    name: "Zenith Bank",
    slug: "zenith-bank",
    code: "057",
    ussd: "966#",
    logo: "https://nigerianbanks.xyz/logo/zenith-bank.png"
  }
]

export default SUPPORTED_BANKS;